import json
import boto3
import base64
from utility.utils import create_response


def download_file(event, context):
    s3 = boto3.client('s3')
    try:
        temp_file_path = "/tmp/filename"  # Temporary file path in Lambda
        file_object = json.loads(event['body'])
        email = event['requestContext']['authorizer']['claims']['email']
        key = email + file_object["path"]
        slices = file_object["path"].split("/")
        extension = slices[-1].split(".")[1]
        temp_file_path += "." + extension
        s3.download_file("tim7-project-files-bucket", key, temp_file_path)

        with open(temp_file_path, 'rb') as file:
            file_data = file.read()

        return create_response(200, file_data)

    except Exception as e:
        return create_response(500, {"error":e})
