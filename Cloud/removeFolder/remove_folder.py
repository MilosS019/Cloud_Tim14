import json
import boto3
from utility.utils import create_response
from utility.utils import deleteSharedInformation

def remove_folder(event, context):
    try:
        s3 = boto3.client('s3')
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('meta-data')
        filePermissions = dynamodb.Table('file-permissions')

        body = json.loads(event['body']) 
        path = body["path"]
        email = event['requestContext']['authorizer']['claims']['email']        
        path = email + path
        
        response = s3.list_objects_v2(Bucket="tim7-project-files-bucket", Prefix = path)
        keys = []
        if 'Contents' in response:
            keys = [obj['Key'] for obj in response['Contents']]

        for key in keys:            
            s3.delete_object(Bucket="tim7-project-files-bucket", Key=key)
            if(key != path):
                table.delete_item(
                    Key = {
                        'emailAndName' : key,
                    }
                )
            print(email, key)
            deleteSharedInformation(filePermissions, email, key)
        
        return create_response(200, "Deleted succsefully")
    
    except Exception as e:
        print(e)
        return create_response(500, e)