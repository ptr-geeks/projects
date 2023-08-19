import discord
from discord.ext import commands
import requests, json

joke_url = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit"


class JokeCog(commands.Cog, name="joke command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(name="joke", usage="", description="Gives a random joke.")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def joke(self, ctx):
        joke = requests.get(joke_url).json()

        #! ERROR handled
        if joke["error"]:
            q = discord.Embed(title="Error", color=discord.Color.red())
            q.add_field(f"{joke['code']} | {joke['message']}")
            await ctx.send(embed=q)
            return

        #! Main stuff
        if joke["type"] == "single":
            q = discord.Embed(
                title="Joke", description=joke["joke"], color=discord.Color.random()
            )
        else:
            q = discord.Embed(title="Joke", color=discord.Color.random())
            q.add_field(name=joke["setup"], value=joke["delivery"])

        q.set_footer(text="Using JokeAPI.dev api.")
        await ctx.send(embed=q)


def setup(bot: commands.Bot):
    bot.add_cog(JokeCog(bot))
