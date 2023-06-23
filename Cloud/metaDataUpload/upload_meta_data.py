import json
import boto3
from utility.utils import create_response


def upload_file(event, contenxt):
    try:
        dynamodb = boto3.resource('dynamodb')
        email = event['requestContext']['authorizer']['claims']['email']

        table = dynamodb.Table('meta-data')

        body = json.loads(event['body'])

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
            })


    # # return a properly formatted JSON object
        message = 'Metadata uploaded succesfully'
        return create_response(200, message)
    
    except Exception as e:
        return create_response(500, e)