from flask import Flask, request
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

clients = []
frontends = []

@socketio.on('test', namespace='/frontend')
def handle_test(message):
    print(message)
    emit('test', message)
    
@socketio.on('connect', namespace='/arduino')
def arduino_connect():
    print(f'New connection with sid: {request.sid}')
    clients.append(request.sid)
    
@socketio.on('disconnect', namespace='/arduino')
def arduino_disconnect():
    print(f'Client with sid: {request.sid} disconnected')
    clients.remove(request.sid)
    
@socketio.on('connect', namespace='/frontend')
def frontend_connect():
    print(f'New frontend connection with sid: {request.sid}')
    frontends.append(request.sid)
    emit('connect', f'You are connected {request.sid}')
    
@socketio.on('disconnect', namespace='/frontend')
def frontend_disconnect():
    print(f'Frontend with sid: {request.sid} disconnected')
    frontends.remove(request.sid)
    
@app.route('/')
def index():
    return 'test'

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True)
