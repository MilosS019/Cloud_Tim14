import json
import boto3
from utility.utils import create_response
from utility.utils import sendToSqs

def undo_moving(event, contenxt):
    s3 = boto3.client('s3')
    body = json.loads(event['Cause'])
    content = eval(body["errorMessage"])
    newPath = content["newPath"]
    oldPath = content["oldPath"]
    s3.copy_object(Bucket="tim7-project-files-bucket", CopySource={'Bucket': "tim7-project-files-bucket", 'Key': newPath}, Key=oldPath)
    s3.delete_object(Bucket="tim7-project-files-bucket", Key=newPath)
    return create_response(500, "Metadata failed to update")