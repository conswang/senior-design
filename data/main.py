from jikanpy import Jikan
jikan = Jikan()

# rate limited to 3 req per sec, 60 req per min
# looks like I'll need to self host

mushishi = jikan.anime(457) #rate limited
mushishi_with_eps = jikan.anime(457, extension='episodes') #rate limited

search_result = jikan.search('anime', 'Mushishi', page=2) # and rate limited

print (search_result)

# winter_2018_anime = jikan.seasons(year=2018, season='winter')

# current_season = jikan.seasons(extension='now')
