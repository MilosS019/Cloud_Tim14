import json
import boto3
from utility.utils import create_response
from utility.utils import sendToSqs
from utility.utils import deleteSharedInformation



def remove_file(event, context):
    try:
        s3 = boto3.client('s3')
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('meta-data')
        filePermissions = dynamodb.Table('file-permissions')

        body = json.loads(event['body']) 
        path = body["path"]
        email = event['requestContext']['authorizer']['claims']['email']
        path = email + path
        s3.delete_object(Bucket="tim7-project-files-bucket", Key=path)

        table.delete_item(
                Key = {
                    'emailAndName' : path
                }
            )
        
        deleteSharedInformation(filePermissions, email, path)
        
        file_name = path.split('/')[-1]
        sendToSqs(email, file_name + " succesfully deleted", "File removal")

        return create_response(200, "Deleted succsefully")
    
    except Exception as e:
        print(e)
        return create_response(500, e)
    

