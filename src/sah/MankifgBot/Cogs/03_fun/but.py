import discord
from discord.ext import commands
import discord
import discord
from discord.ui import Button,View
from discord.ext import commands
import time

from functions import get_color_from_member 

class MyView(discord.ui.View,):
    
    def __init__(self,idd):
        super().__init__()
        self.value = None
        self.id = int(idd)
    
    @discord.ui.button(label="Accept", row=0, style=discord.ButtonStyle.primary)
    async def button1(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = True
            self.stop() # this is the view.stop


    @discord.ui.button(label="Decline", row=1, style=discord.ButtonStyle.primary)
    async def button2(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = False
            self.stop() # this is the view.stop

class ButtonCog(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    @discord.command(name="hello",description="")
    async def hello(self,ctx:discord.ApplicationContext):
        view = MyView(650756055390879757)
    
        await ctx.respond('choose', view=view)
        
        await view.wait()

        print(view.value)
        
    @commands.command(name="color",description="")
    async def color(self,ctx):
        print(ctx.author.id)
        c = get_color_from_member(ctx.author)
        

            
def setup(bot):
    bot.add_cog(ButtonCog(bot))
