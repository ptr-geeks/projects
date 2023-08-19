import discord
from discord.ext import commands
import requests
import json
import os
import random

quote_url = "https://zenquotes.io/api/random"

class QuoteCog(commands.Cog, name="quote command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(name="quote", usage="", description="Get's a random quote.")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def quote(self, ctx):
        resp = requests.get(quote_url).json()
        resp = resp[0]

        quote = resp["q"]
        q = discord.Embed(
            title=quote, color=discord.Color.random()
        )
        q.add_field(name="by",value=resp["a"])

        q.set_footer(text="Powered by ZenQuotes.io")
        await ctx.send(embed=q)


def setup(bot: commands.Bot):
    bot.add_cog(QuoteCog(bot))
