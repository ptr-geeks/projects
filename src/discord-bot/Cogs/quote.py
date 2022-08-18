import discord
from discord.ext import commands
import requests
import json
import os
import random

quote_url = "https://zenquotes.io/api/random"

fot = []
with open(f"./data/fot.txt", "r") as f:
    fot.append(f.read())

fot.append("Powered by ZenQuotes.io | Made by Mankifg#1810")


class QuoteCog(commands.Cog, name="quote command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(name="quote", usage=" for random quote", description="Get's a random quote.")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def quote(self, ctx):
        fot[0] = fot[0].replace("{}", ctx.author.name)
        fot[1] = fot[1].replace('{}', ctx.author.name)
        resp = requests.get(quote_url)
        json_data = json.loads(resp.text)
        quote = json_data[0]["q"] + " -" + json_data[0]["a"]
        q = discord.Embed(
            title="Quote", description=quote, color=discord.Color.random()
        )
        q.set_footer(text=random.choice(fot))
        await ctx.send(embed=q)


def setup(bot: commands.Bot):
    bot.add_cog(QuoteCog(bot))
