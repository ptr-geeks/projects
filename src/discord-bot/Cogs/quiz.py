from decimal import DivisionByZero
import discord
from discord.ext import commands
import requests
import json
import random
import asyncio
import os

qttype = ["m", "tf"]
qtc = ["multiple", "boolean"]

quiz_url = "https://opentdb.com/api.php?amount=1"
category_url = "https://opentdb.com/api_category.php"

yes = "✅"
no = "❌"
leave = "🌑"


numbers = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"]

zero = numbers[0]
one = numbers[1]
two = numbers[2]
three = numbers[3]
four = numbers[4]
five = numbers[5]
six = numbers[6]
seven = numbers[7]
eight = numbers[8]
nine = numbers[9]

fot = []
with open(f"./data/fot.txt", "r") as f:
    fot.append(f.read())

fot.append("Powered by OpenTDB.com | Made by Mankifg#1810")
fot.append(
    "If the answers are wrong, donit blame me. Blame OpenTDB.com. | Made by Mankifg#1810"
)

special = []
with open(f"./data/special.txt", mode="r", encoding="utf-8") as f:
    special = f.read().splitlines()

a = []
b = []

for i, v in enumerate(special):
    hold = v.split(",")
    a.append(hold[0])
    b.append(hold[1])


class QuizCog(commands.Cog, name="ping command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot
        bot = self.bot

    @commands.command(
        name="quiz",
        usage=" [q category = 8 < int < 31] [q type m - multiple, tf - true/false]\n do quiz -1 for possible categories",
        description="Quiz",
    )
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def quiz(self, ctx, category: int = None, ttype: str = None):
        fot[0] = fot[0].replace("{}", ctx.author.name)
        fot[1] = fot[1].replace('{}', ctx.author.name)

        correct = 0
        incorrect = 0

        con = True

        base = quiz_url

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
                q.set_footer(text=random.choice(fot))

                await ctx.send(embed=q)

                return

        if not ttype == None:
            ttype = ttype.lower()
            if not ttype in qttype:
                q = discord.Embed(title="Invalid type", color=discord.Color.red())
                q.add_field(name="Valid types", value="m - multiple\ntf - true/false")
                q.set_footer(text=random.choice(fot))

                await ctx.send(embed=q)

                return

            ttype = qtc[qttype.index(ttype)]

            base = base + f"&type={ttype}"

        while con:
            resp = requests.get(base).json()

            if not resp["response_code"] == 0:
                await ctx.send("Error")
                return

            resp = resp["results"]

            q = discord.Embed(title="Quiz", desciption="", color=discord.Color.blue())
            q.add_field(name="Category", value=resp[0]["category"], inline=True)
            q.add_field(name="Level of Difficulty", value=resp[0]["difficulty"])
            q.add_field(name="Type", value=resp[0]["type"])

            question = resp[0]["question"]

            for i in range(len(a)):
                question = question.replace(b[i], a[i])

            q.add_field(name="Question", value=question)

            questions = resp[0]["incorrect_answers"]
            questions.append(resp[0]["correct_answer"])

            if resp[0]["type"] == "multiple":
                random.shuffle(questions)
                ans = f"1. {questions[0]},\n2. {questions[1]},\n3. {questions[2]},\n4. {questions[3]}."

                for i in range(len(a)):
                    ans = ans.replace(b[i], a[i])
                    
                corr = questions.index(resp[0]["correct_answer"]) + 1

            else:
                ans = f"True of False."
                corr = resp[0]["correct_answer"]

            for i in range(len(a)):
                ans = ans.replace(a[i], b[i])
            q.add_field(name="Answers", value=ans, inline=False)
            q.set_footer(text=random.choice(fot))

            add_r = await ctx.send(embed=q)

            if resp[0]["type"] == "multiple":

                await add_r.add_reaction(one)
                await add_r.add_reaction(two)
                await add_r.add_reaction(three)
                await add_r.add_reaction(four)
                await add_r.add_reaction(leave)

                try:
                    reaction, user = await self.bot.wait_for(
                        "reaction_add",
                        check=lambda reaction, user: user == ctx.author
                        and reaction.emoji in [one, two, three, four, leave],
                        timeout=30.0,
                    )

                except asyncio.TimeoutError:
                    con = False

                else:
                    if reaction.emoji == leave:
                        con = False
                        await ctx.send("Ending")
                        break

                    smart = False
                    for i in range(4):
                        if reaction.emoji == numbers[i] and corr == i:
                            smart = True

                    if smart:
                        await ctx.send("Correct.")
                        correct = correct + 1
                        con = True

                    else:
                        await ctx.send(f"{no}Incorrect{no}, correct answer was {corr}.")
                        incorrect = incorrect + 1

                        con = True

            else:
                await add_r.add_reaction(yes)
                await add_r.add_reaction(no)
                await add_r.add_reaction(leave)

                try:
                    reaction, user = await self.bot.wait_for(
                        "reaction_add",
                        check=lambda reaction, user: user == ctx.author
                        and reaction.emoji in [yes, no, leave],
                        timeout=30.0,
                    )

                except asyncio.TimeoutError:
                    con = False

                else:
                    if reaction.emoji == leave:
                        con = False
                        break

                    if reaction.emoji == yes and corr == "True":
                        await ctx.send(f"{yes} Correct {yes}")
                        correct = correct + 1
                        con = True

                    else:
                        await ctx.send(f"{no}Incorrect{no}, correct answer was {corr}.")
                        incorrect = incorrect + 1

                        con = True

        await ctx.channel.send("You ended the game")
        await ctx.send(
            f"`{correct}` Correct, `{incorrect}` Incorrect and `{correct + incorrect}` completed."
        )
        try:
            await ctx.send(f"`{round(correct / (correct + incorrect) * 100, 2)}`% ")
        except DivisionByZero:
            await ctx.send("You have zero answered questions.")


def setup(bot: commands.Bot):
    bot.add_cog(QuizCog(bot))
