import socket
import sys

PORT = 5050
HEADER = 64
FORMAT = 'utf-8'
SERVER = '192.168.75.33'
DISCONNECT_MESSAGE = '!DISCONNECT'
ADDR = (SERVER, PORT)

# Socket creation and connection
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(ADDR)

# Send message
def send(msg: str):
    message = msg.encode(FORMAT)
    print(f'DEBUG: Message length = {len(message)}')

    message_length = str(len(message)).encode(FORMAT) # bytes (of some length) that represent the number that represents the "message"
    print(f'DEBUG: Message length length = {len(message_length)}')

    message_length += b' ' * (HEADER - len(message_length)) # expanding the bytes value to be of length HEADER while keeping actual value the same
    print(f'DEBUG: Corrected Message length length = {len(message_length)}')

    client.send(message_length)
    client.send(message)

# Send
if len(sys.argv) > 0:
    for arg in sys.argv[1:]:
        print(arg)
        send(arg)

send('!DISCONNECT')
