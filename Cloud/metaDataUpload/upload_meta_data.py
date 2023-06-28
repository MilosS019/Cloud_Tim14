import json
import boto3
from utility.utils import create_response


def upload_file(event, contenxt):
    body = json.loads(event['body'])
    try:
        dynamodb = boto3.resource('dynamodb')
        email = body["email"]

        table = dynamodb.Table('meta-data')

        fileParams = body["fileParams"]
        path = fileParams['path']
        type = fileParams['type']
        size = fileParams['size']
        lastModified = fileParams['lastModified']
        creationDate = fileParams['creationDate']
        description = fileParams['description']
        tags = fileParams['tags']
        #<-- dodaj tags -->
        table.put_item(
            Item={
                'emailAndName': email + path,
                'type': type,
                'size': size,
                'lastModified': lastModified,
                'creationDate': creationDate,
                'description': description,
                'tags': tags
            })


    # # return a properly formatted JSON object
        message = 'Metadata uploaded succesfully'
        file_name = path.split("/")[-1]
        return create_response(200, {"email":email, "message": file_name + " uploaded successfully", "subject":"File upload"})
    
    except Exception as e:
        print(e)
        raise Exception({"path": body["path"]})