import discord
from discord.ext import commands
from functions import *
import os
from supabase import create_client, Client
import supabase
import discord
from discord.ext import commands
import discord
import discord
from discord.ui import Button,View
from discord.ext import commands
import time

import eco
items = [item2['name'] for item2 in eco.load_second_table_idd(1)['data']]

class MyModal(discord.ui.Modal): # create
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

        self.add_item(discord.ui.InputText(label="name?"))
        self.add_item(discord.ui.InputText(label="value?"))

    async def callback(self, interaction: discord.Interaction):
        embed = discord.Embed(title="Created new item")
        
        if int(self.children[1].value) < 1:
            embed= discord.Embed(title="Error", description="Value must be greater than 0",color=discord.Color.red())
            await interaction.response.send_message(embeds=[embed])
            return

        
        max_id = 0
        data = eco.load_second_table_idd(1)
        for item in data["data"]:
            if item["id"] > max_id:
                max_id = item["id"]
        
        item_json = {
            "id": max_id+1,
            "name":self.children[0].value,
            "value": int(self.children[1].value),
            "sell":0.5,
        }
        

        data["data"].append(item_json)
        
        eco.save_second_table_idd(data)
        
        embed.add_field(name="Name", value=self.children[0].value)
        embed.add_field(name="Id", value=max_id)
        embed.add_field(name="Value", value=self.children[1].value)
        
        await interaction.response.send_message(embeds=[embed])


class MyModal2(discord.ui.Modal): # balance
    def __init__(self, idd, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.id = idd
        self.data = eco.get_user_data(self.id)
        self.add_item(discord.ui.InputText(label=f"Purse (before {self.data['money']})?"))
        self.add_item(discord.ui.InputText(label=f"Bank? (before {self.data['bank']})?"))

    async def callback(self, interaction: discord.Interaction):
        
        try:    
            if int(self.children[1].value) < 1 or int(self.children[0].value) < 1:
                embed= discord.Embed(title="Error", description="Value must be greater than 0",color=discord.Color.red())
                await interaction.response.send_message(embeds=[embed])
                return
        except:
            embed= discord.Embed(title="Error", description="Value must be integer", color=discord.Color.red())
            await interaction.response.send_message(embeds=[embed])
            return
        self.data['money'] = self.children[0].value
        self.data['bank'] = self.children[1].value
        
        embed = discord.Embed(title="Changed balance",color=discord.Color.green())
        eco.save_user_data(self.data)
        
        embed.add_field(name="Purse", value=self.children[0].value)
        embed.add_field(name="Bank", value=self.children[1].value)
        
        await interaction.response.send_message(embeds=[embed])

cool_guys = [833403343690530827,650756055390879757]

class sudoCog(commands.Cog, name="admin commands"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @discord.command(name="sudo", usage="", description="Debug")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def sudo(self, ctx):
        data = eco.get_bank_data()
        await ctx.respond(data) 

    @discord.command(name="balance", usage=" @username", description="Change someone's balance.")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def balance(self, ctx, user: discord.Member = None):
        if user == None:
            userObj = ctx.author
        else:
            userObj = user  
            
        id = userObj.id
        eco.create_account(id)
        #//user_data = eco.get_user_data(id)
        if not ctx.author.id in cool_guys:
            q = discord.Embed(title="Missing permissinon to edit balance.",color=discord.Color.red())
            await ctx.respond(embed=q)
            return
        
        modal = MyModal2(id, title=f"Changing {userObj.name.title()}'s balance")
        
        await ctx.send_modal(modal)

    @discord.command(name="create", usage="", description="Create new item")
    async def create(self, ctx):
        if not ctx.author.id in cool_guys:
            q = discord.Embed(title="Missing permissinon to create items.",color=discord.Color.red())
            await ctx.send(embed=q)
            return
        
        modal = MyModal(title="Making a new item")
        
        await ctx.send_modal(modal)
    

"""
    #todo fix refreshing 
    @discord.command(name="delete", usage="", description="Delete item")
    async def delete(self,
        ctx: discord.ApplicationContext,
        item: discord.Option(str, choices=refresh(), description="Pick item to delete"),
    ):
        table = eco.load_second_table_idd(1)['data']
        data = eco.load_second_table_idd(1)
        newtable = [item2 for item2 in table if item2['name'] != item]
        data['data']= newtable
        eco.save_second_table_idd(data)
        await ctx.respond("Item deleted!")       
        #items = [item2['name'] for item2 in eco.load_second_table_idd(1)['data']]
        #print(items)"""

def setup(bot: commands.Bot):
    bot.add_cog(sudoCog(bot))