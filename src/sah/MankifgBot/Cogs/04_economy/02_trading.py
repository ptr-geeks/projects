import discord
from discord.ext import commands
from functions import *
from discord.ui import Button,View

import eco

class DuelView(discord.ui.View):
    def __init__(self,idd):
        super().__init__()
        self.value = None
        self.id = int(idd)
        
    @discord.ui.button(label="Accept Trade", row=0, style=discord.ButtonStyle.green)
    async def button1(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = True
            self.stop()
            
    @discord.ui.button(label="Decline Trade", row=0, style=discord.ButtonStyle.danger)
    async def button2(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = False
            self.stop()
            

class tradingCog(commands.Cog, name="trading command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @discord.command(name="pay", usage=" @username", description="Make a transaction")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def pay(self, ctx, second: discord.Member = None, amount:int = 0):
        #? if no1 is passed and amount is not set
        if second == None or amount == 0:
            q = discord.Embed(title="No user was supplied to pay.",color=discord.Color.red())
            q.add_field(name="Correct form",value="`/pay [user:mention] [amount:int]`")
            await ctx.respond(embed=q)
            return 
        
        #? prevent abubse
        if amount < 10:
            q = discord.Embed(title="You can't pay lower than 10 coins")
            await ctx.respond(embed=q)
            return
        
        my_id = ctx.author.id
        your_id = second.id

        if my_id == your_id:
            q = discord.Embed(title="You can't pay yourself.",color=discord.Color.red())
            q.add_field(name="Pay someone else.",value="")
            await ctx.respond(embed=q)
            return
        
               
        eco.create_account(my_id)
        eco.create_account(your_id)
        
        my_data = eco.get_user_data(my_id)
        your_data = eco.get_user_data(your_id)
        
        #? too broke?
        if my_data["money"] < amount:
            q = discord.Embed(title="You don't have enough money to pay that much.",color=discord.Color.red())
            await ctx.respond(embed=q)
            return
        
        my_data["money"] = my_data["money"] - amount
        your_data["money"] = your_data["money"] + amount
 
         
        q = discord.Embed(title=f"Transaction success",color=discord.Color.green())
        q.add_field(name=f"Your balance: {my_data['money']}", value=f"Their balance: {your_data['money']}")
        
        eco.save_user_data(my_data)
        eco.save_user_data(your_data)
        

        await ctx.respond(embed=q)
        
    @discord.command(name="trade", usage=" @username", description="Make a trade")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def trade(self, ctx, second: discord.Member = None):
        if second == None:
            q = discord.Embed(title="No user was supplied to trade.",color=discord.Color.red())
            q.add_field(name="Correct form: ",value="`/trade [user:mention]`")
            await ctx.respond(embed=q)
            return 
        
        
        my_id = ctx.author.id
        your_id = second.id
        
        q = discord.Embed(title="Trade")
        q.add_field(name=f"{second.name} do you want to trade with {ctx.author.name} ? ",value="")
        
        dview = DuelView(your_id)

        respond = await ctx.respond(embed=q, view=dview)

        
        await dview.wait()
        
        if dview.value == None:
            q = discord.Embed(title="Trade",description="You have timed out.")
            await respond.edit(embed=q)
            return 

        if not dview.value:
            q = discord.Embed(title="Trade",description="You have declined the trade.")
            await ctx.respond(embed=q)
            return
               
        eco.create_account(my_id)
        eco.create_account(your_id)
        
        my_data = eco.get_user_data(my_id)
        your_data = eco.get_user_data(your_id)
    
        
        

def setup(bot: commands.Bot):
    bot.add_cog(tradingCog(bot))