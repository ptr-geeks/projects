import discord
from discord.ext import commands
import random
import os

fot = []
with open(f"./data/fot.txt", "r") as f:
    fot.append(f.read())

fot.append("Powered by Random | Made by Mankifg#1810")


class RandCog(commands.Cog, name="ping command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(name="rand", usage=" [n1] [n2]. if empty range is 0-1, if n2 empty 0-n1 else n1-n2", description="Get's a random number.")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def rand(self, ctx, low: int = None, high: int = None):
        if high == None:
            if low == None:
                num = random.randint(0, 1000000) / 1000000
                low = 0
                high = 1
            else:
                high = low
                low = 0
                num = random.randint(low, high)
        else:
            if low > high:
                low, high = high, low
            num = random.randint(low, high)

        q = discord.Embed(
            title="Random",
            description=f"{num}, range: {low} - {high}",
            color=discord.Color.random(),
        )
        fot[0] = fot[0].replace("{}", ctx.author.name)
        fot[1] = fot[1].replace('{}', ctx.author.name)
        q.set_footer(text=random.choice(fot))
        await ctx.send(embed=q)


def setup(bot: commands.Bot):
    bot.add_cog(RandCog(bot))
