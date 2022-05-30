using BackApi.Entities;
using BackApi.Models;
using BackApi.Config;
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
        public Task<Boolean> MlTraining(WebSocket webSocket, ApiNNTrain packet, WebSocket webSocketMl);
        public Task<HttpResponseMessage> NNCreateTemp(int id,string name,string datapath); 
        public string GetNewName(int projid);
        public int GetNNid(int projid, string name);
        public string NNIdToPath(int nnid);
        public string ListNN(int userid, int projid);
        public string NNIdToCfg(int nnid);
        public string NNIdToTrainrez(int nnid);
        public Boolean DeleteNN(int nnid);
        public Boolean EditTitle(int nnid, int projid, string title);
        public bool AddNote(int projid, int nnid, string note);
        public string GetNote(int projid, int nnid, out bool ind);
        public string GetNamebyId(int nnid);
        public string ListOfNNsInTraining(int userid, int[] keys);
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

        public async Task<Boolean> MlTraining(WebSocket webSocket,ApiNNTrain packet,WebSocket webSocketMl)
        {
            //prosledjivanje pocetne konfiguracije ml delu
            var buffer = new byte[1024 * 4];
            var fromFrontconf = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            packet.newconf = Encoding.UTF8.GetString(buffer, 0, fromFrontconf.Count);
            var MlJson = JsonConvert.SerializeObject(packet);
            var toMLconf = Encoding.UTF8.GetBytes(MlJson);
            await webSocketMl.SendAsync(new ArraySegment<byte>(toMLconf, 0, MlJson.Length), WebSocketMessageType.Text , true, CancellationToken.None);
            var resultml = await webSocketMl.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None); // 0 novo treniranje, inace broj prethodnih epoha
            
            while (!resultml.CloseStatus.HasValue)
            {
                if (webSocket.CloseStatus.HasValue)//ako korisnik brzo otkaze trening
                {
                    await webSocketMl.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client closing w handshake", CancellationToken.None);
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure,"Client closing w handshake", CancellationToken.None);
                    return true;
                }

                /*
                var strepnum= Encoding.UTF8.GetString(buffer, 0, resultml.Count);//prikaz prethodno istreniranih epoha
                int epnum= int.Parse(strepnum);
                for (int i = 0; i < epnum; i++)
                {
                    resultml = await webSocketMl.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                    var tmpprev = Encoding.UTF8.GetString(buffer, 0, resultml.Count);
                    var toFronttrainprev = Encoding.UTF8.GetBytes(tmpprev);
                    await webSocket.SendAsync(new ArraySegment<byte>(toFronttrainprev, 0, tmpprev.Length), resultml.MessageType, resultml.EndOfMessage, CancellationToken.None);
                }
                */
                
                /*var fromFronttrain = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                var playstop = Encoding.UTF8.GetString(buffer, 0, fromFronttrain.Count);
                while (playstop == "\"play\"")*///sve dok sa fronta stize "play" salju im se rezultati sledece epohe
                //{
                    /*var toMLtrain= Encoding.UTF8.GetBytes(playstop);
                    await webSocketMl.SendAsync(new ArraySegment<byte>(toMLtrain, 0, playstop.Length), WebSocketMessageType.Text, true, CancellationToken.None);*/
                    resultml = await webSocketMl.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                    var tmp = Encoding.UTF8.GetString(buffer, 0, resultml.Count);
                    if(tmp == "end") //ako se trening zavrsio do kraja bez stop, posalji json mreze i zatvori sockete
                    {
                        resultml = await webSocketMl.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                        tmp = Encoding.UTF8.GetString(buffer, 0, resultml.Count);
                        var toFrontJson = Encoding.UTF8.GetBytes(tmp);
                        await webSocket.SendAsync(new ArraySegment<byte>(toFrontJson, 0, tmp.Length), resultml.MessageType, resultml.EndOfMessage, CancellationToken.None);

                        await webSocketMl.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client closing w handshake", CancellationToken.None);
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client closing w handshake", CancellationToken.None);
                        return true;
                    }
                    var toFronttrain= Encoding.UTF8.GetBytes(tmp);
                    await webSocket.SendAsync(new ArraySegment<byte>(toFronttrain, 0, tmp.Length), resultml.MessageType, resultml.EndOfMessage, CancellationToken.None);


                    /*fromFronttrain = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                    playstop = Encoding.UTF8.GetString(buffer, 0, fromFronttrain.Count);*/
                //}
                /*if (playstop == "stop")//kad sa fronta stigne stop, zaustavlja se treniranje, i salje se json mreze i zatvaraju se socketi
                {
                    var toMLtrain = Encoding.UTF8.GetBytes(playstop);
                    await webSocketMl.SendAsync(new ArraySegment<byte>(toMLtrain, 0, playstop.Length), WebSocketMessageType.Text, true, CancellationToken.None);
                    resultml = await webSocketMl.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                    var tmp = Encoding.UTF8.GetString(buffer, 0, resultml.Count);
                    var toFronttrain = Encoding.UTF8.GetBytes(tmp);
                    await webSocket.SendAsync(new ArraySegment<byte>(toFronttrain, 0, tmp.Length), resultml.MessageType, resultml.EndOfMessage, CancellationToken.None);

                    await webSocketMl.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client stopped training", CancellationToken.None);
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client stopped training", CancellationToken.None);
                    return true;
                }*/
                    
            }
            await webSocketMl.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client closing w handshake", CancellationToken.None);
            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client closing w handshake", CancellationToken.None);
            return true;
        }
        public string GetNewName(int projid)
        {
            string constname = "Untitled-Network";
            string name = constname;
            int exp = 2;
            while (true)
            {
                if (kontext.NNs.Any(x => x.ProjectId == projid && x.NNName == name))
                {
                    name = constname;
                    name = name + "-" + exp;
                    exp = exp + 1;
                }
                else
                    break;
            }
            return name;
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
            xd.conf = NNAddConfig(nnid);
            if (xd.conf == null)
            {
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }
            xd.trainrez = NNAddTrainRez(nnid);
            if (xd.trainrez == null)
            {
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }
            /*await File.WriteAllTextAsync(xd.trainrez, "");
            await File.WriteAllTextAsync(xd.nn, "");
            await File.WriteAllTextAsync(xd.conf, "");*/

            xd.nn = xd.nn.Replace('\\', '/');
            xd.conf = xd.conf.Replace('\\', '/');
            xd.trainrez = xd.trainrez.Replace('\\', '/');

            var myContent = JsonConvert.SerializeObject(xd);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            response = await client.PutAsync(Urls.ml + "/api/nn/default",byteContent);

            var proj = kontext.Projects.FirstOrDefault(x => x.ProjectId == id);
            if (proj != null)
                proj.LastEdit = DateTime.Now;
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
            nn.TrainrezPath = "";
            nn.Notes = "";
            nn.CreationDate = DateTime.Now;
            nn.LastEdited = nn.CreationDate;

            kontext.Add(nn);
            kontext.SaveChanges();

            nnid = nn.NNId;
            var path = storageService.CreateNNFile(projid, nnid);
            nn.DataPath=path;

            kontext.Entry(nn).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            kontext.SaveChanges();

            return path;
        }
        public Boolean EditTitle(int nnid, int projid, string title)
        {
            var nn = kontext.NNs.FirstOrDefault(x => x.NNId == nnid && x.ProjectId == projid);
            if (nn == null)
                return false;
            nn.NNName = title;
            nn.LastEdited = DateTime.Now;

            var proj = kontext.Projects.FirstOrDefault(x => x.ProjectId == projid);
            if (proj != null)
                proj.LastEdit = nn.LastEdited;
            kontext.SaveChanges();
            return true;
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

            var rez = new StringBuilder();
            rez.Append("[");
            List<NN> listNNs = kontext.NNs.Where(x => x.ProjectId == projid).ToList();
            foreach (NN n in listNNs)
            {
                rez.Append("{");
                rez.Append("\"" + "id" + "\":" + "\"" + n.NNId + "\",");
                rez.Append("\"" + "name" + "\":" + "\"" + n.NNName + "\"");
                rez.Append("},");
            }
            if (rez.Length > 2) rez.Remove(rez.Length - 1, 1);
            rez.Append("]");
            return rez.ToString();
        }
        public string NNAddConfig(int nnid)
        {
            var nn = kontext.NNs.FirstOrDefault(x => x.NNId == nnid);
            if(nn == null)
                return null;

            var path = storageService.CreateNNCfg(nn.ProjectId, nnid);
            nn.ConfPath = path;

            nn.LastEdited = DateTime.Now;
            kontext.Entry(nn).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            kontext.SaveChanges();

            return path;
        }
        public string NNAddTrainRez(int nnid)
        {
            var nn = kontext.NNs.FirstOrDefault(x => x.NNId == nnid);
            if (nn == null)
                return null;

            var path = storageService.CreateNNtrainrez(nn.ProjectId, nnid);
            nn.TrainrezPath = path;

            nn.LastEdited = DateTime.Now;
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
        public string NNIdToTrainrez(int nnid)
        {
            NN nn = kontext.NNs.FirstOrDefault(x => x.NNId == nnid);
            if (nn != null)
                return nn.TrainrezPath;
            return null;
        }

        public Boolean DeleteNN(int nnid)
        {
            var nn= kontext.NNs.FirstOrDefault(x => x.NNId == nnid);
            if(nn == null)
                return false;
            storageService.DeletePath(nn.ConfPath);
            storageService.DeletePath(nn.DataPath);
            storageService.DeletePath(nn.TrainrezPath);

            kontext.NNs.Remove(nn);
            var proj = kontext.Projects.FirstOrDefault(x => x.ProjectId == nn.ProjectId);
            if (proj != null)
                proj.LastEdit = DateTime.Now;
            kontext.SaveChanges();

            return true;
        }
        public bool AddNote(int projid, int nnid, string note)
        {
            var nn = kontext.NNs.FirstOrDefault(x => x.NNId == nnid && x.ProjectId==projid);
            if (nn==null)
                return false;
            nn.Notes = note;
            nn.LastEdited = DateTime.Now;
            var proj = kontext.Projects.FirstOrDefault(x => x.ProjectId == projid);
            if (proj != null)
                proj.LastEdit = nn.LastEdited;
            kontext.SaveChanges();
            return true;
        }
        public string GetNote(int projid, int nnid, out bool ind)
        {
            var nn = kontext.NNs.FirstOrDefault(x => x.NNId == nnid && x.ProjectId == projid);
            if (nn == null)
            {
                ind = false;
                return "";
            }
            ind = true;
            return nn.Notes;
        }

        public string GetNamebyId(int nnid)
        {
            var nn = kontext.NNs.Find(nnid);
            if (nn != null)
                return nn.NNName;
            else return "";
        }

        public string ListOfNNsInTraining(int userid ,int[] keys)
        {
            var str = new StringBuilder();
            str.Append('[');
            foreach(int nnid in keys)
            {
                var nn = kontext.NNs.FirstOrDefault(x => x.NNId == nnid);
                if (nn != null)
                {
                    var proj = kontext.Projects.Find(nn.ProjectId);
                    if(proj != null)
                    {
                        if(userid == proj.UserId)
                        {
                            str.Append("{ \"Eksperiment\":\"");
                            str.Append(proj.Name);
                            str.Append("\",");
                            str.Append("{ \"Mreza\":\"");
                            str.Append(nn.NNName);
                            str.Append("\"},");
                        }
                    }
                }
            }
            if(str.Length > 1) str.Remove(str.Length - 1, 1);
            str.Append(']');
            return str.ToString();
        }
    }
}