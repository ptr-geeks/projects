import discord
from discord.ext import commands, tasks
import os
import json
import requests
from dotenv import load_dotenv, find_dotenv
import random
from functions import get_color
import urllib.request
import asyncio
from datetime import datetime

WEBSITE = "https://api.nasa.gov/planetary/apod"
path_to_img = "./data/Photos/apod.png"

load_dotenv(find_dotenv())
key = os.getenv("NASA")

path = "data/settings.json"

def getFile():
    with open(path,"r") as f:
        return json.load(f)
    
def saveids(save):
    with open(path,"w") as f: 
        json.dump(save,f) 

def getTime():
    file = getFile()
    return file["apod"]["time"]

class ApodCog(commands.Cog):
    def __init__(self, bot):
        self.bot = bot  
        self.send_message.start()
    @tasks.loop(seconds=59)
    async def send_message(self):
        if datetime.now().hour == 8 and datetime.now().minute == 0:
            channels = getFile()["apod"]["ids"]
            resp = requests.get(f"{WEBSITE}?api_key={key}").json()
            author = resp.get("copyright", "n/a")
            date = resp.get("date","1.1.1970")
            explain = resp.get("explanation","n/a")
            pic_url = resp.get("url","https://i.redd.it/8w81b1pwk0d21.jpg")
            title = resp.get("title","n/a")
            urllib.request.urlretrieve(pic_url, path_to_img)

            explain = explain[0:200] + "..." if len(explain) > 200 else explain

            q = discord.Embed(title="Astronomy Picture of the Day", description='', color=get_color(path_to_img))
            q.add_field(name=f"Title: {title}", value=f"Author: {author}", inline=True)
            q.set_image(url=pic_url)
            q.add_field(name=f"Date: {date}", value=f'Desc: {explain}', inline=False)
            q.set_footer(text="Using Nasa Api")
            
            for x in range(len(channels)):
                ch = self.bot.get_channel(channels[x])
                await ch.send(embed=q)
                await asyncio.sleep(1)
                
                
    @send_message.before_loop
    async def before_send_message(self):
        await self.bot.wait_until_ready()

    @commands.command(name="apod", usage="", description="apod")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def apod(self, ctx, mode=""):
        mode = mode.lower()
        if mode in ["show", "s"]:
            #! If user wants the image
            resp = requests.get(f"{WEBSITE}?api_key={key}").json()
            author = resp.get("copyright", "n/a")
            date = resp.get("date","1.1.1970")
            explain = resp.get("explanation","n/a")
            pic_url = resp.get("url","https://i.redd.it/8w81b1pwk0d21.jpg")
            title = resp.get("title","n/a")
            urllib.request.urlretrieve(pic_url, path_to_img)

            explain = explain[0:200] + "..." if len(explain) > 200 else explain

            q = discord.Embed(title="Astronomy Picture of the Day", description='', color=get_color(path_to_img))
            q.add_field(name=f"Title: {title}", value=f"Author: {author}", inline=True)
            q.set_image(url=pic_url)
            q.add_field(name=f"Date: {date}", value=f'Desc: {explain}', inline=False)
            q.set_footer(text="Using Nasa Api")

            await ctx.send("If you want daily please type m!apod add")
            
        elif mode in ["add", "a"]:
            file = getFile()
            id = ctx.channel.id

            if not id in file["apod"]["ids"]:
                file["apod"]["ids"].append(ctx.channel.id)
                q = discord.Embed(title=f"Added channel with id {id} to daily apod",color=discord.Color.green())
            else:
                q = discord.Embed(title=f"Channel with id {id} already in list",color=discord.Color.yellow())
            saveids(file)

        elif mode in ["remove", "r", "rmv", "rem"]:
            file = getFile()
            id = ctx.channel.id

            if id in file["apod"]["ids"]:
                file["apod"]["ids"].remove(ctx.channel.id)
                q = discord.Embed(title=f"Removed channel with id {id} from daily apod",color=discord.Color.green())
            else:
                q = discord.Embed(title=f"Channel with id: **{id}** isn't in daily apod",color=discord.Color.yellow())
            saveids(file)
    
        else:
            q = discord.Embed(title="Error", description="Please use one of the following commands",
                              color=discord.Colour.red())
            q.add_field(name="m!apod show",value="Shows daily apod")
            q.add_field(name="m!apod add",value="Add a channel to list of channels to send daily apod")
            q.add_field(name="m!apod remove",value="Remove a channel from list of daily apod")

        await ctx.send(embed=q)

def setup(bot):
    bot.add_cog(ApodCog(bot))