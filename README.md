# Senior Design

Here lies my senior design project of Spring 2023. [Live online here](https://senior-design.vercel.app/).

### Usage

#### Frontend
Contains the serverless Next.js frontend for the DonghuaDB app
1. Install Node.js (v16.17.0 or later) 
2. `cd frontend`  
3. `npm i`
4. Add a file in the frontend folder called `.env` containing a DATABASE_URL variable in the format `mysql://USER:PASSWORD@HOST:PORT/DATABASE`
5. `npm run dev` and it should be running on localhost:3000

#### Data scraping
Contains various scripts used to scrape MyAnimeList and Bangumi.tv, and also connect to the database and Google Cloud Translate API
1. Install python (3.10.7 or later)
2. `cd data`
3. `pip install -r requirements.txt`
4. Run any script, eg. `python translate.py`
