import json
import boto3
from utility.utils import create_response
from utility.utils import send_email


def send_notification(event, contenxt):
    try:
        print(event)
        file_object = json.loads(event["Records"][0]['body'])
        subject = file_object["subject"]
        receiver = file_object["receiver"]
        message = file_object["message"]
        print('radim')
        send_email("milosstanojlovic019@gmail.com", receiver, subject, message)
    except Exception as e:
        print(e)