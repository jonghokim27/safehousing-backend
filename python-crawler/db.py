import pymysql
import constants

class DB:
    def __init__(self):
        self.connection = pymysql.connect(
            host=constants.DB_HOST,
            user=constants.DB_USER,
            port=constants.DB_PORT,
            password=constants.DB_PASSWORD,
            database=constants.DB_DEFAULT_SCHEMA,
        )

    def select(self, query, values):
        with self.connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(query, values)
            result = cursor.fetchall()
        return result

    def update(self, query, values):
        with self.connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(query, values)
            self.connection.commit()

    def disconnect(self):
        self.connection.close()
        self.connection = None
    