import discord
from discord.ext import commands
import asyncio

igralci = ["O", "X"]

numbers = {1:"1️⃣", 2:"2️⃣", 3:"3️⃣", 4:"4️⃣", 5:"5️⃣", 6:"6️⃣", 7:"7️⃣", 8:"8️⃣", 9:"9️⃣"}

yes = "✅"
no = "❌"
leave = "🌑"

def preostalePoteze(board):
    for i in range(3):
        for j in range(3):
            if board[i][j] == " ":
                return True

    return False


def oceniPolozaj(board):
    for vrstica in range(3):
        if (
            board[vrstica][0] == board[vrstica][1]
            and board[vrstica][1] == board[vrstica][2]
        ):
            if board[vrstica][0] == igralci[0]:
                return 10
            elif board[vrstica][0] == igralci[1]:
                return -10

    for stolpec in range(3):
        if (
            board[0][stolpec] == board[1][stolpec]
            and board[1][stolpec] == board[2][stolpec]
        ):
            if board[0][stolpec] == igralci[0]:
                return 10
            elif board[0][stolpec] == igralci[1]:
                return -10

    if board[0][0] == board[1][1] and board[1][1] == board[2][2]:
        if board[0][0] == igralci[0]:
            return 10
        elif board[0][0] == igralci[1]:
            return -10

    if board[0][2] == board[1][1] and board[1][1] == board[2][0]:
        if board[0][2] == igralci[0]:
            return 10
        elif board[0][2] == igralci[1]:
            return -10

    return 0


def minimax(board, globina, jeMax):
    rezultat = oceniPolozaj(board)

    if rezultat == 10 or rezultat == -10:
        return rezultat

    if not preostalePoteze(board):
        return 0

    if jeMax:
        naj = -1000
        for i in range(3):
            for j in range(3):
                if board[i][j] == " ":
                    board[i][j] = igralci[0]
                    naj = max(naj, minimax(board, globina + 1, not jeMax))
                    board[i][j] = " "

    else:
        naj = 1000
        for i in range(3):
            for j in range(3):
                if board[i][j] == " ":
                    board[i][j] = igralci[1]
                    naj = min(naj, minimax(board, globina + 1, not jeMax))
                    board[i][j] = " "

    return naj


def racunalnikPoteza(board):
    najPostavitev = [-1, -1]
    naj = -1000
    for i in range(3):
        for j in range(3):
            if board[i][j] == " ":
                board[i][j] = "O"
                tr = minimax(board, 0, False)
                if tr > naj:
                    naj = tr
                    najPostavitev[0] = i
                    najPostavitev[1] = j

                board[i][j] = " "

    board[najPostavitev[0]][najPostavitev[1]] = "O"
    del numbers[najPostavitev[0] * 3 + najPostavitev[1] + 1]


def make_board(board):
    ret = ""
    for i in range(3):
        if i != 0:
            ret = ret + "-" * 9 + "\n"

        for j in range(3):
            ret = ret + board[i][j]
            if j != 2:
                ret = ret + " | "

        ret = ret + "\n"

    return ret


class tictactoeCog(commands.Cog, name="ping command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(name="tictactoe", usage="", description="wip", aliases=["ttt"])
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def tictactoe(self, ctx, member: discord.Member = None):
        global numbers

        gamming = True

        # user = ctx.author
        username = ctx.author.name

        board = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]]
        if member == None:
            #! player vs computer
            while gamming:
                good_answer = False
                while not good_answer:
                    q = discord.Embed(
                        title="Tic Tac Toe",
                        description="",
                        color=discord.Color.random(),
                    )
                    q.set_author(name=ctx.author.name, icon_url=ctx.author.avatar_url)
                    q.add_field(
                        name="Board: ",
                        value=f"**```{make_board(board)}```**",
                        inline=False,
                    )

                    bsend = await ctx.send(embed=q)

                    for key in numbers.keys():
                        await bsend.add_reaction(numbers[key])
                    
                    await bsend.add_reaction(leave)

                    try:
                        reaction, user = await self.bot.wait_for(
                            "reaction_add",
                            check=lambda reaction, user: user == ctx.author
                            and (reaction.emoji in numbers.values() or reaction.emoji == leave),
                            timeout=30.0,
                        )

                    except asyncio.TimeoutError:
                        gamming = False
                        await ctx.send(f"{ctx.author.name} left game **what a loser**!")
                        break

                    else:
                        if reaction.emoji == leave:
                            await ctx.send(f"{ctx.author.name} left game **what a loser**!")
                            numbers = {1:"1️⃣", 2:"2️⃣", 3:"3️⃣", 4:"4️⃣", 5:"5️⃣", 6:"6️⃣", 7:"7️⃣", 8:"8️⃣", 9:"9️⃣"}
                            return 0
                    
                        for key in numbers.keys():
                            if reaction.emoji == numbers[key]:
                                place = key - 1

                    del numbers[place + 1]
                    j = int(place % 3)
                    i = int(place / 3)

                    if board[i][j] == " ":
                        board[i][j] = "X"
                        good_answer = True
                    else:
                        await ctx.send("You can't do that")
                        continue

                ocena = oceniPolozaj(board)

                if ocena == 10:
                    q = discord.Embed(
                        title="Tic Tac Toe",
                        description="",
                        color=discord.Color.random(),
                    )
                    q.add_field(
                        name="Winner: ", value=f"**```Computer```**", inline=False
                    )
                    await ctx.send(embed=q)
                    gamming = False
                    numbers = {1:"1️⃣", 2:"2️⃣", 3:"3️⃣", 4:"4️⃣", 5:"5️⃣", 6:"6️⃣", 7:"7️⃣", 8:"8️⃣", 9:"9️⃣"}
                    return

                elif ocena == -10:
                    q = discord.Embed(
                        title="Tic Tac Toe",
                        description="",
                        color=discord.Color.random(),
                    )
                    q.add_field(name="Winner: ", value=f"{username}", inline=False)

                    await ctx.send(embed=q)
                    gamming = False
                    numbers = {1:"1️⃣", 2:"2️⃣", 3:"3️⃣", 4:"4️⃣", 5:"5️⃣", 6:"6️⃣", 7:"7️⃣", 8:"8️⃣", 9:"9️⃣"}
                    return

                if not preostalePoteze(board):
                    await ctx.send("Draw")
                    numbers = {1:"1️⃣", 2:"2️⃣", 3:"3️⃣", 4:"4️⃣", 5:"5️⃣", 6:"6️⃣", 7:"7️⃣", 8:"8️⃣", 9:"9️⃣"}
                    return 0

                if not preostalePoteze(board):
                    q = discord.Embed(
                        title="Tic Tac Toe", description="", color=0x4a4a4a
                    )
                    q.add_field(name="Draw", value=f"", inline=False)
                    await ctx.send(embed=q)
                    gamming = False
                    numbers = {1:"1️⃣", 2:"2️⃣", 3:"3️⃣", 4:"4️⃣", 5:"5️⃣", 6:"6️⃣", 7:"7️⃣", 8:"8️⃣", 9:"9️⃣"}
                    return

                racunalnikPoteza(board)

        else:
            #! player vs player

            players = [ctx.author, member]

            q = discord.Embed(
                title="Tic Tac Toe Duel",
                description=f"{players[0].name} vs {players[1].name}",
                color=discord.Color.blue(),
            )
            q.add_field(
                name="Challenger: ",
                value=f"**```{players[0].name}```**",
                inline=False,
            )
            q.add_field(name="Challenged: ", value=f"**```{players[1].name}```**", inline=False)

            bsend = await ctx.send(embed=q)
            await bsend.add_reaction(yes)
            await bsend.add_reaction(no)

            try:
                reaction, user = await self.bot.wait_for(
                    "reaction_add",
                    check=lambda reaction, user: user == players[1]
                    and (reaction.emoji == yes or reaction.emoji == no),
                    timeout=30.0,
                )

            except asyncio.TimeoutError:
                await ctx.send(f"**{players[1].name}** rejected duel!")
                gamming = False
            
            else :
                if (reaction.emoji == no) :
                    await ctx.send(f"**{players[1].name}** rejected duel!")
                    return

            while gamming:
                for x in range(len(players)):
                    good_answer = False
                    while not good_answer:

                        if x == 0:
                            q = discord.Embed(
                                title="Tic Tac Toe",
                                description="",
                                color=discord.Color.red(),
                            )
                        else:
                            q = discord.Embed(
                                title="Tic Tac Toe",
                                description="",
                                color=discord.Color.blue(),
                            )
                        q.set_author(
                            name=players[x].name, icon_url=players[x].avatar_url
                        )
                        q.add_field(
                            name="Board: ",
                            value=f"**```{make_board(board)}```**",
                            inline=False,
                        )

                        bsend = await ctx.send(embed=q)
                        for key in numbers.keys():
                            await bsend.add_reaction(numbers[key])
                        
                        await bsend.add_reaction(leave)

                        try:
                            reaction, user = await self.bot.wait_for(
                                "reaction_add",
                                check=lambda reaction, user: user == players[x]
                                and (reaction.emoji in numbers.values() or reaction.emoji == leave),
                                timeout=30.0,
                            )

                        except asyncio.TimeoutError:
                            await ctx.send(f"{players[x].name} left game **what a loser**!")
                            gamming = False

                        else:
                            if reaction.emoji == leave:
                                await ctx.send(f"{players[x].name} left game **what a loser**!")
                                numbers = {1:"1️⃣", 2:"2️⃣", 3:"3️⃣", 4:"4️⃣", 5:"5️⃣", 6:"6️⃣", 7:"7️⃣", 8:"8️⃣", 9:"9️⃣"}
                                return 0
                            
                            found_place = False
                            for key in numbers.keys():
                                if reaction.emoji == numbers[key]:
                                    found_place = True
                                    place = key - 1

                            if not found_place:
                                await ctx.send("Invalid place")
                                numbers = {1:"1️⃣", 2:"2️⃣", 3:"3️⃣", 4:"4️⃣", 5:"5️⃣", 6:"6️⃣", 7:"7️⃣", 8:"8️⃣", 9:"9️⃣"}
                                return 0

                            j = int(place % 3)
                            i = int(place / 3)

                            if board[i][j] == " ":
                                board[i][j] = igralci[x]
                                good_answer = True
                                del numbers[place + 1]
                                break
                            else:
                                continue

                    ocena = oceniPolozaj(board)

                    if ocena == 10:

                        q = discord.Embed(
                            title="Tic Tac Toe",
                            description="",
                            color=discord.Color.red(),
                        )
                        q.add_field(
                            name="Winner: ",
                            value=f"**```{players[0].name}```**",
                            inline=False,
                        )
                        await ctx.send(embed=q)
                        gamming = False
                        numbers = {1:"1️⃣", 2:"2️⃣", 3:"3️⃣", 4:"4️⃣", 5:"5️⃣", 6:"6️⃣", 7:"7️⃣", 8:"8️⃣", 9:"9️⃣"}
                        return

                    elif ocena == -10:
                        q = discord.Embed(
                            title="Tic Tac Toe",
                            description="",
                            color=discord.Color.blue(),
                        )
                        q.add_field(
                            name="Winner: ", value=f"{players[1].name}", inline=False
                        )

                        await ctx.send(embed=q)
                        gamming = False
                        numbers = {1:"1️⃣", 2:"2️⃣", 3:"3️⃣", 4:"4️⃣", 5:"5️⃣", 6:"6️⃣", 7:"7️⃣", 8:"8️⃣", 9:"9️⃣"}
                        return

                    if not preostalePoteze(board):
                        q = discord.Embed(
                            title="Tic Tac Toe",
                            description="",
                            color=0x4a4a4a,
                        )
                        q.add_field(name="Draw", value=f"remi", inline=False)
                        await ctx.send(embed=q)
                        gamming = False
                        numbers = {1:"1️⃣", 2:"2️⃣", 3:"3️⃣", 4:"4️⃣", 5:"5️⃣", 6:"6️⃣", 7:"7️⃣", 8:"8️⃣", 9:"9️⃣"}
                        return

        numbers = {1:"1️⃣", 2:"2️⃣", 3:"3️⃣", 4:"4️⃣", 5:"5️⃣", 6:"6️⃣", 7:"7️⃣", 8:"8️⃣", 9:"9️⃣"}

def setup(bot: commands.Bot):
    bot.add_cog(tictactoeCog(bot))