import discord
from discord.ext import commands
import os
import json
import requests
from dotenv import load_dotenv, find_dotenv
import random

website = "https://api.nasa.gov/planetary/apod"

fot = []
with open(f"./data/fot.txt", "r") as f:
    fot = f.read().splitlines()

fot.append("Powered by api.nasa.gov | Made by Mankifg#1810")



load_dotenv(find_dotenv())
key = os.getenv("NASA")

if key == None:
    key = ''
    print('Please enter your key in .env file')
    print('Example:\n NASA=************')
    print('You can get your api here: https://api.nasa.gov/#signUp')
    exit()


class ApodCog(commands.Cog, name="ping command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(name="apod", 
    usage=" for Astronaut Picture of The day", 
    description="Astronaut Picture of The day by Nasa", 
    alias=['Astronaut Picture of The day', 'APOD', 'apod']
    )
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def apod(self, ctx):
        fot[0] = fot[0].replace("{}", ctx.author.name)
        fot[1] = fot[1].replace('{}', ctx.author.name)
        resp = requests.get(f"{website}?api_key={key}").json()


        try:
            author = resp["copyright"]
        except:
            author = ''
            
        date = resp["date"]
        explain = resp["explanation"]
        pic_url = resp["url"]
        title = resp["title"]

        try:
            explain = explain[0:200] + "..."
        except:
            explain = explain


        q = discord.Embed(title="Astronomy Picture of the Day", description='', color=discord.Color.random())
        q.add_field(name="Title: " + title , value="Author: " + author, inline=True)
        q.set_image(url=pic_url)
        q.add_field(name="Date: " + date,value='Desc: ' + explain , inline=False)
        q.set_footer(text=random.choice(fot))
        await ctx.send(embed=q)


def setup(bot: commands.Bot):
    bot.add_cog(ApodCog(bot))