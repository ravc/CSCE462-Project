from flask import Flask, request, jsonify
from flask_socketio import SocketIO, send, emit
from pymongo import MongoClient
from flask_cors import CORS
import time, sys, math
from utilities import *

client = MongoClient('mongodb://root:example@mongo')
db = client.plantDB
collection = db.plantData

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app, resources={r"*": {"origins": "*"}})

arduinos = {}

@socketio.on('charts', namespace='/frontend')
def get_chart_data(plant_name):
    all_data = collection.find({})
    
    moisture = []
    photo = []
    temp = []
    humidity = []
    for data in all_data:
        try:
            if data['type'] == 'moisture':
                moisture.append((data['time'] * 1000, (1024 - int(data['data']))/1024 * 100))
            elif data['type'] == 'photo':
                photo.append((data['time'] * 1000, (1024 - int(data['data']))/1024 * 100))
            elif data['type'] == 'temp':
                if not math.isnan(float(data['data'])):
                    temp.append((data['time'] * 1000, float(data['data'])))
                else:
                    temp.append((data['time'] * 1000, 0))
            elif data['type'] == 'humidity':
                if not math.isnan(float(data['data'])):
                    temp.append((data['time'] * 1000, float(data['data'])))
                else:
                    temp.append((data['time'] * 1000, 0))
        except:
            pass
    print({'moisture': moisture, 'photo': photo, 'temp': temp, 'humidity': humidity}, file=sys.stderr)
    return jsonify({'moisture': moisture, 'photo': photo, 'temp': temp, 'humidity': humidity})
    
@app.route('/chart_data/<plant>')
def get_chart_data(plant):
    all_data = collection.find({'name': plant})
    
    moisture = []
    photo = []
    temp = []
    humidity = []
    for data in all_data:
        try:
            if data['type'] == 'moisture':
                moisture.append((data['time'] * 1000, (1024 - int(data['data']))/1024 * 100))
            elif data['type'] == 'photo':
                photo.append((data['time'] * 1000, (1024 - int(data['data']))/1024 * 100))
            elif data['type'] == 'temp':
                if not math.isnan(float(data['data'])):
                    temp.append((data['time'] * 1000, float(data['data'])))
                else:
                    temp.append((data['time'] * 1000, 0))
            elif data['type'] == 'humidity':
                if not math.isnan(float(data['data'])):
                    temp.append((data['time'] * 1000, float(data['data'])))
                else:
                    temp.append((data['time'] * 1000, 0))
        except:
            pass
    print({'moisture': moisture, 'photo': photo, 'temp': temp, 'humidity': humidity}, file=sys.stderr)
    return jsonify({'moisture': moisture, 'photo': photo, 'temp': temp, 'humidity': humidity})
    
@socketio.on('plants', namespace='/frontend')
def get_plants(msg):
    all_data = collection.find({}).distinct('name')
    
    data = []
    
    for plant in all_data:
        if plant in arduinos:
            data.append((plant, arduinos[plant]))
        else:
            data.append((plant, ""))
    
    emit('all_plants', data)
    

@socketio.on('test', namespace='/frontend')
def handle_test(message):
    emit('test', message)
    
@socketio.on('connect', namespace='/frontend')
def frontend_connect():
    emit('connect', True)
    
@socketio.on('disconnect', namespace='/frontend')
def frontend_disconnect():
    pass

@app.route('/arduino/<plant>/connect', methods=['POST'])
def arduino_connected(plant):
    arduinos[plant] = request.data.decode("utf-8")
    return "200"

@app.route('/arduino/<plant>/moisture', methods=['POST'])
def arduino_moisture_data(plant):
    data = {'name': plant, 'type': 'moisture', 'data': request.data, 'time': time.time()}
    collection.insert_one(data)
    return "200"

@app.route('/arduino/<plant>/photoSensor', methods=['POST'])
def arduino_photo_data(plant):
    data = {'name': plant, 'type': 'photo', 'data': request.data, 'time': time.time()}
    collection.insert_one(data)
    return "200"

@app.route('/arduino/<plant>/temp', methods=['POST'])
def arduino_temp_data(plant):
    data = {'name': plant, 'type': 'temp', 'data': request.data, 'time': time.time()}
    collection.insert_one(data)
    return "200"

@app.route('/arduino/<plant>/humidity', methods=['POST'])
def arduino_humidity_data(plant):
    data = {'name': plant, 'type': 'humidity', 'data': request.data, 'time': time.time()}
    collection.insert_one(data)
    return "200"

@app.route('/arduino/<plant>/heat')
def arduino_head_pad_state(plant):
    data = collection.find({"name": plant, "type": "humidity"}).sort("time", -1).limit(1)
    returnData = 0
    
    for doc in data:
        returnData = float(doc['data'])
        
    return control_humidity(returnData)

@app.route('/arduino/<plant>/solenoid')
def arduino_solenoplant_state(plant):
    data = collection.find({"name": plant, "type": "moisture"}).sort("time", -1).limit(1)
    returnData = 0
    
    for doc in data:
        returnData = float(doc['data'])
    
    return control_water(returnData)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True)
