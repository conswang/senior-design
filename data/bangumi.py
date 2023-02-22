import requests
import json
import pandas as pd

SEARCH_URL = "https://api.bgm.tv/v0/search/subjects"
MAX_LIMIT = 50
OUT_FILE = "./results/bangumiList.csv"

# adjust these to get data in chunks of less than 1000 to avoid # of search result return cap
# buckets used: 7-11, 6-7, 5-6, 0-5
offset = 0
RATING_HIGH = 5
RATING_LOW = 0

payload = json.dumps({
  "filter": {
    "type": [
      2
    ],
    "tag": [
      "国产"
    ],
    "rating": [
      f">={RATING_LOW}",
      f"<{RATING_HIGH}"
    ],
    "nsfw": True
  },
  "sort": "score"
})
headers = {
  'User-Agent': 'conswang/senior-design',
  'Content-Type': 'application/json'
}

def pickAttributes(show: dict) -> dict:
  return {
    'id': show.get('id'),
    'name': show.get('name'),
    'name_cn': show.get('name_cn'),
    'score': show.get('score')
  }

while offset < 500:
  print(f'Fetching shows from {offset}-{offset + MAX_LIMIT}')

  urlWithParams = f'{SEARCH_URL}?limit={MAX_LIMIT}&offset={offset}'
  res = requests.request("POST", urlWithParams, headers=headers, data=payload)

  if res.ok:
  # f = open('test/bangumi_search.json')
    resJson = json.loads(res.text)

    if 'data' not in resJson.keys():
      print('Error: no data')
      continue

    data = map(pickAttributes, resJson.get('data'))
    df = pd.json_normalize(data)

    if len(df) != MAX_LIMIT:
      print(f'Got less than expected shows (only {len(df)} shows)')

    df.to_csv(OUT_FILE, mode='a', index=False, header=False)
  else:
    print(res)
    exit()

  # print(res.text)

  offset += MAX_LIMIT