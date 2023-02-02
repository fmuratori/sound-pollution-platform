
from bson.objectid import ObjectId
import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client.sound_pollution

"""
QUERY 1 - Add a telemetry to the document representing a device installation.
"""

db.meters.update_one({
        "_id" : "-1"
    }, { 
        "$push" : { 
            "data" : { 
                "value" : 123, 
                "timestamp" : "test" 
            } 
        }
    }, upsert=False
)

mydoc = collection.find({ _id: "-1" })