import json
import boto3
from utility.utils import create_response

def get_files(event, context):
    try:
        body = json.loads(event['body'])
        folder_path = body["path"]
        email = event['requestContext']['authorizer']['claims']['email']
        files = getFiles(email + folder_path)
        return create_response(200, files)    
    except Exception as e:
        return create_response(500, e)
    
def getFiles(folder_path):
    s3 = boto3.client('s3')

    response = s3.list_objects_v2(Bucket="tim7-project-files-bucket", Prefix=folder_path, Delimiter='/')
    files = []

    if 'Contents' in response:
        for obj in response['Contents']:
            if not obj['Key'].endswith('/'):  # Exclude subfolders
                files.append(obj['Key'].replace(folder_path, ""))

    return files