import json
import boto3
from boto3.dynamodb.conditions import Key


def create_response(status, body, contentType=""):
    return {
        'statusCode': status,
        'headers': {
            'Access-Control-Allow-Origin': '*',
        },
        'body': json.dumps(body, default=str)
    }


def get_logged_user_email(event):
    login_user_email = event['requestContext']['authorizer']['claims']['email']
    return login_user_email


def query_table(table_name, key, value):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)

    filtering_exp = Key(key).eq(value)
    response = table.query(KeyConditionExpression=filtering_exp)

    items = response.get('Items', [])
    return items
