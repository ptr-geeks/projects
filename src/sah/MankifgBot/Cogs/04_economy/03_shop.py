import discord
from discord.ext import commands
from functions import *

import eco

class shopCog(commands.Cog, name="shop commands"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @discord.command(name="buy", usage="", description="Buy item")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def buy(self, ctx, name: discord.Option(str, description="What to buy", required=True)):
        
        id = ctx.author.id

        eco.create_account(id)
        user_data = eco.get_user_data(id)

        #? check if in db
        item_data = eco.load_second_table_idd(1)
        
        name = name.lower()
        
        item_json = None
        for item in item_data["data"]:
            if item["name"] == name or str(item["id"]) == name:
                item_json = item
           
        if item_json == None:
            q = discord.Embed(title=f"The item named: {name} was not found.",
                              description="Use `/display`",color=discord.Color.red())
            await ctx.respond(embed=q)
            return
        
    
        if user_data['money']<item_json["value"]:
            q = discord.Embed(title=f"You don't have enough money to buy {item_json['name']} for {item_json['value']}.",
                              description=f"you need {item_json['value']-user_data['money']} more",
                              color=discord.Color.red())
            await ctx.respond(embed=q)
            return
        
        print(item_json)
        user_data['backpack']['items'].append(item_json)


        user_data['money'] -= item_json['value']

        eco.save_user_data(user_data)

        
        q = discord.Embed(title=f"You successfully purchased {name} for {item_json['value']}",
                              description=f"Now you have only {user_data['money']}",
                              color=discord.Color.green())
        
        await ctx.respond(embed=q)
            
    @discord.command(name="sell", usage="", description="Sell item")
    @commands.cooldown(1, 2, commands.BucketType.member)       
    async def sell(self, ctx, name: discord.Option(str, description="What to sell", required=True)):

        id = ctx.author.id

        eco.create_account(id)
        user_data = eco.get_user_data(id)


        if name not in list([item['name'] for item in user_data['backpack']['items']]):
            q = discord.Embed(title=f"You don't have {name} to sell it!",
                                color=discord.Color.red())
            await ctx.respond(embed=q)
            return
         

        for item in user_data['backpack']['items']:
            if item['name'] == name or str(item["id"]) == name:
                value = int(item["value"] * item["sell"])
                user_data['backpack']['items'].remove(item)
                user_data['money'] += value
                break

        eco.save_user_data(user_data)
        
        q = discord.Embed(title=f"You successfully sold {name} for {value}",
                                description=f"Now you have {user_data['money']}",
                                color=discord.Color.green())
        
        await ctx.respond(embed=q)
        
def setup(bot: commands.Bot):
    bot.add_cog(shopCog(bot))
