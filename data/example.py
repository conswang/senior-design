"""
create a app at https://bgm.tv/dev/app/create
then replace APP_ID and APP_SECRET with your own config
"""
import json.decoder
import pathlib
from os import path, getenv
from urllib import parse as url_parse

import requests
from flask import Flask, jsonify, redirect, request

from dotenv import load_dotenv
load_dotenv()

APP_ID = getenv("BANGUMI_APP_ID")
APP_SECRET = getenv("BANGUMI_APP_SECRET")
WEBSITE_BASE = 'http://localhost:6008/'

CALLBACK_URL = f'{WEBSITE_BASE}oauth_callback'

USER_AUTH_URL = 'https://bgm.tv/oauth/authorize?' + url_parse.urlencode({
    'client_id': APP_ID,
    'response_type': 'code',
    'redirect_uri': CALLBACK_URL,
})

base_dir = pathlib.Path(path.dirname(__file__))

app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True


@app.route('/')
def index():
    return redirect(USER_AUTH_URL)


@app.route('/oauth_callback')
def oauth_callback():
    code = request.args.get('code')
    if not code:
        return redirect('/')
    resp = requests.post(
        'https://bgm.tv/oauth/access_token',
        data={
            'code': code,
            'client_id': APP_ID,
            'grant_type': 'authorization_code',
            'redirect_uri': CALLBACK_URL,
            'client_secret': APP_SECRET,
        }
    )
    try:
        r = resp.json()
        if 'error' in r:
            return jsonify(r)
    except json.decoder.JSONDecodeError:
        return redirect(USER_AUTH_URL)

    return jsonify(r)


if __name__ == '__main__':
    app.run('0.0.0.0', 6008, True)