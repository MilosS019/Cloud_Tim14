import json
import boto3
from utility.utils import create_response

def upload_folder(event, context):
    try:
        s3 = boto3.client('s3')
        file_object = json.loads(event['body'])
        file = file_object["file"]
        path = file_object["path"]
        email = event['requestContext']['authorizer']['claims']['email']
        path = email + path

        s3.put_object(Body = file, Bucket = "tim7-project-files-bucket", Key = path)
        return create_response(200, "Album created succesfully")
    except Exception as e:
        return create_response(500, {"error" : e})