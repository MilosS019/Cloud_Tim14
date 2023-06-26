import json
import boto3
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
    


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


def create_and_verify_cognito_user(email, password):
    client = boto3.client('cognito-idp', region_name='eu-central-1')

    user_pool_id = 'eu-central-1_2sxC0DLf2'

    response = client.admin_create_user(
        UserPoolId=user_pool_id,
        Username=email,
        TemporaryPassword=password,
        UserAttributes=[
            {'Name': 'email_verified', 'Value': 'true'},
            {'Name': 'email', 'Value': email}
        ],
        MessageAction='SUPPRESS',
        DesiredDeliveryMediums=[]
    )

    user_id = response['User']['Username']

    client.admin_update_user_attributes(
        UserPoolId=user_pool_id,
        Username=user_id,
        UserAttributes=[
            {'Name': 'email_verified', 'Value': 'true'}
        ]
    )

    client.admin_set_user_password(
        UserPoolId=user_pool_id,
        Username=user_id,
        Password=password,
        Permanent=True
    )


def sendToSqs(receiver, message, subject):
    sqs = boto3.client('sqs')
    response = sqs.get_queue_url(QueueName="notificationQueue")
    queue_url = response['QueueUrl']
    sqs.send_message(QueueUrl = queue_url, MessageBody = json.dumps({"receiver":receiver,"message": message, "subject": subject}))


def deleteSharedInformation(dynamodb, granted_by_user, file_path):
    print(granted_by_user, file_path)
    response = dynamodb.scan(
        FilterExpression=Attr('granted_by_user').eq(granted_by_user) and Attr('file_path').eq(file_path),
    )

    print(response)
    granted_user = ""

    for item in response["Items"]:
        key = {
            "granted_user": item["granted_user"],
            "file_path":item["file_path"]
        }
        dynamodb.delete_item(
            Key = key
        )
        granted_user = item["granted_user"]
    return granted_user