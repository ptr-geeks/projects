import discord
from discord.ext import commands
import random


def nice_board(board,emojis):
    ret = ""
    l = len(board[0])
    for x in range(len(board)):
        
        num = str(9 - int(x) % 10)
        if num == "0":
            num = "z"
        ret += num
        for y in range(l):
            ret = ret + board[x][y]
        ret = ret+"\n"

    for i in range(len(board[0])):
        num = str(int(i) % 10)
        if num == "0":
            num = "z"
        ret = ret + num
    
    
    
    nret = ""
    for i in range(len(ret)):
        current = ret[i]
        if str(current) in list(map(str,list(range(1,9)))):
            #nret += emojis[f"{current}mine"]
            nret += emojis[int(current)]
        
        elif str(current) == ".":
            nret += "⬛"
        elif str(current) == "0":
            nret += "◻️"
        elif str(current) == "z":
            nret += "0️⃣"
        elif str(current) == "9":
            nret += "9️⃣"
        else:
            nret += current

    
    return nret

def generate_board(w,h,):
    board = []
    for _ in range(h):
        board.append(["."]*w)
    
    return board

def swap(board,x,y,replace):
    board[x][y] = replace
    return board

def put_mines(board, n):
    for _ in range(n):
        x = random.randint(0,len(board[0])-1)
        y = random.randint(0,len(board)-1)
        
        while True:
            x = random.randint(0,len(board[0])-1) 
            y = random.randint(0,len(board)-1) 

            if not board[y][x] == "*":
                break
        
        board = swap(board,x,y,"*")
        
    return board

def single_one(board,x,y):
    if board[x][y] == "*":
        return "*"

    pari = [(1,1),(1,0),(1,-1),(0,1),(0,-1),(-1,1),(-1,0),(-1,-1)]

    l = []

    for i in range(len(pari)):
        new_x = x + pari[i][0]
        new_y = y + pari[i][1]
        if new_x < 0 or new_y < 0: 
            continue
        try:
            l.append(board[new_x][new_y])
        except IndexError:
            pass
    
    return str(l.count("*"))

def putnumbers(board):
    for x in range(len(board)):
        for y in range(len(board[0])):
            if board[x][y] == "\n":
                continue
            replace = single_one(board,x,y)
            
            board = swap(board,x,y,replace)

    return board

def check_user_input(player_board,master_board,px,py):
    if master_board[px][py] == "*":
        return [],False
    
    if int(master_board[px][py]) == 0:
        q = []
        player_board,q = zero_spread(player_board,px,py,master_board,q)
        return player_board,True

    else:
        player_board = swap(player_board,px,py,master_board[px][py])
        return player_board, True


def check_around(x,y,board,master_board):
    if int(master_board[x][y]) == 0:
        board = zero_spread(board,x,y,master_board)
        return board
    
    else:
        board = swap(board,x,y,master_board[x][y])
        return board


def zero_spread(board,x,y,master_board,q):
    q.append((x,y))
    board = swap(board,x,y,master_board[x][y])

    pari = [(1,1),(1,0),(1,-1),(0,1),(0,-1),(-1,1),(-1,0),(-1,-1)]

    
    if int(master_board[x][y]) == 0:

        for i in range(len(pari)):
            new_x = x + pari[i][0]
            new_y = y + pari[i][1]
            if new_x < 0 or new_y < 0: 
                continue
            try:
                board = swap(board,new_x,new_y,master_board[new_x][new_y])
                if (new_x,new_y) not in q:

                    board,q = zero_spread(board,new_x,new_y,master_board,q)

            except IndexError:
                pass

    else:
        board = swap(board,x,y,master_board[x][y])
    
    return board,q


class mineswpCog(commands.Cog, name="mineswp command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(name="mineswp", usage="", description="desc",aliases=["mnswp","minesweeper"])
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def mineswp(self, ctx):

        # if there wasn't message limit
        #emojis = {e.name:str(e) for e in ctx.bot.emojis}
        emojis = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","0️⃣",]


        h,w,mines = 10,10,5

        #! 
        mines = 5


        b = generate_board(h,w)
        b = put_mines(b,mines)
        m_board = putnumbers(b)

        hidden_board = generate_board(h,w)

        while True:
            q = discord.Embed(title="Minesweeper", description="", colour=0x2f3136)
            q.add_field(name="Board",value=f"{nice_board(hidden_board, emojis)}")
            q.add_field(name=f"Enter x and y: ", value=f"Board: {h}x{w}, with {mines} mines", inline=False)
            
            
            q.set_footer(text=f"{ctx.author.name}'s board | type stop to cancel")

            await ctx.send(embed=q)


            msg = await self.bot.wait_for('message', check=lambda x: x.author.id == ctx.author.id)
            msg = msg.content.lower()


            if msg in ["stop","end","kill","exit"]:
                await ctx.send("Stoped")
                break

            try:
                player_x,player_y = msg.split(" ")
            except ValueError:
                await ctx.send("Bad input")
                break

            player_x, player_y = int(player_x), int(player_y)

            hidden_board, good = check_user_input(hidden_board,m_board,player_x,player_y)

            if not good:
                await ctx.send("You died")
                break
                



        await ctx.send(m_board)



def setup(bot: commands.Bot):
    bot.add_cog(mineswpCog(bot))
