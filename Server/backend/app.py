from flask import Flask, request
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

clients = []
frontends = []

@socketio.on('test', namespace='/frontend')
def handle_test(message):
    emit('test', message)
    
@socketio.on('connect', namespace='/arduino')
def arduino_connect():
    clients.append(request.sid)
    emit('connect', True)
    
@socketio.on('disconnect', namespace='/arduino')
def arduino_disconnect():
    clients.remove(request.sid)
    
@socketio.on('connect', namespace='/frontend')
def frontend_connect():
    frontends.append(request.sid)
    emit('connect', True)
    
@socketio.on('disconnect', namespace='/frontend')
def frontend_disconnect():
    frontends.remove(request.sid)
    
@app.route('/')
def index():
    return 'test'

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True)
