import json
import boto3
from utility.utils import create_response
from utility.utils import sendToSqs

def send_to_sqs(event, contenxt):
    body = json.loads(event['body'])
    sendToSqs(body["email"], body["message"], body["subject"])
    return create_response(200, body["message"])
