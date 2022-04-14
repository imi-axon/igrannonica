﻿using BackApi.Entities;
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

        public async Task<Boolean> MlTraining(WebSocket webSocket,ApiNNTrain packet,WebSocket webSocketMl)
        {
            //prosledjivanje pocetne konfiguracije ml delu, za pocetak treniranja se "ceka play"
            var buffer = new byte[1024 * 4];
            var fromFrontconf = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            packet.newconf = Encoding.UTF8.GetString(buffer, 0, fromFrontconf.Count);
            var MlJson = JsonConvert.SerializeObject(packet);
            var toMLconf = Encoding.UTF8.GetBytes(MlJson);
            await webSocketMl.SendAsync(new ArraySegment<byte>(toMLconf, 0, MlJson.Length), WebSocketMessageType.Text , true, CancellationToken.None);
            var resultml = await webSocketMl.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            while (!resultml.CloseStatus.HasValue)
            {
                if (webSocket.CloseStatus.HasValue)//ako korisnik brzo otkaze trening
                {
                    await webSocketMl.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client closing w handshake", CancellationToken.None);
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure,"Client closing w handshake", CancellationToken.None);
                    return true;
                }
                var fromFronttrain = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                var playstop = Encoding.UTF8.GetString(buffer, 0, fromFronttrain.Count);
                Debug.WriteLine(">>>>>>>>>>>> " + playstop);
                while (playstop == "\"play\"")//sve dok sa fronta stize "play" salju im se rezultati sledece epohe
                {
                    Debug.WriteLine(" >>>>>> While Loop <<<<< ");
                    var toMLtrain= Encoding.UTF8.GetBytes(playstop);
                    Debug.WriteLine(">>>>>>>>>>>> Send To ML" + playstop);
                    await webSocketMl.SendAsync(new ArraySegment<byte>(toMLtrain, 0, playstop.Length), WebSocketMessageType.Text, true, CancellationToken.None);
                    Debug.WriteLine(">>>>>>>>>>>> Wait From ML");
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


                    fromFronttrain = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                    playstop = Encoding.UTF8.GetString(buffer, 0, fromFronttrain.Count);
                }
                if (playstop == "stop")//kad sa fronta stigne stop, zaustavlja se treniranje, i salje se json mreze i zatvaraju se socketi
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
                }
                    
            }
            await webSocketMl.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client closing w handshake", CancellationToken.None);
            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client closing w handshake", CancellationToken.None);
            return true;
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
            //File.Create(xd.nn);
            xd.conf = NNAddConfig(nnid);
            if (xd.conf == null)
            {
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }
            //File.Create(xd.conf);

            xd.nn = xd.nn.Replace('\\', '/');
            xd.conf = xd.conf.Replace('\\', '/');

            var myContent = JsonConvert.SerializeObject(xd);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            response = await client.PutAsync(Urls.ml + "/api/nn/default",byteContent);

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