import json
import boto3
import base64
from utility.utils import create_response
from utility.utils import sendToSqs


#path parametar mora da krene sa /, npr: /home/album1
def get_email(event, context):
    email = event['requestContext']['authorizer']['claims']['email']
    return create_response(200, {"email":email})
