import requests
import json
import pandas as pd

SEARCH_URL = "https://api.bgm.tv/v0/search/subjects"
MAX_LIMIT = 100
OUT_FILE = "out.csv"

offset = 1000

payload = json.dumps({
  "filter": {
    "type": [
      2
    ],
    "tag": [
      "国产"
    ],
    "nsfw": True
  }
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

while offset < 1100:
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
    df.to_csv(OUT_FILE, mode='a', index=False, header=False)
  else:
    print(res)
    exit()

  # print(res.text)
  print(res.text)

  offset += MAX_LIMIT