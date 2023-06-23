import json
import boto3
from utility.utils import create_response

def rename_folder(event, context):
    s3 = boto3.client('s3')

    body = json.loads(event['body']) 
    old_path = body["oldPath"]
    new_path = body["newPath"]
    email = event['requestContext']['authorizer']['claims']['email']
    old_path = email + old_path
    new_path = email + new_path

    print(old_path)
    print(new_path)
    
    response = s3.list_objects_v2(Bucket="tim7-project-files-bucket", Prefix = old_path)
    print(response)
    keys = []
    if 'Contents' in response:
        keys = [obj['Key'] for obj in response['Contents']]

    for key in keys:
        old_key = key
        new_key = new_path + old_key[len(old_path):]
        
        s3.copy_object(Bucket="tim7-project-files-bucket", CopySource={'Bucket': "tim7-project-files-bucket", 'Key': old_key}, Key=new_key)
        s3.delete_object(Bucket="tim7-project-files-bucket", Key=old_key)
    
    return create_response(200, "Renamed succsefully")