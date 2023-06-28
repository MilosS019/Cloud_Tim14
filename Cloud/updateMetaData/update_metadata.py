import json
import boto3
from utility.utils import create_response


def update_metadata(event, contenxt):
    try:
        dynamodb = boto3.resource('dynamodb')
        email = event['requestContext']['authorizer']['claims']['email']

        table = dynamodb.Table('meta-data')

        body = json.loads(event['body'])

        path = body['path']
        lastModified = body['lastModified']
        description = body['description']
        tags = body['tags']
        print(description)
        update_expression = 'SET lastModified = :lastModifiedValue, description = :descriptionValue, tags = :tagsValue'
        expression_attribute_values = {
            ':lastModifiedValue': lastModified,
            ':descriptionValue': description,
            ':tagsValue': tags
        }
        response = table.update_item(
            Key={'emailAndName': email + path},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values
        )
        print(response)

    # # return a properly formatted JSON object
        message = 'Metadata uploaded succesfully'
        return create_response(200, message)
    
    except Exception as e:
        print(e)
        return create_response(500, e)