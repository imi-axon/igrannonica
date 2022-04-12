using BackApi.Entities;
using System.Net.WebSockets;

namespace BackApi.Services
{

    public interface IWSQueue
    {
        public Boolean CheckInDict(int nnid);
        public Boolean PullFromDict(int nnid, out WebSocket ws);
        public void AddToDict(int nnid, WebSocket ws);
        public void DeleteFromDict(int nnid);
    }
    public class WSQueue: IWSQueue
    {
        private Dictionary<int,WebSocket> WSDict = new Dictionary<int,WebSocket>();

        private DataBaseContext kontext;
        private readonly IConfiguration configuration;
        private static IStorageService storageService = new StorageService();

        public WSQueue(DataBaseContext datasetContext, IConfiguration configuration)
        {
            kontext = datasetContext;
            this.configuration = configuration;
        }
        public Boolean CheckInDict(int nnid)
        {
            Boolean result = WSDict.ContainsKey(nnid);
            return result;
        }
        public Boolean PullFromDict(int nnid,out WebSocket ws)
        {
            Boolean result = WSDict.TryGetValue(nnid, out ws);
            return result;
        }

        public void AddToDict(int nnid, WebSocket ws)
        {
            WSDict.Add(nnid, ws);
        }
        public void DeleteFromDict(int nnid)
        {
            WSDict.Remove(nnid);
        }
    }
}
