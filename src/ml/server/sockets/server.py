import socket
import threading
import time

PORT = 5050
SERVER = socket.gethostbyname(socket.gethostname())
ADDR = (SERVER, PORT)
HEADER = 64 # length in bytes of the message that cointains number that represents length in bytes of the next "real" message (sent for every "real" message)
FORMAT = 'utf-8'
DISCONNECT_MESSAGE = '!DISCONNECT'

# Socket creation and binding
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(ADDR)

# handle client
def handle_client(conn : socket.socket, addr):
    print(f'[NEW CONNECTION] {addr} connected.')

    connected = True
    while connected:
        msg_length = conn.recv(HEADER).decode(FORMAT) # blocking | receiving length in bytes of the next message
        if msg_length: # if is not the "initial empty message", if it has message length
            msg_length = int(msg_length) # same but converted to int
            msg = conn.recv(msg_length).decode(FORMAT) # blocking | receiving message of msg_length bytes
            if msg == DISCONNECT_MESSAGE:
                connected = False # to disconnect
            print(f'[{addr}] {msg}')
    
    conn.close() # close connection
    print(f'[CONNECTION CLOSED] {addr} disconnected.')

# handle new conns, and distribute those where they need to go
def start():
    server.listen()
    print(f'[LISTENITG] Server is listening on {SERVER}')
    while True:
        conn, addr = server.accept() # blocking
        thread = threading.Thread(target=handle_client, args=(conn, addr))
        thread.start()
        print(f'[ACTIVE CONNECTIONS] {threading.active_count() - 1}')

# Start
print(f'[STARTING SERVER] Server is starting...')
start()