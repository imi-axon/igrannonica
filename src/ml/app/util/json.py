from json import JSONDecoder, JSONEncoder

# ==== JSON ====

# Konvertuje JSON string u objekat
def json_decode(json_str: str):

    return JSONDecoder().decode(json_str)


# Konvertuje objekat/listu u JSON string
def json_encode(obj):

    return JSONEncoder().encode(obj)