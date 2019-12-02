HUMIDITY_LOW = 30
HUMIDITY_HIGH = 70
TEMP_LOW = 50
TEMP_HIGH = 80
MOISTURE_LOW = 358
MOISTURE_HIGH = 256

def control_water(moisture_level):
    if moisture_level >= MOISTURE_LOW:
        return "ON"
    elif moisture_level < MOISTURE_HIGH:
        return "OFF"
    
    return "ERR"

def control_temp(current_temp):
    if current_temp <= TEMP_LOW:
        return "ON"
    elif current_temp > TEMP_HIGH:
        return "OFF"
    
    return "ERR"

def control_humidity(humidity_level):
    if humidity_level <= HUMIDITY_LOW:
        return "ON"
    elif humidity_level > HUMIDITY_HIGH:
        return "OFF"
    
    return "ERR"
