import discord
from discord.ext import commands
import random
import functions


green_sq = "🟩"
yellow_sq = "🟨" 
gray_sq = "🟥"
LEN = 5

class wordleCog(commands.Cog, name="wordle command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(name="wordle", usage="", description="")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def wordle(self, ctx):
        p = ctx.author.name
        word = "abcde"
        output = ["_ _ _ _ _ ",
                "_ _ _ _ _ ", 
                "_ _ _ _ _ ", 
                "_ _ _ _ _ ", 
                "_ _ _ _ _ ",
                "_ _ _ _ _ ",]

        round = 1
        player = ''
        while True:
            if round == 6:
                await ctx.send(f"You lose, the word was {word}.")
                break


            display = ''
            for z in range(len(output)):
                for char in output[z]:
                    display += char
                display += '\n'

            display = f"```{display}```"

            q = discord.Embed(title=f"Wordle - Round {round}")
            q.add_field(name= "Wordle", value=f"{display}",inline=False)
            q.add_field(name='Enter world',value=p,inline=False)
            q.set_footer(text=functions.get_footer())
            await ctx.send(embed=q)
            
            msg = await self.bot.wait_for('message', 
            check=lambda m: m.author == ctx.author and m.channel == ctx.channel)

            player = msg.content.lower()
            
            if player == word:
                await ctx.send(f"You win, the word was {word}.")
                break
            
            if len(player) != 5:
                await ctx.send(f"{player} is not a valid word.")
                continue
            
            colors =['', '', '', '', '']
            out = ['', '', '', '', '']
            ponavljanje = {'a':0, 'b':0, 'c':0, 'd':0, 'e':0, 'f':0, 'g':0, 'h':0, 'i':0, 'j':0, 'k':0, 'l':0, 'm':0, 'n':0, 'o':0, 'p':0, 'q':0, 'r':0, 's':0, 't':0, 'u':0, 'v':0, 'w':0, 'x':0, 'y':0, 'z':0}
            
            d = len(player)
            for i in range(d):
                if player[i] == word[i]:
                    colors[i] = 'g' 
                    out[i] = player[i] + " "
                    ponavljanje[player[i]] += 1

    
            for i in range(d):
                if player[i] in word and ponavljanje[player[i]] < word.count(player[i]):
                    colors[i] = 'y'
                    out[i] = player[i] + " "
                elif player[i] != word[i]:
                    colors[i] = 'r'
                    out[i] = player[i] + " "

            
            save = ''
            d = len(colors)
            for i in range(d):
                

                if colors[i] == "g":
                    save = save + green_sq + " "
                elif colors[i] == "y":
                    save = save + yellow_sq + " "
                else:
                    save = save + gray_sq + " "

            outt = f"{out[0]}{out[1]}{out[2]}{out[3]}{out[4]}"
            output[round-1] = f"{outt} | {save}"

def setup(bot: commands.Bot):
    bot.add_cog(wordleCog(bot))