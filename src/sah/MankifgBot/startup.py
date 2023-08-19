import os
import json

if not os.path.exists("Photos"):
    os.mkdir("Photos")
if not os.path.exists("data/Photos"):
    os.mkdir("data/Photos")

if not os.path.isfile('data/settings.json'):
    with open('data/settings.json',"w") as f:
        with open("data/global_settings.json","r") as g:
            json.dump(json.load(g), f)