import os
from datetime import datetime

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

def get_database():
    user = os.getenv("MONGO_USER")
    pwd = os.getenv("MONGO_PASSWORD")
    host = "localhost"
    db_name = os.getenv("MONGO_DB")

    conn_string = f"mongodb://{user}:{pwd}@{host}/{db_name}"
    
    client = MongoClient(conn_string)

    return client['sound_pollution']

def create_collection(dbname):
    return dbname["meters"]

def create_document(collection):
    item = {
        "_id" : "-1",
        "gps_lat": -1.0,
        "gps_lng": -1.0,
        "meter_name": "test_meter",
        "last_timestamp": datetime.now().isoformat(),
        "active_since": datetime.now().isoformat(),
        "data": [
            {
                "datetime": datetime.now().isoformat(),
                "value": 1,
            },
            {
                "datetime": datetime.now().isoformat(),
                "value": 2,
            },
        ]
    }
    collection.insert_one(item)

if __name__ == "__main__":   
    dbname = get_database()
    coll = create_collection(dbname)
    create_document(coll)