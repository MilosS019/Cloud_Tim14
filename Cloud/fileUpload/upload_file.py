import json
import boto3
from utility.utils import create_response


#path parametar mora da krene sa /, npr: /home/album1
def upload_file(event, context):
    try:
        s3 = boto3.client('s3')
        print(event)
        file_object = json.loads(event['body'])
        file = file_object["file"]
        path = file_object["path"]
        email = event['requestContext']['authorizer']['claims']['email']
        path = email + path

        s3.put_object(Body=file, Bucket="tim7-project-files-bucket", Key=path)

        return create_response(200, 'File uploaded succesfully')
    except Exception as e:
        return create_response(500, e)