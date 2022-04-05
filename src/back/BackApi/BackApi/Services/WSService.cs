using System.Net.WebSockets;
using System.Text;

namespace BackApi.Services
{
    public interface IWSService
    {
        public Task MlTraining(WebSocket webSocket);
    }

    public class WSService: IWSService
    {
        public async Task MlTraining(WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            var mes = Encoding.UTF8.GetString(buffer, 0, result.Count);

            while (!result.CloseStatus.HasValue)
            {               
                for(int i=1; i<=10; i++)
                {
                    int tmp = int.Parse(mes)*i;
                    var resp = $"{i} : {tmp}";
                    var replbuffer= Encoding.UTF8.GetBytes(resp);
                    await Task.Delay(1000);
                    await webSocket.SendAsync(new ArraySegment<byte>(replbuffer, 0, resp.Length), result.MessageType, result.EndOfMessage, CancellationToken.None);
                }
                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                mes = Encoding.UTF8.GetString(buffer, 0, result.Count);
            }

            await webSocket.CloseAsync(result.CloseStatus.Value,result.CloseStatusDescription,CancellationToken.None);
        }
    }
}
