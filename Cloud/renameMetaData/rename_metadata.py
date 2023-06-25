import json
import boto3
from utility.utils import create_response
from utility.utils import sendToSqs


def rename_metadata(event, contenxt):
    try:
        dynamodb = boto3.resource('dynamodb')
        email = event['requestContext']['authorizer']['claims']['email']

        table = dynamodb.Table('meta-data')

        body = json.loads(event['body'])

        oldPath = body['oldPath']
        path = body['path']
        type = body['type']
        size = body['size']
        lastModified = body['lastModified']
        description = body['description']
        tags = body['tags']
        #<-- dodaj tags -->
        table.put_item(
            Item={
                'emailAndName': email + path,
                'type': type,
                'size': size,
                'lastModified': lastModified,
                'description': description,
                'tags': tags
            })
        
        table.delete_item(
            Key = {
                'emailAndName' : email + oldPath
            }
        )

    # # return a properly formatted JSON object
        message = 'Metadata uploaded succesfully'

        oldName = oldPath.split("/")[-1]
        newName = path.split("/")[-1]
        sendToSqs(email, oldName + " renamed succesfully to " + newName, email)
        
        return create_response(200, message)
    
    except Exception as e:
        print(e)
        return create_response(500, e)