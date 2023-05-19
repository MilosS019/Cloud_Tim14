import json
import os
import boto3

# Import local utility module
from utility.utils import create_response
# Import non standard library
from requests import get

# Extract environment variable
table_name = os.environ['TABLE_NAME']
dynamodb = boto3.resource('dynamodb')

def create(event, context):
    # Extract data from request
    body = json.loads(event['body'])
    
    # Get table instance connection
    table = dynamodb.Table(table_name)
    # Put item into table
    response = table.put_item(
        Item={
            'name': body['name'],
            'size': body['size'],
            'friendliness': body['friendliness']
        }
    )
    # Create response
    body = {
        'message': 'Successfully created doggo'
    }
    return create_response(200, body)
