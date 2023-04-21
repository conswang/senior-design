from dotenv import dotenv_values
import pymysql
import requests
import json
from google.cloud import translate_v2
from translate import translate_text
from jikanpy import Jikan
import time

# Connect to db
config = dotenv_values(".env")
host = config["DB_HOST"]
user = config["DB_USER"]
password = config["DB_PASSWORD"]
database = config["DB_NAME"]

connection = pymysql.connect(host=host,
                             user=user,
                             password=password,
                             database=database,
                             port=3306)

translateClient = translate_v2.Client()

cursor = connection.cursor()
cursor.execute("SELECT (name) FROM TagCN WHERE nameEN IS NULL")
results = cursor.fetchall()

for (name,) in results:
  nameEN = translate_text('en', name, translateClient)
  cursor.execute("UPDATE TagCN SET nameEN = %s WHERE TagCN.name = %s AND tagENId IS NULL", (nameEN, name))
  connection.commit()
