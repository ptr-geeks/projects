import discord
from discord.ext import commands
import os
import math


pi = []
with open(f"./data/pi.txt", "r") as f:
    pi = f.read()
 

class PiCog(commands.Cog, name="pi command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(name="pi", 
    usage=" s or singe n - gives you n pi number\nf or full n n2 - gives you pi number from n to n2", 
    description="By using [p]pi s that give you")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def pi(self, ctx, mode=None,num = None, num2 = None):
        try:
            num = int(num)
        except:
            num = None
        try:
            num2 = int(num2)
        except:
            num2 = None

        
        res = ''
        if mode == "s" or mode == "single":
            mode = 'single'
            if num == None:
                await ctx.send(f"You need to give me a number")
                return
            if num > len(pi):
                await ctx.send(f"You need to give me a number less than {len(pi)}")
                return

        res = pi[num]

        if mode == 'f' or mode == 'full':
            mode = 'full'
            if num == None and num2 == None:
                await ctx.send(f"You need to give me a number")
                return
            if num2 > len(pi):
                await ctx.send(f"You need to give me a number less than {len(pi)}")
                return
            if num2 == None:
                num2 = num
                num = 0
            if abs(num - num2) > 4000:
                await ctx.send('The difference between the numbers is too high (<4000).')
                return
            
            res = res + pi[num:num2]


        await ctx.send(res)



            
        


        
        
        
def setup(bot: commands.Bot):
    bot.add_cog(PiCog(bot))