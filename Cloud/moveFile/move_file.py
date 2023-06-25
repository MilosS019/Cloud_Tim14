import json
import boto3
from utility.utils import create_response
from utility.utils import sendToSqs

def move_file(event, context):
    try:    
        s3 = boto3.client('s3')

        body = json.loads(event['body']) 
        old_path = body["oldPath"]
        new_path = body["newPath"]
        email = event['requestContext']['authorizer']['claims']['email']
        old_path = email + old_path
        new_path = email + new_path

        print(old_path)
        print(new_path)
        
        s3.copy_object(Bucket="tim7-project-files-bucket", CopySource={'Bucket': "tim7-project-files-bucket", 'Key': old_path}, Key=new_path)
        s3.delete_object(Bucket="tim7-project-files-bucket", Key=old_path)
        
        sendToSqs(email, "Succesfully Moved", "File relocation")

        return create_response(200, "Renamed succsefully")
    except Exception as e:
        print(e)
        return create_response(500, e)