# url = "https://baike.baidu.com/item/%E9%AD%94%E9%81%93%E7%A5%96%E5%B8%88/20184323"

API_ROOT = 'https://api.bgm.tv'
SEARCH_URL = API_ROOT + '/v0/search/subjects'
json = {}

x = requests.post(SEARCH_URL, json)

print(x.text)