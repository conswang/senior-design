import requests
import json
import pandas as pd

REQ_URL = 'https://api.bgm.tv/v0/subjects/'

IN_FILE_PATH = './results/bangumiList.csv'
OUT_FILE_PATH = './results/showDetails.json'

payload={}
headers = {
  'User-Agent': 'conswang/senior-design',
  'Content-Type': 'application/json'
}

df = pd.read_csv(IN_FILE_PATH)

results = []

for i in range(len(df)):
  id = df.iloc[i, 0]

  print(f'Fetching show #{id}: {df.iloc[i, 1]}')
  
  response = requests.request("GET", f'{REQ_URL}{id}', headers=headers, data=payload)

  if not response.ok:
    print(response.text)

  data = json.loads(response.text)

  results.append(data)

outFile = open(OUT_FILE_PATH, 'w')
json.dump(results, outFile)
  