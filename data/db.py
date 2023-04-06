from dotenv import dotenv_values
import pymysql
from google.cloud import translate_v2
from translate import translate_text
import json
from jikanpy import Jikan
import time

BANGUMI_SHOWS_FILE = "./results/showDetails.json"

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

showListFile = open(BANGUMI_SHOWS_FILE)
showList = json.load(showListFile)

jikan = Jikan()

translateClient = translate_v2.Client()

cursor = connection.cursor()

for bangumiShow in showList:
  # fetch show from MAL
  searchResult = jikan.search('anime', bangumiShow['name'])

  titleChinese = bangumiShow['name_cn']
  titleEnglish = bangumiShow['name']

  malId = 0
  malRank = 0
  malScore = 0

  nsfw = bangumiShow['nsfw']
  platform = 'TV'

  bangumiId = bangumiShow['id']
  bangumiRank = bangumiShow['rating']['rank'] or 0
  bangumiScore = bangumiShow['rating']['score'] or 0

  if searchResult['pagination']['items']['count'] == 0:
    summary = translate_text('en', bangumiShow['summary'], translateClient)

  else:
    malShow = searchResult['data'][0]
    titleEnglish = malShow['title']
    malId = malShow['mal_id'] or 0
    malRank = malShow['rank'] or 0
    malScore = malShow['score'] or 0

    summary = malShow['synopsis']

    # startDate = ""
    # endDate = ""
    # source = ""
    # episodeLength = ""

  sql = f"""INSERT INTO Donghua (
    titleEnglish, titleChinese, summary, nsfw, platform,
    bangumiId, bangumiRank, bangumiScore, malId, malRank, malScore
  ) VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

  print("Inserted", titleEnglish)

  cursor.execute(sql, (titleEnglish, titleChinese, summary, nsfw, platform,
    bangumiId, bangumiRank, bangumiScore, malId, malRank, malScore))
  
  connection.commit()

  time.sleep(1) # wait for rate limiting