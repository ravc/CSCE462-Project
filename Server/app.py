from flask import Flask
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
socketio = SocketIO(app)

@socketio.on('test')
def handle_test(message):
    send(message)

if __name__ == '__main__':
    socketio.run(app)
