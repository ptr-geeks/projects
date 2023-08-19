import discord
from discord.ext import commands
import requests, json


class linksCog(commands.Cog, name="links command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(
        name="links", usage="", description="Gives a links for essentially everything."
    )
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def links(self, ctx):
        q = discord.Embed(title="Links", color=discord.Color.blue())
        q.add_field(
            name="Github Page",
            value="https://github.com/Mankifg/MankifgBot",
            inline=False,
        )
        q.add_field(
            name="Github Issues page",
            value="https://github.com/Mankifg/MankifgBot/issues",
            inline=False,
        )
        q.add_field(
            name="Discord Server", value="https://discord.gg/bCMeynf9dC", inline=False
        )

        await ctx.send(embed=q)


def setup(bot: commands.Bot):
    bot.add_cog(linksCog(bot))
