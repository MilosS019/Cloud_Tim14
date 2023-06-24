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


def send_email(sender, recipient, subject, message):
    ses = boto3.client('ses', region_name="eu-central-1")
    if not check_email_verification(sender) and not check_email_verification(recipient):
        verify_email(sender)
        verify_email(recipient)
        raise Exception(f"{sender} and {recipient} are not verified!")

    if not check_email_verification(sender):
        verify_email(sender)
        raise Exception(f"{sender} not verified!")

    if not check_email_verification(recipient):
        verify_email(recipient)
        raise Exception(f"{recipient} not verified!")

    # Slanje emaila
    response = ses.send_email(
        Source=sender,
        Destination={'ToAddresses': [recipient]},
        Message={
            'Subject': {'Data': subject},
            'Body': {'Text': {'Data': message}}
        }
    )

    return response['MessageId']


def verify_email(email_address):
    ses_client = boto3.client('ses', region_name='eu-central-1')

    response = ses_client.verify_email_identity(
        EmailAddress=email_address
    )


def check_email_verification(email_address):
    ses_client = boto3.client('ses', region_name='eu-central-1')

    response = ses_client.list_verified_email_addresses()
    verified_emails = response['VerifiedEmailAddresses']

    if email_address in verified_emails:
        return True
    else:
        return False
