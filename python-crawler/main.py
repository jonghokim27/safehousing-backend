import boto3
import pymysql
import constants

# Wait for messages from the RealEstate SQS queue
sqs = boto3.client('sqs')
queue_url = 'YOUR_QUEUE_URL'
response = sqs.receive_message(
    QueueUrl=constants.corporate,
    WaitTimeSeconds=20,
    MaxNumberOfMessages=1
)

if 'Messages' in response:
    for message in response['Messages']:
        # Connect to MySQL database
        connection = pymysql.connect(
            host='YOUR_HOST',
            user='YOUR_USERNAME',
            password='YOUR_PASSWORD',
            database='YOUR_DATABASE'
        )

        try:
            with connection.cursor() as cursor:
                # Execute select query
                sql = 'SELECT * FROM your_table'
                cursor.execute(sql)
                result = cursor.fetchall()
                print(result)  # Do something with the result
        finally:
            connection.close()

        # Delete the received message from the queue
        receipt_handle = message['ReceiptHandle']
        sqs.delete_message(
            QueueUrl=queue_url,
            ReceiptHandle=receipt_handle
        )
else:
    print('No messages in the queue')
