from dotenv import dotenv_values
import pymysql
from google.cloud import translate_v2
from translate import translate_text, is_chinese
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

def getTitles(malShow):
  # values from titles, title, title_japanese, title_synonyms all combined into 1 array
  res = set()
  
  if malShow['titles']:
    for elt in malShow["titles"]:
      res.add(elt['title'])
  
  if malShow["title_english"]:
    res.add(malShow["title_english"])
  
  if malShow['title']:
    res.add(malShow["title"])
  
  if malShow["title_japanese"]:
    res.add(malShow["title_japanese"])

  if malShow["title_synonyms"]:
    for title in malShow['title_synonyms']:
      res.add(title)
  
  return json.dumps(list(res))

# sometimes MAL show summary is too short, just use bangumi MTL summary if it's longer
def pickSummary(malShow, translated_summary):
  if not malShow['synopsis']: # no MAL summary
    return translated_summary
  if len(malShow['synopsis']) < 50 and len(translated_summary) > 100:
    return translated_summary
  return malShow['synopsis']

# use bangumi and MAL scores to jumpstart score counts
# give score count of max 100
def calculateScore(bangumiScore, bangumiScoreCount, malScore, malScoreCount):
  score = 0
  scoreCount = 0
  if not malScore or not malScoreCount: # no MAL score
    score = bangumiScore
    scoreCount = min(bangumiScoreCount, 100)
  else:
    # take weighted average
    score = (bangumiScore * bangumiScoreCount + malScore * malScoreCount) / (bangumiScoreCount + malScoreCount)
    score = round(score, 2)
    scoreCount = min(bangumiScoreCount + malScoreCount, 100)
  return [score, scoreCount]

def roughDateMatch(bangumiDate, malDate):
  if malDate[:7] == bangumiDate[:7]: # year and month match
    return True
  
  if malDate[:4] == bangumiDate[:4] and malDate[4:10] == '-01-01': # year matches and everything else is 01-01...
    return True
  return False

for bangumiShow in showList:
  # Bangumi data----------------------------------------------
  titleChinese = bangumiShow['name_cn']
  if not bangumiShow['name_cn']:   #  at least one of names has to be non-empty, set as chinese name
    titleChinese = bangumiShow['name']

  nsfw = bangumiShow['nsfw']
  platform = bangumiShow['platform']
  if bangumiShow['platform'] != 'TV' and bangumiShow['platform'] != 'WEB':
    platform = 'Unknown'

  bangumiId = bangumiShow['id']
  if not bangumiId:
    print("Doesn't even have bangumi id what are we even doing")

  bangumiRank = None
  bangumiScore = 0
  bangumiScoreCount = 0
  if bangumiShow['rating']:
    bangumiRank = bangumiShow['rating']['rank']
    bangumiScore = bangumiShow['rating']['score']
    bangumiScoreCount = bangumiShow['rating']['total']

  summaryChinese = bangumiShow['summary']
  startDate = '1900-01-01' # format in mysql is yyyy-mm-dd
  endDate = '2100-01-01'

  if bangumiShow['date']:
    startDate = bangumiShow['date']

  numEpisodes = None
  if bangumiShow['eps']:
    numEpisodes = bangumiShow['eps']

  imageUrl = bangumiShow['images']['common']

  if is_chinese(bangumiShow['name'], translateClient):
    titleEnglish = ''
  else:
    titleEnglish = bangumiShow['name']

  # MAL data -------------------------------------------------

  malId = None
  malRank = None
  malScore = 0
  malScoreCount = 0
  source = ''
  episodeLength = ''
  trailerUrl = ''
  otherTitles = "[]"

  translated_summary =  translate_text('en', bangumiShow['summary'], translateClient)

  # fetch show from MAL
  searchResult = jikan.search('anime', bangumiShow['name'])

  if searchResult['pagination']['items']['count'] == 0: # try again with different name if no results
    searchResult = jikan.search('anime', bangumiShow['name_cn'])

  if searchResult['pagination']['items']['count'] == 0:
     # no results, keep all default MAL data and bangumi data
     # machine translate the title
    summaryEnglish = translated_summary

  else:
    # we found show on MAL
    malShow = searchResult['data'][0]

    showsMatch = True

    # shows should have same start date, otherwise it can't be a match
    if malShow['aired']['from']:
      if (not bangumiShow['date'] and malShow['title_japanese'] and bangumiShow['name'] and bangumiShow['name_cn'] and malShow['title_japanese'] != bangumiShow['name'] and malShow['title_japanese'] != bangumiShow['name_cn']) or (bangumiShow['date'] and not roughDateMatch(bangumiShow['date'][:7], malShow['aired']['from'])) or malShow['title'] == 'Cowboy Bebop': # only match up to MONTH AND YEAR
        # print(f"MAL start date {malShow['aired']['from']} does not match bangumi start date {bangumiShow['date']}, choosing MAL")

        if not bangumiShow['date'] and malShow['title_japanese'] and bangumiShow['name'] and bangumiShow['name_cn'] and malShow['title_japanese'] != bangumiShow['name'] and malShow['title_japanese'] != bangumiShow['name_cn']:
          print(f"Unlikely that show not yet aired has match on MAL, plus the japanese title {malShow['title_japanese']} doesn't match, so conservatively don't match")

        print(f"False match between {malShow['title']} and {bangumiShow['name']}")
        print(f"dates are {bangumiShow['date']} and {malShow['aired']['from']}")

        showsMatch = False
        summaryEnglish = translated_summary
    
    if showsMatch:

      if malShow['title'] != bangumiShow['name']:
        print(f"English title on MAL {malShow['title']} does not match title on bangumi {bangumiShow['name']}, choosing MAL title")

      if malShow['title_english']:
        titleEnglish = malShow['title_english']
      else:
        titleEnglish = malShow['title']
      otherTitles = getTitles(malShow)

      summaryEnglish = pickSummary(malShow, translated_summary)

      malId = malShow['mal_id'] or None
      malRank = malShow['rank'] or None
      malScore = malShow['score'] or 0
      malScoreCount = malShow['scored_by'] or 0
      episodeLength = malShow['duration'] or ''
      source = malShow['source'] or ''

      if malShow['aired']['to']:
        endDate = malShow['aired']['to'][:10]

      trailerUrl = malShow['trailer']['url'] or ''
  
  [score, scoreCount] = calculateScore(bangumiScore, bangumiScoreCount, malScore, malScoreCount)

  sql = f"""INSERT INTO Donghua (
    titleEnglish,
    titleChinese,
    otherTitles,
    summaryEnglish,
    summaryChinese,
    nsfw,
    platform,
    startDate,
    endDate,
    source,
    numEpisodes,
    episodeLength,
    bangumiId,
    bangumiRank,
    bangumiScore,
    bangumiScoreCount,
    malId,
    malRank,
    malScore,
    malScoreCount,
    score,
    scoreCount,
    imageUrl,
    trailerUrl
  ) VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

  try:
    cursor.execute(sql, (
      titleEnglish,
      titleChinese,
      otherTitles,
      summaryEnglish,
      summaryChinese,
      nsfw,
      platform,
      startDate,
      endDate,
      source,
      numEpisodes,
      episodeLength,
      bangumiId,
      bangumiRank,
      bangumiScore,
      bangumiScoreCount,
      malId,
      malRank,
      malScore,
      malScoreCount,
      score,
      scoreCount,
      imageUrl,
      trailerUrl
    ))
    connection.commit()
    print("Inserted", bangumiShow['name'])
  except pymysql.Error as e:
    print(e)
  except :
    print("Unknown error occurred when inserting into DB")

  time.sleep(2) # wait for rate limiting