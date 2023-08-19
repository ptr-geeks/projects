import discord
from discord.ext import commands
import json
import random
from functions import *

FIX_LEN = 30
pathToBank = './data/bank.json'

def get_bank_data():
    with open(pathToBank, 'r') as f:
        return json.load(f)

def save_to_bank(data):
    with open(pathToBank, 'w') as f:
        json.dump(data, f)

def create_account(id):
    id = str(id)
    users = get_bank_data()

    if id in users:
        return 
    else:
        users[id] = {}
        users[id]['wallet'] = 0
        users[id]['bank'] = 0
    
    save_to_bank(users)
    return 

def change(id):
    return 

class economyCog(commands.Cog, name="economy command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(name="bal", usage=" @username", description="")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def bal(self, ctx, check: discord.Member = None):
        create_account(ctx.author.id) 
        users = get_bank_data()
        if check == None:
            user = users[str(ctx.author.id)]
            q = discord.Embed(title=f"{ctx.author.name}'s Balance {int(user['wallet']) + int(user['bank'])}", color=discord.Color.random())
            
        else:
            create_account(check.id)
            user = users[str(check.id)]
            q = discord.Embed(title=f"{check.name}'s balance {int(user['wallet']) + int(user['bank'])}", color=discord.Color.random())

        q.add_field(name="Wallet", value=user['wallet'], inline=True)
        q.add_field(name="Bank", value=user['bank'], inline=True)
        
        await ctx.send(embed=q)
        
    
    @commands.command(name="beg", usage="", description="")
    @commands.cooldown(1, 10, commands.BucketType.member)
    async def beg(self, ctx):
        create_account(ctx.author.id)
        
        users = get_bank_data()

        get_money = random.randrange(1, 100)

        users[str(ctx.author.id)]['wallet'] += get_money

        q = discord.Embed(title="Beg", color=discord.Color.random())
        q.add_field(name="You got", value=get_money, inline=True)
        await ctx.send(embed=q)
        
        save_to_bank(users)

    #! DEPOSIT
    @commands.command(name="deposit", usage="", description="Deposit money into your bank account.", aliases=["d","D","dep"])
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def deposit(self, ctx, amount: int):

        if amount <= 0:
            q = discord.Embed(title="Error", color=discord.Color.red())
            q.add_field(name="Negative or none amount isn't allowed", value="Use 1 or more")
            await ctx.send(embed=q)
            return

        create_account(ctx.author.id)
        
        users = get_bank_data()
        if users[str(ctx.author.id)]['wallet'] < amount:
            q = discord.Embed(title="Error", color=discord.Color.red())
            q.add_field(name="You don't have enough money", value=f"You nead {amount - users[str(ctx.author.id)]['wallet']} more.", inline=True)
            
        else:
            users[str(ctx.author.id)]['wallet'] -= amount
            users[str(ctx.author.id)]['bank'] += amount
            q = discord.Embed(title="Transaction", color=discord.Color.random())
            q.add_field(name="You deposited", value=f"{amount} into bank", inline=False)
            q.add_field(name="Wallet", value=users[str(ctx.author.id)]['wallet'], inline=True)
            q.add_field(name="Bank", value=users[str(ctx.author.id)]['bank'], inline=True)
            
        await ctx.send(embed=q)    
        save_to_bank(users)
    
    #! WITHDRAW
    @commands.command(name="withdraw", usage=" [amount]", description="Withdraw money from bank.", aliases=["w","W"])
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def withdraw(self, ctx, amount: int):

        if amount <= 0:
            q = discord.Embed(title="Error", color=discord.Color.red())
            q.add_field(name="Negative or none amount isn't allowed", value="Use 1 or more")
            await ctx.send(embed=q)
            return

        create_account(ctx.author.id)
        
        users = get_bank_data()
        if users[str(ctx.author.id)]['bank'] < amount:
            q = discord.Embed(title="Error", color=discord.Color.red())
            q.add_field(name="You don't have enough money", value=f"You nead {amount - users[str(ctx.author.id)]['bank']} more.", inline=True)
            await ctx.send(embed=q)
            
        else:
            users[str(ctx.author.id)]['bank'] -= amount
            users[str(ctx.author.id)]['wallet'] += amount
            q = discord.Embed(title="Transaction", color=discord.Color.random())
            q.add_field(name="You withdrawed", value=f"{amount} from bank", inline=False)
            q.add_field(name="Wallet", value=users[str(ctx.author.id)]['wallet'], inline=True)
            q.add_field(name="Bank", value=users[str(ctx.author.id)]['bank'], inline=True)
            await ctx.send(embed=q)
            
        save_to_bank(users)

    @commands.command(name="pay", usage=" @user [amount]", description="Transfer money to another user.", aliases=["p","P"])
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def pay(self, ctx, user: discord.Member, amount: int):

        if amount <= 0:
            q = discord.Embed(title="Error", color=discord.Color.red())
            q.add_field(name="Negative or none amount isn't allowed", value="Use 1 or more")
            q.set_footer(text="Abusing exploits isn't allowed. Please report exploits to the issues page. m!links")
            await ctx.send(embed=q)
            return

        create_account(ctx.author.id)
        create_account(user.id)
        
        users = get_bank_data()
        if ctx.author.id == user.id:
            q = discord.Embed(title="Error", color=discord.Color.red())
            q.add_field(name="You can't transfer to yourself", value=f"You have no friends", inline=True)
            q.set_footer(text="Get some friends and touch grass")
            await ctx.send(embed=q)
            return 

        if users[str(ctx.author.id)]['wallet'] < amount:
            q = discord.Embed(title="Error", color=discord.Color.red())
            q.add_field(name="You don't have enough money", value=f"You nead {amount - users[str(ctx.author.id)]['wallet']} more.", inline=True)
            await ctx.send(embed=q)
        else:
            users[str(ctx.author.id)]['wallet'] -= amount
            users[str(user.id)]['wallet'] += amount
            q = discord.Embed(title="Transaction", color=discord.Color.random())
            q.add_field(name="You transferred", value=f"**{amount}** to {user.mention}", inline=False)
            q.add_field(name="Wallet", value=users[str(ctx.author.id)]['wallet'], inline=True)
            q.add_field(name="Bank", value=users[str(ctx.author.id)]['bank'], inline=True)
            await ctx.send(embed=q)

        save_to_bank(users)

    @commands.command(name="top", usage="", description="Gives you top 10 users.", aliases=[])
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def top(self, ctx,):
        create_account(ctx.author.id)
        all_bal = []
        users = []
        data = get_bank_data()

        for i in data:
            all_bal.append(data[i]['wallet'] + int(data[i]['bank']))
            users.append(i)
        all_bal.sort(reverse=True)

        loop = len(users)
        if len(users) > 10:
            loop = 10
        
        q = discord.Embed(title='Top 10 players', color=discord.Color.blue())
        msg = ''
        max_str = 0
        for i in range(loop):
            c = await self.bot.fetch_user(users[i])
            c = str(c)
            if len(c) > max_str:
                max_str = len(c)

        for i in range(loop):
            curr = await self.bot.fetch_user(users[i])
            curr = str(curr)

            msg = msg +f"{i+1}. {curr}  {' ' * (max_str - len(curr))} | {all_bal[i]}\n"
            
        q.add_field(name='Top 10 players', value=f"```{msg}```", inline=False)
        await ctx.send(embed=q)

def setup(bot: commands.Bot):
    bot.add_cog(economyCog(bot))