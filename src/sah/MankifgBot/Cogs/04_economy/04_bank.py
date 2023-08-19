import discord
from discord.ext import commands
from functions import *

import eco

class profileCog(commands.Cog, name="bank commands"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @discord.command(name="deposit", usage="", description="Deposit money onto bank acconunt", alias=["d"])
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def deposit(self, ctx, value: discord.Option(int, description="How much to deposit", min_value=1,required=True)):
        try:
            value = int(value)
        except:
            q = discord.Embed(title=f"Invalid value", description=f"Learn to type numbers", color=discord.Color.red())
            await ctx.send(embed=q)
            pass
        
        id = ctx.author.id
              
        eco.create_account(id)
        user_data = eco.get_user_data(id)

        if value<0:
            q = discord.Embed(title=f"Invalid value", description=f"Please, use withdraw instead", color=discord.Color.red())
            await ctx.send(embed=q)
            return

        if value==0:
            q = discord.Embed(title=f"Invalid value", description=f"Really?", color=discord.Color.red())
            await ctx.send(embed=q)
            return
        
        if user_data['money'] < value:
            q = discord.Embed(title=f"You're too poor", description=f"You need {value-user_data['money']} more", color=discord.Color.red())
            await ctx.respond(embed=q)
            return


        user_data['money'] -= value
        user_data['bank'] += value
    
        q = discord.Embed(title=f"Balance: {round(user_data['money']+user_data['bank'])}", color=discord.Color.green())
                        
        q.add_field(name="Purse", value=user_data['money'], inline=True)
        q.add_field(name="Bank", value=user_data['bank'], inline=True)
        
        eco.save_user_data(user_data)
            
        await ctx.respond(embed=q)
    

    @discord.command(name="withdraw", usage="", description="Withdraw money from your bank", alias=["w"])
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def withdraw(self, ctx, value: discord.Option(int, description="How much to withdraw", min_value=1,required=True)):
        try:
            value = int(value)
        except:
            q = discord.Embed(title=f"Invalid value", description=f"Learn to type numbers", color=discord.Color.red())
            await ctx.send(embed=q)
            return
        
        id = ctx.author.id
              
        eco.create_account(id)
        user_data = eco.get_user_data(id)

        if value<0:
            q = discord.Embed(title=f"Invalid value", description=f"Please, use deposit instead", color=discord.Color.red())
            await ctx.send(embed=q)
            return

        if value==0:
            q = discord.Embed(title=f"Invalid value", description=f"Really?", color=discord.Color.red())
            await ctx.send(embed=q)
            return
        
        if user_data['bank'] < value:
            q = discord.Embed(title=f"You're too poor", description=f"You need {value-user_data['bank']} more", color=discord.Color.red())
            await ctx.respond(embed=q)
            return


        user_data['money'] += value
        user_data['bank'] -= value
    
        q = discord.Embed(title=f"Balance: {round(user_data['money']+user_data['bank'])}", color=discord.Color.green())
                        
        q.add_field(name="Purse", value=user_data['money'], inline=True)
        q.add_field(name="Bank", value=user_data['bank'], inline=True)
        
        eco.save_user_data(user_data)
            
        await ctx.respond(embed=q)
        

def setup(bot: commands.Bot):
    bot.add_cog(profileCog(bot))