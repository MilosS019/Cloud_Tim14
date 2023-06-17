import json
import boto3
from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('meta-data')


def get_metadata(event, context):
    try:
        body = json.loads(event['body'])
        path = body["path"]
        response = table.get_item(Key={"emailAndName" : path})
        return create_response(200, response)
    except Exception as e:
        return create_response(500, e)