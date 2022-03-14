import json
from flask import Flask, request

app = Flask(__name__)

@app.route('/', methods=['POST'])
def send_csv():
    try:
        # data = '{"A":"1","B":"2","C":"3"}'
        data = request.data.decode()
        converted = json.JSONDecoder().decode(data)
        print(converted)
    except:
        print('Conversion Error')

    return '---'