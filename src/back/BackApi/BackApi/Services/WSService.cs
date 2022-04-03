using System.Net.WebSockets;

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
            var receiveResult = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            while (!receiveResult.CloseStatus.HasValue)
            {
                await webSocket.SendAsync(new ArraySegment<byte>(buffer, 0, receiveResult.Count),receiveResult.MessageType,receiveResult.EndOfMessage,CancellationToken.None);
                receiveResult = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }

            await webSocket.CloseAsync(receiveResult.CloseStatus.Value,receiveResult.CloseStatusDescription,CancellationToken.None);
        }
    }
}
