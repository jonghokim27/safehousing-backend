from db import DB
import json

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

    def update_status(status):
        self.db.update("UPDATE "+ self.tableName +" SET status = %s AND updatedAt = NOW() WHERE idx = %s", (status, self.idx))

    def update_pdf(pdfUrl, pdfSummary):
        self.db.update("UPDATE "+ self.tableName +" SET pdfUrl = %s AND pdfSummary = %s updatedAt = NOW() WHERE idx = %s", (pdfUrl, pdfSummary, self.idx))

    def __del__(self):
        self.db.disconnect()