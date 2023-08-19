import discord
from discord.ext import commands
from functions import *
import os
from supabase import create_client, Client
import supabase

import eco

url: str = os.environ.get("SUPA_URL")
key: str = os.environ.get("SUPA_KEY")

supabase: Client = create_client(url, key)

class givememoneyyCog(commands.Cog, name="givememoneyy command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(name="givememoneyy", usage="", description="")
    @commands.cooldown(1, 30, commands.BucketType.member)
    async def givememoneyy(self, ctx):

        userObj = ctx.author
        id = userObj.id    
               
        eco.create_account(id)
        user_data = eco.get_user_data(id)
        
        user_data["money"] = user_data["money"] + 1000
        await ctx.send("some money")
        eco.save_user_data(user_data)

def setup(bot: commands.Bot):
    bot.add_cog(givememoneyyCog(bot))
