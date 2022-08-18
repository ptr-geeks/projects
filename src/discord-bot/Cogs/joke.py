import discord
from discord.ext import commands
import requests
import json
import os
import random

fot = []
with open(f"./data/fot.txt", "r") as f:
    fot = f.read().splitlines()

fot.append("Powered by JokeAPI.dev | Made by Mankifg#1810")

joke_url = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist&type=single"


class JokeCog(commands.Cog, name="joke command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(
        name="joke", usage="for random joke", description="Gives a random joke."
    )
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def joke(self, ctx):
        fot[0] = fot[0].replace("{}", ctx.author.name)
        fot[1] = fot[1].replace('{}', ctx.author.name)
        joke = requests.get(joke_url).json()["joke"]
        q = discord.Embed(title="Joke", description=joke, color=discord.Color.random())
        q.set_footer(text=random.choice(fot))
        await ctx.send(embed=q)


def setup(bot: commands.Bot):
    bot.add_cog(JokeCog(bot))
