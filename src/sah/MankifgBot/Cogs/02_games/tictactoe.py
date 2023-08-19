import discord
from discord.ext import commands
import asyncio
from discord.ui import Button,View

igralci = ["X", "O"]

P1 = "\N{Regional Indicator Symbol Letter X}"
P2 = "\N{Regional Indicator Symbol Letter O}"
EMPTY ="\N{white large square}"


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

def prepare_board(board):
    return board

class DuelView(discord.ui.View):
    def __init__(self,idd):
        super().__init__()
        self.value = None
        self.id = int(idd)
        
    @discord.ui.button(label="Accept Duel", row=0, style=discord.ButtonStyle.green)
    async def button1(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = True
            self.stop()
            
    @discord.ui.button(label="Decline Duel", row=0, style=discord.ButtonStyle.danger)
    async def button2(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = False
            self.stop()
            
class GameView(discord.ui.View):
    def __init__(self,idd,board,player1):
        super().__init__()
        self.value = None
        self.id = int(idd)
        self.board = board
        
        
        
        # [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']]
        
    
        emojify = []
        toggles = []
        
        for a in range(len(self.board)):
            for b in range(len(self.board[a])):
                curr = self.board[a][b]
                if curr == " ":
                    toggles.append(False)
                else:
                    toggles.append(True)
                    
                if curr == "X":
                    emojify.append(P1)
                elif curr == "O":
                    emojify.append(P2)
                else:
                    emojify.append(EMPTY)

        if not player1:
            self.button1 = discord.ButtonStyle.green
            self.button2 = discord.ButtonStyle.green
            self.button3 = discord.ButtonStyle.green
            self.button4 = discord.ButtonStyle.green
            self.button5 = discord.ButtonStyle.green
            self.button6 = discord.ButtonStyle.green
            self.button7 = discord.ButtonStyle.green
            self.button8 = discord.ButtonStyle.green
            self.button9 = discord.ButtonStyle.green

        self.button1.disabled = toggles[0]
        self.button2.disabled = toggles[1]
        self.button3.disabled = toggles[2]
        self.button4.disabled = toggles[3]
        self.button5.disabled = toggles[4]
        self.button6.disabled = toggles[5]
        self.button7.disabled = toggles[6]
        self.button8.disabled = toggles[7]
        self.button9.disabled = toggles[8]
        
        self.button1.emoji = emojify[0]
        self.button2.emoji = emojify[1]
        self.button3.emoji = emojify[2]
        self.button4.emoji = emojify[3]
        self.button5.emoji = emojify[4]
        self.button6.emoji = emojify[5]
        self.button7.emoji = emojify[6]
        self.button8.emoji = emojify[7]
        self.button9.emoji = emojify[8]
            
    @discord.ui.button(row=0, style=discord.ButtonStyle.primary)
    async def button1(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = 1
            self.stop()
            
    @discord.ui.button(row=0, style=discord.ButtonStyle.primary)
    async def button2(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = 2
            self.stop()
            
    @discord.ui.button(row=0, style=discord.ButtonStyle.primary)
    async def button3(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = 3
            self.stop()
            
    @discord.ui.button(row=1, style=discord.ButtonStyle.primary)
    async def button4(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = 4
            self.stop()
            
    @discord.ui.button(row=1, style=discord.ButtonStyle.primary)
    async def button5(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = 5
            self.stop()
            
    @discord.ui.button(row=1, style=discord.ButtonStyle.primary)
    async def button6(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = 6
            self.stop()
            
    @discord.ui.button(row=2, style=discord.ButtonStyle.primary)
    async def button7(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = 7
            self.stop()
            
    @discord.ui.button(row=2, style=discord.ButtonStyle.primary)
    async def button8(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = 8
            self.stop()
            
    @discord.ui.button(row=2, style=discord.ButtonStyle.primary)
    async def button9(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = 9
            self.stop()
            
    
            
#Just pass disabled=True to discord.ui.button()

class tictactoeCog(commands.Cog, name="ttt command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @discord.command(name="tictactoe", usage="", description="wip", aliases=["ttt"])
    async def tictactoe(self, ctx:discord.ApplicationContext, member: discord.Member = None):
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
                    q.set_author(name=ctx.author.name, icon_url=ctx.author.avatar.url)
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

            dview = DuelView(member.id)

            await ctx.respond(embed=q, view=dview)
        
            await dview.wait()
            print(dview.value)
            #! Declined or time limit exced 
            if not dview.value or dview.value == None:
                q = discord.Embed(title=f"{players[1].name} declined duel",
                    description=f"",
                    color=discord.Color.red())
                
                await ctx.send(embed=q)
                return
    
            while gamming:
                for x in range(len(players)):
                    
                    good_answer = False
                    
                    

                    #? color for each player
                    
                    if x == 0:
                        q = discord.Embed(
                            title="Tic Tac Toe",
                            description="",
                            color=discord.Color.blue(),
                        )
                    else:
                        q = discord.Embed(
                            title="Tic Tac Toe",
                            description="",
                            color=discord.Color.green(),
                        )
                        
                    q.set_author(name=players[x].name)
                    
                    q.add_field(
                        name="Board: ",
                        value=f"**```{make_board(board)}```**",
                        inline=False,
                    )
                    
                    player1 = x == 0
                    
                    game_view = GameView(players[0].id,board,player1)
                    
                    
                    bsend = await ctx.respond(embed=q, view=game_view)
                    
                    await game_view.wait()

    
                    place = game_view.value

                    print(place)



                    j = int(place % 3)
                    i = int(place / 3)
                    
                    board[i][j] = igralci[x]
                    

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