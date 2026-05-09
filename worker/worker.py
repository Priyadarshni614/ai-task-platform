import redis
import json
from pymongo import MongoClient
from bson.objectid import ObjectId
import time
from textblob import TextBlob

# Redis connection
redis_client = redis.Redis(
    host="redis",
    port=6379,
    decode_responses=True
)

# MongoDB connection
mongo_client = MongoClient("mongodb://mongo:27017/")

db = mongo_client["aitasks"]

tasks_collection = db["tasks"]

print("Worker started...")

while True:

    job = redis_client.brpop("taskQueue")

    if job:

        task_id = None

        try:

            job_data = json.loads(job[1])

            task_id = job_data["taskId"]

            input_text = job_data["inputText"]

            operation = job_data["operation"]

            # Update task status to running
            tasks_collection.update_one(
                {"_id": ObjectId(task_id)},
                {
                    "$set": {
                        "status": "running"
                    },
                    "$push": {
                        "logs": "Task started processing"
                    }
                }
            )

            # Simulate processing delay
            time.sleep(2)

            # Process task
            if operation == "uppercase":

                result = input_text.upper()

            elif operation == "lowercase":

                result = input_text.lower()

            elif operation == "reverse":

                result = input_text[::-1]

            elif operation == "wordcount":

                result = str(len(input_text.split()))

            elif operation == "sentiment":

                analysis = TextBlob(input_text)

                polarity = analysis.sentiment.polarity

                if polarity > 0:

                    result = "Positive Sentiment"

                elif polarity < 0:

                    result = "Negative Sentiment"

                else:

                    result = "Neutral Sentiment"

            else:

                result = "Invalid operation"

            # Update task result
            tasks_collection.update_one(
                {"_id": ObjectId(task_id)},
                {
                    "$set": {
                        "status": "success",
                        "result": result
                    },
                    "$push": {
                        "logs": "Task processed successfully"
                    }
                }
            )

            print(f"Processed Task: {task_id}")

        except Exception as e:

            print("Worker Error:", e)

            # Update task status to failed
            if task_id:

                tasks_collection.update_one(
                    {"_id": ObjectId(task_id)},
                    {
                        "$set": {
                            "status": "failed",
                            "result": "Task Failed"
                        },
                        "$push": {
                            "logs": f"Error: {str(e)}"
                        }
                    }
                )