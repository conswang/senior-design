from dotenv import dotenv_values
import pymysql
import requests
import json
from google.cloud import translate_v2
from translate import translate_text
from jikanpy import Jikan
import time

REQ_URL = 'https://api.bgm.tv/v0/subjects/'
payload={}
headers = {
  'User-Agent': 'conswang/senior-design',
  'Content-Type': 'application/json'
}

translateClient = translate_v2.Client()

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

cursor = connection.cursor()
cursor.execute("SELECT id, bangumiId, malId FROM Donghua")
results = cursor.fetchall()
jikan = Jikan()

for (id, bangumiId, malId) in results:
  # fetch chinese tags
  response = requests.request("GET", f'{REQ_URL}{bangumiId}', headers=headers, data=payload)

  if not response.ok:
    print(response.text)

  bangumiData = json.loads(response.text)
  
  for tag in bangumiData["tags"]:
    name = tag["name"]
    count = tag["count"]

    if count < 10: # unpopular tags are usually low quality (eg. typos)
      continue
    
    nameEN = translate_text('en', tag["name"], translateClient)
    try:
      cursor.execute("INSERT INTO TagCN (name, count, nameEN) VALUES (%s, %s, %s)", (name, count, nameEN))
      print(f"Added bangumi tag {name}")
    except pymysql.Error as e:
      print(e)
    try:
      cursor.execute("INSERT INTO DonghuaTagCN (donghuaId, tagName) VALUES (%s, %s)", (id, name))
      print(f"Added bangumi tag {name} to donghua {id}: {bangumiData['name']}")
    except pymysql.Error as e:
      print(e)
    connection.commit()

  # fetch english tags
  if malId:
    try:
      def addMALTag(malTag):
        malId = malTag["mal_id"]
        name = malTag["name"]
        type = malTag["type"]
        nameCN = translate_text('zh', malTag["name"], translateClient)
        try:
          cursor.execute("INSERT INTO TagEN (malId, name, type, nameCN) VALUES (%s, %s, %s, %s)", (malId, name, type, nameCN))
          print(f"Added mal tag {name}")
        except pymysql.Error as e:
          print(e)
        try:
          cursor.execute("INSERT INTO DonghuaTagEN (donghuaId, tagId) VALUES (%s, %s)", (id, malId))
          print(f"Added mal tag {name} to donghua {id}: {malData['title']}")
        except pymysql.Error as e:
          print(e)
        connection.commit()

      malData = jikan.anime(id=malId)['data']
      if malData.get("genres"):
        for tag in malData["genres"]:
          addMALTag(tag)
      if malData.get("explicit_genres"):
        for tag in malData["explicit_genres"]:
          addMALTag(tag)   
      if malData.get("themes"):
        for tag in malData["themes"]:
          addMALTag(tag) 
      if malData.get("demographics"):
        for tag in malData["demographics"]:
          addMALTag(tag)
        
    except:
      print("Exception when fetching mal data")

    time.sleep(2) # wait for rate limiting

    



