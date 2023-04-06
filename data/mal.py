from jikanpy import Jikan
import json

jikan = Jikan()

# rate limited to 3 req per sec, 60 req per min
# looks like I'll need to self host

showDetails = jikan.anime(37208) #rate limited

result = json.dumps(showDetails)

print(result)
