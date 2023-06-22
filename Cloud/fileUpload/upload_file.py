import json
import boto3
import base64
from utility.utils import create_response


#path parametar mora da krene sa /, npr: /home/album1
def upload_file(event, context):
    try:
        s3 = boto3.client('s3')
        file_object = json.loads(event['body'])
        file = file_object["file"]
        path = file_object["path"]
        email = event['requestContext']['authorizer']['claims']['email']
        path = email + path

        slices = path.split("/")
        extension = slices[-1].split(".")[1]

        base64_img = file.split("base64,")[1]
        base64_bytes = base64_img.encode('utf-8')

        with open('/tmp/decoded_image' + extension, 'wb') as file_to_save:
            decoded_image_data = base64.decodebytes(base64_bytes)
            file_to_save.write(decoded_image_data)
        s3.upload_file('/tmp/decoded_image' + extension, "tim7-project-files-bucket", path)

        return create_response(200, 'File uploaded succesfully')
    except Exception as e:
        print(e)
        return create_response(500, {"error" : e})