import json
import boto3
from utility.utils import create_response

def remove_file(event, context):
    try:
        s3 = boto3.client('s3')
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('meta-data')

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
        
        return create_response(200, "Deleted succsefully")
    
    except Exception as e:
        print(e)
        return create_response(500, e)