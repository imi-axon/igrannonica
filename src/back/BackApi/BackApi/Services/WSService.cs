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
    public interface IWSService
    {
        public Task MlTraining(WebSocket webSocket, ApiNNTrain packet);
        public Task<HttpResponseMessage> NNCreateTemp(int id,string name);
        public int GetNNid(int projid, string name);
        public string NNIdToPath(int nnid);
    }

    public class WSService: IWSService
    {
        private DataBaseContext kontext;
        private readonly IConfiguration configuration;
        private static IStorageService storageService = new StorageService();

        public WSService(DataBaseContext datasetContext, IConfiguration configuration)
        {
            kontext = datasetContext;
            this.configuration = configuration;
        }

        public async Task MlTraining(WebSocket webSocket,ApiNNTrain packet)
        {
            var buffer = new byte[1024 * 4];
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            packet.conf = Encoding.UTF8.GetString(buffer, 0, result.Count);
            Debug.WriteLine(packet.conf);
            var mes = Encoding.UTF8.GetString(buffer, 0, result.Count);

            try
            {
                var resp = JsonConvert.SerializeObject(packet);
                var replbuffer = Encoding.UTF8.GetBytes(resp);
                //await webSocket.SendAsync(new ArraySegment<byte>(replbuffer, 0, resp.Length), result.MessageType, result.EndOfMessage, CancellationToken.None);
                
                Debug.WriteLine("Pre ClientWebSocket");
                var webSocketMl = new ClientWebSocket();
                Debug.WriteLine("Nakon ClientWebSocket");
                await webSocketMl.ConnectAsync(new Uri("ws://localhost:8000/api/nn/train/start"),CancellationToken.None); // proveriti da li ml deo hostuje ws ili wss
                await webSocketMl.SendAsync(new ArraySegment<byte>(replbuffer, 0, resp.Length), result.MessageType, result.EndOfMessage, CancellationToken.None);
                var resultml = await webSocketMl.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                while (!resultml.CloseStatus.HasValue)
                {
                    if (webSocket.CloseStatus.HasValue)
                    {
                        webSocket.Abort();
                        webSocket.Dispose();
                        await webSocketMl.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
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

        public async Task<HttpResponseMessage> NNCreateTemp(int id,string name)
        {
            HttpClient client = new HttpClient();
            var response = await client.GetAsync("http://localhost:8000/api/nn/new/default", HttpCompletionOption.ResponseHeadersRead);
            if (response.StatusCode == HttpStatusCode.OK)
            {       
                using (Stream streamToReadFrom = await response.Content.ReadAsStreamAsync())
                {
                    string path = CreateNN(id, name);
                    if(path == null)
                    {
                        response.StatusCode = HttpStatusCode.NotFound;
                        return response;
                    }

                    using (Stream stream = File.Open(path, FileMode.Create))
                    {
                        await streamToReadFrom.CopyToAsync(stream);
                    }
                }
            }
            return response;
        }
        public string CreateNN(int projid,string name)
        {
            var tmp = kontext.NNs.FirstOrDefault(x=>x.NNName==name && x.ProjectId==projid);
            if (tmp != null)
                return null;
            var nn = new NN();
            nn.ProjectId = projid;
            nn.NNName=name;

            kontext.Add(nn);
            kontext.SaveChanges();

            int nnid = nn.NNId;
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
    }
}
