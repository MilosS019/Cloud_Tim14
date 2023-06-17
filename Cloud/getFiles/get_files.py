import json
import boto3
from utility.utils import create_response

def get_files(event, context):
    try:
        body = json.loads(event['body'])
        folder_path = body["folder"]
        files = get(folder_path)
        return create_response(200, files)    
    except Exception as e:
        return create_response(500, e)
    
def get(folder_path):
    s3 = boto3.client('s3')

    response = s3.list_objects_v2(Bucket="tim7-project-files-bucket", Prefix=folder_path, Delimiter='/')
    files = []

    if 'Contents' in response:
        for obj in response['Contents']:
            if obj['Key'].endswith('/'):  # Exclude subfolders
                files.append(obj['Key'])
    
    return files