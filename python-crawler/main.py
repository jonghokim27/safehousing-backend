import boto3
import constants
import json
from issue import Issue
from corporate import corporate
from realEstate import realEstate

sqs = boto3.client('sqs',
    aws_access_key_id=constants.AWS_ACCESS_KEY,
    aws_secret_access_key=constants.AWS_SECRET_ACCESS_KEY,
    region_name=constants.AWS_SQS_REGION
)

while True:
    try:
        print("Waiting for message...")

        response = sqs.receive_message(
            QueueUrl=constants.AWS_SQS_URL,
            WaitTimeSeconds=20,
            MaxNumberOfMessages=1
        )

        if 'Messages' not in response:
            continue
        
        message = response['Messages'][0]

        receipt_handle = message['ReceiptHandle']
        sqs.delete_message(
            QueueUrl=constants.AWS_SQS_URL,
            ReceiptHandle=receipt_handle
        )

        message_json = json.loads(message['Body'])
        if(message_json["type"] == "realEstate"):
            issue = Issue("realEstate", message_json["idx"])
            realEstate(issue)
        elif(message_json["type"] == "corporate"):
            issue = Issue("corporate", message_json["idx"])
            corporate(issue)
        del issue
        
    except Exception as e:
        print(e)
        continue