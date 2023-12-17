from db import DB
import constants
import boto3

s3 = boto3.client('s3',
    aws_access_key_id=constants.AWS_ACCESS_KEY,
    aws_secret_access_key=constants.AWS_SECRET_ACCESS_KEY,
    region_name=constants.AWS_S3_BUCKET_REGION
)

class Issue:
    def __init__(self, issueType, idx):
        self.idx = idx

        if issueType == "realEstate":
            self.tableName = "RealEstate"
        elif issueType == "corporate":
            self.tableName = "Corporate"
            
        self.db = DB()

        results = self.db.select("SELECT * FROM "+ self.tableName +" WHERE idx = %s AND status = 0", (self.idx,))
        if(len(results) == 0):
            raise Exception("No such idx")

        self.data = results[0]

    def update_status(self, status):
        self.db.update("UPDATE "+ self.tableName +" SET status = %s AND updatedAt = NOW() WHERE idx = %s", (status, self.idx))

    def update_pdf(self, pdfUrl, pdfSummary):
        self.db.update("UPDATE "+ self.tableName +" SET pdfUrl = %s AND pdfSummary = %s updatedAt = NOW() WHERE idx = %s", (pdfUrl, pdfSummary, self.idx))

    def upload_pdf(self, orgDir, fileName):
        s3.upload_file(orgDir, constants.AWS_S3_BUCKET_NAME, fileName, ExtraArgs={'ACL': 'public-read'})
        self.update_pdf("https://safehousing.s3.ap-northeast-2.amazonaws.com/" + fileName, None)

    def __del__(self):
        self.db.disconnect()