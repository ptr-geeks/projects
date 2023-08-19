import discord
from discord.ext import commands
import random

hangman = [
            "",
            "\n```     _____\n    |/   |\n    |      \n    |      \n    |     \n    |      \n    |\n    |_______```\n",
            "\n```     _____\n    |/   |\n    |   ( )\n    |      \n    |     \n    |      \n    |\n    |_______```\n",
            "\n```     _____\n    |/   |\n    |   (_)\n    |      \n    |     \n    |      \n    |\n    |_______```\n",
            "\n```     _____\n    |/   |\n    |   (_)\n    |    |\n    |    \n    |   \n    |\n    |_______```\n",
            "\n```     _____\n    |/   |\n    |   (_)\n    |   /|\n    |    \n    |   \n    |\n    |_______```\n",
            "\n```     _____\n    |/   |\n    |   (_)\n    |   /|\\\n    |    \n    |   \n    |\n    |_______```\n",
            "\n```     _____\n    |/   |\n    |   (_)\n    |   /|\\\n    |    |\n    |      \n    |\n    |_______```\n",
            "\n```     _____\n    |/   |\n    |   (_)\n    |   /|\\\n    |    |\n    |     |\n    |\n    |_______```\n",
            "\n```     _____\n    |/   |\n    |   (_)\n    |   /|\\\n    |    |\n    |   | |\n    |\n    |_______```\n"
            ]

all_words  = []
path = './data/words.txt'
with open(path, 'r') as f:
    all_words = f.read().split('\n')


class hangmanCog(commands.Cog, name="hangman command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(name="hangman", usage="", description="desc")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def hangman(self, ctx):
        hidden = []
        wrong = 0
        attemp = 0

        word = random.choice(all_words)

        narobe = []
        for i in range(len(word)):
            hidden.append('_')
        
        while True:
            attemp = attemp + 1
            message = ''
            for x in range(len(hidden)):
                message = message + " " + hidden[x]
            
            embed = discord.Embed(title="Hangman")
            embed.add_field(name= 'vislice', value=f"{hangman[wrong]}\n\nYou have {wrong} wrong guesses\n\nThis is your {attemp} attempt.\n\n```{message}```")
            await ctx.send(embed=embed)

            msg = await self.bot.wait_for('message', check=lambda x: x.author.id == ctx.author.id)
            player_input = msg.content.lower()
            
            inside = False
            for a in range(len(word)):
                if word[a] == player_input:
                    hidden[a] = player_input
                    inside = True
            if not inside:
                wrong = wrong + 1
                
            
            win = True
            for a in range(len(hidden)):
                if hidden[a] == "_":
                    win = False
            if win:
                q = discord.Embed(title="You win.")
                q.add_field(name=f"You guesses the word: {word} in {attemp} attempts.",value="_"*10)
                await ctx.send(embed=q)
                break
            
            if wrong == 9:
                q = discord.Embed(title="You lost")
                q.add_field(name=f"The word was: {word}",value="_"*10)
                await ctx.send(embed=q)
                break
        
def setup(bot: commands.Bot):
    bot.add_cog(hangmanCog(bot))
