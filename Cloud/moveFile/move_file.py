import json
import boto3
from utility.utils import create_response
from utility.utils import sendToSqs

def move_file(event, context):
    try:    
        s3 = boto3.client('s3')
        print(event)
        old_path = event["oldPath"]
        new_path = event["newPath"]
        email = event["email"]
        fileParams = event["fileParams"]
        old_path = email + old_path
        new_path = email + new_path

        print(old_path)
        print(new_path)
        
        s3.copy_object(Bucket="tim7-project-files-bucket", CopySource={'Bucket': "tim7-project-files-bucket", 'Key': old_path}, Key=new_path)
        s3.delete_object(Bucket="tim7-project-files-bucket", Key=old_path)
        
        return create_response(200, {"newPath":new_path, "oldPath":old_path, "email":email, "fileParams" : fileParams})
    except Exception as e:
        raise Exception(e)