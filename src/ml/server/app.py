from file_utils import *
from flask import Flask, request

app = Flask(__name__)

# ==== Routes ====

# Aktivnost: Add Data Set
@app.route('/api/dataset/validate/csv', methods=['POST'])
def validate_csv():

    print('Pocetak kontrolera (za Add Dataset)')

    csvstring = request.data.decode()

    if csv_is_valid(csvstring):
        return ('CSV je u ispravnom formatu', 201)

    return ('CSV nije u ispravnom formatu', 400)


# Aktivnost: Get Data Set
@app.route('/api/dataset/convert/json', methods=['POST'])
def convert_csv_to_json():

    print('Pocetak kontrolera (za Get Dataset)')

    csvstring = request.data.decode()
    # print(csvstring)
    resp = None

    try:
        obj = csv_decode(csvstring)
        # print(obj)
        resp = json_encode(obj)
        # print(resp)
    except:
        return ('CSV nije u ispravnom formatu', 400)

    return (resp, 201)


