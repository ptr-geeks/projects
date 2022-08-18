from dis import disco
import discord
from discord.ext import commands
import random
import os
import requests
import json

yes = "✅"
no = "❌"

fot = []
with open("./data/fot.txt", "r") as f:
    fot = f.read().splitlines()

for i in range(len(fot)):
    fot[i] = fot[i].replace("\n", "")


link = "https://api.mcsrvstat.us/2/"
image_link = "https://eu.mc-api.net/v3/server/favicon/"

class McstatusCog(commands.Cog, name="ping command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(name="mcstatus", usage=" [server ip]", 
    description="Ping minecraft server using api.mcsrvstat.us", 
    alias=['mcs']
    )
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def mcstatus(self, ctx, server):
    
        fot[0] = fot[0].replace("{}", ctx.author.name)
        fot[1] = fot[1].replace("{}", ctx.author.name)


        resp = requests.get(link + server).text
        data = json.loads(resp)
        
        
        toggles = []
        if data["debug"]["ping"]:
            toggles.append(yes)
        else:
            toggles.append(no)
        if data['debug']["query"]:
            toggles.append(yes)
        else:
            toggles.append(no)
        if data['debug']['animatedmotd']:
            toggles.append(yes)
        else:
            toggles.append(no)

        print(toggles)
        if data["online"]:
            q = discord.Embed(title="Server Status", description="", color=discord.Color.green())
            q.set_thumbnail(url=image_link + server)
            q.add_field(name=f"Server name: {data['hostname']}", value=f"Hosted from: {data['ip']}:{data['port']}" , inline=False)
            q.add_field(name="Players", value=f"{data['players']['online']} / {data['players']['max']}", inline=False)
            q.add_field(name="Version", value=data["version"], inline=False)
            q.add_field(name="Motd", value=f"{data['motd']['clean'][0]}\n{data['motd']['clean'][1]}", inline=False)
            q.add_field(name='Settings', value=f"Ping: {toggles[0]}\nAllow query: {toggles[1]}\nAnimated motd: {toggles[2]}", inline=False)
            q.set_footer(text=random.choice(fot))
        else:
            q = discord.Embed(title="Server Status", description="", color=discord.Color.red())
            q.add_field(name='Server is offline', value="", inline=False)
            q.set_footer(text=random.choice(fot))

        await ctx.send(embed=q)
        

        
def setup(bot: commands.Bot):
    bot.add_cog(McstatusCog(bot))