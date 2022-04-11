using BackApi.Entities;
using BackApi.Models;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Net;
using System.Net.Http.Headers;
using System.Net.WebSockets;
using System.Text;

namespace BackApi.Services
{
    public interface INNservice
    {
        public Task MlTraining(WebSocket webSocket, ApiNNTrain packet);
        public Task<HttpResponseMessage> NNCreateTemp(int id,string name,string datapath);
        public int GetNNid(int projid, string name);
        public string NNIdToPath(int nnid);
        public string ListNN(int userid, int projid);
        public string NNIdToCfg(int nnid);
    }

    public class NNservice: INNservice
    {
        private DataBaseContext kontext;
        private readonly IConfiguration configuration;
        private static IStorageService storageService = new StorageService();

        public NNservice(DataBaseContext datasetContext, IConfiguration configuration)
        {
            kontext = datasetContext;
            this.configuration = configuration;
        }

        public async Task MlTraining(WebSocket webSocket,ApiNNTrain packet)
        {
            var buffer = new byte[1024 * 4];
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            packet.newconf = Encoding.UTF8.GetString(buffer, 0, result.Count);
            //Debug.WriteLine(packet.newconf);
            var mes = Encoding.UTF8.GetString(buffer, 0, result.Count);

            try
            {
                var resp = JsonConvert.SerializeObject(packet);
                var replbuffer = Encoding.UTF8.GetBytes(resp);
                //await webSocket.SendAsync(new ArraySegment<byte>(replbuffer, 0, resp.Length), result.MessageType, result.EndOfMessage, CancellationToken.None);
                
                //Debug.WriteLine("Pre ClientWebSocket");
                var webSocketMl = new ClientWebSocket();
                //Debug.WriteLine("Nakon ClientWebSocket");
                await webSocketMl.ConnectAsync(new Uri("ws://localhost:8000/api/nn/train/start"),CancellationToken.None); // proveriti da li ml deo hostuje ws ili wss
                await webSocketMl.SendAsync(new ArraySegment<byte>(replbuffer, 0, resp.Length), result.MessageType, result.EndOfMessage, CancellationToken.None);
                var resultml = await webSocketMl.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                //var playstopres=await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                //var playstop = Encoding.UTF8.GetString(buffer, 0, playstopres.Count);
                while (!resultml.CloseStatus.HasValue)
                {
                    if (webSocket.CloseStatus.HasValue)
                    {
                        webSocket.Abort();
                        webSocket.Dispose();
                        await webSocketMl.CloseAsync(resultml.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
                        webSocketMl.Abort();
                        webSocketMl.Dispose();
                    
                     }

                    resultml = await webSocketMl.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                    var tmp = Encoding.UTF8.GetString(buffer, 0, resultml.Count);
                    var tofront = Encoding.UTF8.GetBytes(tmp);
                    await webSocket.SendAsync(new ArraySegment<byte>(tofront, 0, tmp.Length), resultml.MessageType, resultml.EndOfMessage, CancellationToken.None);
                }
                await webSocketMl.CloseAsync(resultml.CloseStatus.Value, resultml.CloseStatusDescription, CancellationToken.None);
            }
            catch (Exception ex)
            {
                webSocket.Abort();
                webSocket.Dispose();
            }

            /*while (!result.CloseStatus.HasValue)
            {
                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                for (int i=1; i<=10; i++)
                {
                    int tmp = int.Parse(mes)*i;
                    var resp = $"{i} : {tmp}";
                    var replbuffer= Encoding.UTF8.GetBytes(resp);
                    //await Task.Delay(50);
                    await webSocket.SendAsync(new ArraySegment<byte>(replbuffer, 0, resp.Length), result.MessageType, result.EndOfMessage, CancellationToken.None);
                }
                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                mes = Encoding.UTF8.GetString(buffer, 0, result.Count);
            }*/
            await webSocket.CloseAsync(result.CloseStatus.Value,result.CloseStatusDescription,CancellationToken.None);
        }

        public async Task<HttpResponseMessage> NNCreateTemp(int id,string name,string datapath)
        {
            HttpClient client = new HttpClient();
            HttpResponseMessage response= new HttpResponseMessage();
            var xd = new NNCreate();
            int nnid;
            using (StreamReader reader = new StreamReader(datapath))
            {
                xd.headers = reader.ReadLine() ?? "";
            }
            xd.nn = CreateNN(id, name, out nnid);
            if(xd.nn==null)
            {
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }
            File.Create(xd.nn);
            xd.conf = NNAddConfig(nnid);
            if (xd.conf == null)
            {
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }
            File.Create(xd.conf);

            xd.nn = xd.nn.Replace('\\', '/');
            xd.conf = xd.conf.Replace('\\', '/');

            var myContent = JsonConvert.SerializeObject(xd);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            response = await client.PutAsync("http://localhost:8000/api/nn/new/default",byteContent);

            /*if (response.StatusCode == HttpStatusCode.OK)
            {       
                using (Stream streamToReadFrom = await response.Content.ReadAsStreamAsync())
                {
                    int nnid;
                    string path = CreateNN(id, name,out nnid);
                    if(path == null)
                    {
                        response.StatusCode = HttpStatusCode.NotFound;
                        return response;
                    }

                    using (Stream stream = File.Open(path, FileMode.Create))
                    {
                        await streamToReadFrom.CopyToAsync(stream);
                    }
                    //zakomentarisano dok se ne implementira dobijanje cfg fajla od ml dela, link izmeniti po implementaciji na ml
                    var cfg = await client.GetAsync("http://localhost:8000/api/nn/cfg/default", HttpCompletionOption.ResponseHeadersRead);
                    if (cfg.StatusCode == HttpStatusCode.OK)
                    {
                        using (Stream cfgStream = await cfg.Content.ReadAsStreamAsync())
                        {
                            string cfgpath = NNAddConfig(nnid);

                            using (Stream stream = File.Open(cfgpath, FileMode.Create))
                            {
                                await cfgStream.CopyToAsync(stream);
                            }
                        }
                    }
                }
            }*/
            return response;
        }
        public string CreateNN(int projid,string name,out int nnid)
        {
            var tmp = kontext.NNs.FirstOrDefault(x=>x.NNName==name && x.ProjectId==projid);
            if (tmp != null)
            {
                nnid = -1;
                return null;
            }
            var nn = new NN();
            nn.ProjectId = projid;
            nn.NNName=name;
            nn.DataPath = "";
            nn.ConfPath = "";

            kontext.Add(nn);
            kontext.SaveChanges();

            nnid = nn.NNId;
            var path = storageService.CreateNNFile(projid, nnid);
            nn.DataPath=path;

            kontext.Entry(nn).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            kontext.SaveChanges();

            return path;
        }

        public int GetNNid(int projid,string name)
        {
            var tmp = kontext.NNs.FirstOrDefault(x => x.ProjectId==projid && x.NNName==name);
            if(tmp != null)
                return tmp.NNId;
            return -1;
        }

        public string NNIdToPath(int nnid)
        {
            NN nn = kontext.NNs.FirstOrDefault(x => x.NNId == nnid);
            if (nn != null)
                return nn.DataPath;
            return null;
        }

        public string ListNN(int userid, int projid)
        {
            var tmp = kontext.Projects.FirstOrDefault(x => x.ProjectId == projid && x.UserId == userid);
            if (tmp == null)
                return "Projekat za datog korisnika ne postoji";

            var rez = new StringBuilder();
            rez.Append("[");
            List<NN> listNNs = kontext.NNs.Where(x => x.ProjectId == projid).ToList();
            foreach (NN n in listNNs)
            {
                rez.Append("{");
                rez.Append("\"" + "name" + "\":" + "\"" + n.NNName + "\"");
                rez.Append("},");
            }
            if (rez.Length > 2) rez.Remove(rez.Length - 1, 1);
            rez.Append("]");
            return rez.ToString();
        }

        /*public ApiNNTrain MlPacket(ApiNNCfg cfg,int nnid,int projid)
        {
            HttpClient client = new HttpClient();
            var novi = new ApiNNTrain();

            var myContent = JsonConvert.SerializeObject(novi);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var result = await client.PostAsync("http://localhost:8000/api/dataset/edit", byteContent);

            return result;
        }*/

        public string NNAddConfig(int nnid)
        {
            var nn = kontext.NNs.FirstOrDefault(x => x.NNId == nnid);
            if(nn == null)
                return null;

            var path = storageService.CreateNNCfg(nn.ProjectId, nnid);
            nn.ConfPath = path;

            kontext.Entry(nn).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            kontext.SaveChanges();

            return path;
        }

        public string NNIdToCfg(int nnid)
        {
            NN nn = kontext.NNs.FirstOrDefault(x => x.NNId == nnid);
            if (nn != null)
                return nn.ConfPath;
            return null;
        }
    }
}