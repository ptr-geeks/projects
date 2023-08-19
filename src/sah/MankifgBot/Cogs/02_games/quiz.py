from decimal import DivisionByZero
import discord
from discord.ext import commands
import requests
import json
import random
import asyncio
import os
import functions

import eco

import base64

qttype = ["m", "tf"]
qtc = ["multiple", "boolean"]

quiz_url = "https://opentdb.com/api.php?amount=1"
category_url = "https://opentdb.com/api_category.php"

def decode(encoded_string):
    try:
        decoded_bytes = base64.b64decode(encoded_string)
        decoded_string = decoded_bytes.decode('utf-8')  # Assuming the decoded content is UTF-8 text
        return decoded_string
    except Exception as e:
        return f"Error decoding: {str(e)}"

class TrueFalseView(discord.ui.View):
    def __init__(self,idd):
        super().__init__()
        self.value = None
        self.id = int(idd)
        
    @discord.ui.button(label="True", row=0, style=discord.ButtonStyle.green)
    async def button1(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = True
            self.stop()
            
    @discord.ui.button(label="False", row=0, style=discord.ButtonStyle.danger)
    async def button2(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = False
            self.stop()
            
    @discord.ui.button(label="Stop", row=0, style=discord.ButtonStyle.gray)
    async def button3(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = -1
            self.stop()
            


class FourView(discord.ui.View):
    def __init__(self,idd):
        super().__init__()
        self.value = None
        self.id = int(idd)
        
    @discord.ui.button(label="1", row=0, style=discord.ButtonStyle.primary)
    async def button1(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = 1
            self.stop()
            
    @discord.ui.button(label="2", row=0, style=discord.ButtonStyle.primary)
    async def button2(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = 2
            self.stop()
            
    @discord.ui.button(label="3", row=0, style=discord.ButtonStyle.primary)
    async def button3(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = 3
            self.stop()
            
    @discord.ui.button(label="4", row=0, style=discord.ButtonStyle.primary)
    async def button4(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = 4
            self.stop()
            
    @discord.ui.button(label="Stop", row=0, style=discord.ButtonStyle.gray)
    async def button5(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = -1
            self.stop()

class QuizCog(commands.Cog, name="quiz command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot
        bot = self.bot

    @commands.command(
        name="quiz",
        usage=" [q category = 8 < int < 31] [q type m - multiple, tf - true/false]\n do quiz -1 for possible categories",
        description="Quiz",
    )
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def quiz(self, ctx:discord.ApplicationContext, category: int = None, ttype: str = None):
        
        id = ctx.author.id
        
        coins = 0
        
        correct = 0
        incorrect = 0

        out = None
        gaming = True

        base = quiz_url+"&encode=base64"

        if not category == None:
            if category > 8 and category < 33:
                base += f"&category={category}"
            else:
                resp = requests.get(category_url).json()
                ret = ""
                resp = resp["trivia_categories"]
                for i in resp:
                    ret += f"{i['id']} - {i['name']}\n"

                q = discord.Embed(title="Invalid category", color=discord.Color.red())
                q.add_field(name="Valid categories", value=ret)
                await ctx.send(embed=q)

                return

        if not ttype == None:
            ttype = ttype.lower()
            if not ttype in qttype:
                q = discord.Embed(title="Invalid type", color=discord.Color.red())
                q.add_field(name="Valid types", value="m - multiple\ntf - true/false")
                await ctx.send(embed=q)

                return

            ttype = qtc[qttype.index(ttype)]

            base = base + f"&type={ttype}"

        while gaming:
            if out is not None:
                await out.delete()
            resp = requests.get(base).json()

            if not resp["response_code"] == 0:
                await ctx.send("Error")
                return

            resp = resp["results"][0]
  
            resp["category"] = decode(resp["category"])
            resp["type"] = decode(resp["type"])
            resp["difficulty"] = decode(resp["difficulty"])
            resp["question"] = decode(resp["question"])
            resp["correct_answer"] = decode(resp["correct_answer"])
            
            for i in range(len(resp["incorrect_answers"])):
                resp["incorrect_answers"][i] = decode(resp["incorrect_answers"][i])
                    
            q = discord.Embed(title="Quiz", description="", color=discord.Color.blue())
            q.add_field(name="Category", value=resp["category"], inline=True)
            q.add_field(name="Level of Difficulty", value=resp["difficulty"])
            q.add_field(name="Type", value=resp["type"])

            question = resp["question"]

            
            q.add_field(name="Question", value=question)

            questions = resp["incorrect_answers"]
            questions.append(resp["correct_answer"])

            if resp["type"] == "multiple":
                random.shuffle(questions)
                ans = f"1. {questions[0]},\n2. {questions[1]},\n3. {questions[2]},\n4. {questions[3]}."

                    
                corr = questions.index(resp["correct_answer"]) + 1

            else:
                ans = f"True of False."
                corr = resp["correct_answer"]

            q.add_field(name="Answers", value=ans, inline=False)
            

            if resp["type"] == "multiple":

                fview = FourView(ctx.author.id)
                main_embed = await ctx.send(embed=q, view=fview)
                await fview.wait()
                
                user_value = fview.value
                   
            else:
                tf_view = TrueFalseView(ctx.author.id)
                main_embed = await ctx.send(embed=q, view=tf_view)
                await tf_view.wait()
                
                user_value = tf_view.value
               
            if user_value == -1:
                gaming = False
                break
                
            if user_value == None:
                    q = discord.Embed(title="Opps",description="You have timed out.",color=discord.Color.red())
                    await ctx.send(embed=q)
                    return
                
            await main_embed.delete()
            out = None
            if user_value == corr:
                out = await ctx.send("Correct")
                correct +=1
                if resp["type"] == "multiple":
                    coins = coins + 20
                else:
                    coins = coins + 10
            else:
                
                if resp["type"] == "multiple":
                    c = questions[corr-1]
                else:
                    c = corr
                out = await ctx.send(f"Not correct, correct answers was {c}")
                incorrect +=1

        await ctx.channel.send("You ended the game")

        
        if correct+ incorrect == 0:
            q = discord.Embed(title="No answers found.",description="You nead to play before getting you score.")
            await ctx.send(embed=q)
            
        q = discord.Embed(title=f"Game ended: `{round(correct / (correct + incorrect) * 100, 2)}`%")
        q.add_field(name="Statictics.",value=f"✅:{correct}\n❌: {incorrect}")
        q.add_field(name="Earned coins: ",value=coins)
        
        data = eco.get_user_data(ctx.author.id)
        data["money"] = data["money"] + coins
        eco.save_user_data(data)
        
        await ctx.send(embed=q)
        
def setup(bot: commands.Bot):
    bot.add_cog(QuizCog(bot))