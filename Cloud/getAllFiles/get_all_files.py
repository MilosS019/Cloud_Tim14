import json
import boto3
from utility.utils import create_response

def get_all_files(event, context):
    try:
        body = json.loads(event['body'])
        folder_path = body["path"]
        files,folders = getFiles(folder_path)
        return create_response(200, {"files":files, "folders":folders})    
    except Exception as e:
        return create_response(500, e)
    
def getFiles(folder_path):
    s3 = boto3.client('s3')

    response = s3.list_objects_v2(Bucket="tim7-project-files-bucket", Prefix=folder_path, Delimiter='/')
    files = []
    folders = []

    if 'Contents' in response:
        for obj in response['Contents']:
            if not obj['Key'].endswith('/'):  # Exclude subfolders
                files.append(obj['Key'])
            else:
                if(obj['Key'] != folder_path):
                    folders.append(obj['Key'])

    return files,folders