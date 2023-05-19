import json
import os
import boto3

from urllib.parse import unquote
from utility.utils import create_response

# Extract environment variable
table_name = os.environ['TABLE_NAME']
dynamodb = boto3.resource('dynamodb')

def delete(event, context):
    # Extract data from request
    path = event['pathParameters']['name']
    # Decode name in URL (eg. decode %20 to whitespace)
    path = unquote(path)
    # Get table instance connection
    table = dynamodb.Table(table_name)
    # Put item into table
    response = table.delete_item(
        Key={
            'name': path
        }
    )
    # Create response
    body = {
        'message': 'Successfully deleted doggo'
    }
    return create_response(200, body)
