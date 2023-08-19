import discord
from discord.ext import commands
from functions import *
from stockfish import Stockfish
import requests
import asyncio
import discord
from discord.ui import Button,View

import chess

base = "https://backscattering.de/web-boardimage/board.png"

sf = Stockfish(path=r"./stockfish/stockfish-windows-x86-64-avx2.exe")



color = "wikipedia"
coords = True
size = 500
stop_moves = ["stop","exit","resign"]


hand_emoji = "🖐️"
brain_emoji = "🧠"
   
def get_movable_piece_types(fen, color):
    board = chess.Board(fen)
    print("color",color)
    
    piece_types = {"P": "Pawn", "N": "Knight", "B": "Bishop", "R": "Rook", "Q": "Queen", "K": "King"}
    
    
    if color == "white":
        color_to_move = chess.WHITE 
    else: 
        color_to_move = chess.BLACK
    
    movable_piece_types = []
    
    for move in board.legal_moves:
        if board.color_at(move.from_square) == color_to_move:
            piece = board.piece_at(move.from_square)
            piece_type = piece.symbol().upper()
            if piece_type not in movable_piece_types:
                movable_piece_types.append(piece_type)
    
    return [piece_types[piece_type] for piece_type in movable_piece_types]

def get_movable(fen,color):
    movable = get_movable_piece_types(fen,color)
    print(movable)
    ret = []
    
    types = ["Pawn","Knight","Bishop","Rook","Queen","King"]
    for i in range(len(types)):
        tf = types[i] in movable
        ret.append(tf)
        
    return ret
    
'''
def get_piece_movability_array(fen, color):
    board = chess.Board(fen)
    movability_array = [False] * 6  # One boolean for each piece type (pawn, knight, bishop, rook, queen, king)
    
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece is not None and piece.color == chess.COLORS[color]:
            legal_moves = board.legal_moves
            for move in legal_moves:
                if move.from_square == square:
                    piece_type = piece.piece_type - 1  # Piece types are 1-based, so subtract 1 for indexing
                    movability_array[piece_type] = True
                    break
    
    return movability_array'''
    

class DuelView(discord.ui.View):
    def __init__(self,idd,):
        super().__init__()
        self.value = None
        self.id = int(idd)
        '''self.children[0].disabled = not is_on[0]
        self.children[1].disabled = not is_on[1]
        self.children[2].disabled = not is_on[2]
        self.children[3].disabled = not is_on[3]
        self.children[4].disabled = not is_on[4]
        self.children[5].disabled = not is_on[5]'''
        
    
    @discord.ui.button(label="Pawn | ♟", row=0, style=discord.ButtonStyle.primary,)
    async def button1(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = "p"
            self.stop()
            
    @discord.ui.button(label="Horsi | ♞", row=0, style=discord.ButtonStyle.primary,disabled=False,)
    async def button2(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = "n"
            self.stop()     
            
    @discord.ui.button(label="Bishop | ♝", row=0, style=discord.ButtonStyle.primary,)
    async def button3(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = "b"
            self.stop()
            
    @discord.ui.button(label="Rook | ♜", row=0, style=discord.ButtonStyle.primary,)
    async def button4(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = "r"
            self.stop()
    
    @discord.ui.button(label="Queen | ♛", row=1, style=discord.ButtonStyle.primary,)
    async def button5(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = "q"
            self.stop()
            
    @discord.ui.button(label="King | ♚", row=1, style=discord.ButtonStyle.primary,)
    async def button6(self, select: discord.ui.Select, interaction: discord.Interaction):
        if interaction.user.id == self.id:
            self.value = "k"
            self.stop()

class chesshandCog(commands.Cog, name="chesshand command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @discord.command(name="chesshand", usage=" @username", description="")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def chesshand(self, ctx:discord.ApplicationContext,white_brain: discord.Member = None,black_hand: discord.Member = None,black_brain: discord.Member = None):
        white_hand = ctx.author
        
        
        if white_brain == None or black_hand == None or black_brain == None:
            q = discord.Embed(title="Some or all users are missing.",color=discord.Color.red())
            q.add_field(name="Correct form",value="`/chesshand [white_brain:mention] [balck_hand:mention] [black_brain:mention]`")
            await ctx.respond(embed=q)
            return 
        


        q = discord.Embed(title=f"Chess Hand/Brain  {hand_emoji}/{brain_emoji}",color=discord.Color.blue(),)
        q.add_field(name=f"White:  {hand_emoji}/{brain_emoji}", value=f"**```{white_hand.name} / {white_brain.name}```**",inline=False,)
        q.add_field(name=f"Black: {hand_emoji}/{brain_emoji}", value=f"**```{black_hand.name} / {black_brain.name}```**", inline=False)

        await ctx.respond(embed=q)
        
        move = ""
        last_good_move = ""
        
        sf.set_position()
        board = chess.Board()
        
        while True:
            full_fen = sf.get_fen_position() # rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2
            fen, tomove, caste_rightrs, french_baguete, fiftymove_rule,moveN = full_fen.split(" ")
            
            if tomove == "w":
                white_move = "white"
                hand_obj = white_hand
                brain_obj = white_brain
            else:
                white_move = "black"
                hand_obj = black_hand
                brain_obj = black_brain
                
            
            while True:
                
                q = discord.Embed(title="Chess | Pick piece")
                urll = f"{base}?fen={fen}&color={color}&lastMove={last_good_move}&coordinates={coords}&size={size}&orientation={white_move}"
                q.set_image(url=urll)
                q.set_author(name=brain_obj.name, icon_url=brain_obj.avatar)
                q.add_field(name=f"**{white_hand.name}** / **{white_brain.name}** vs ",value=f"**{black_hand.name}** / **{black_brain.name}**")
                
                
                
                view = DuelView(brain_obj.id,)
                await ctx.send(embed=q,view=view)
                
                await view.wait()
                # p, n, b,r,q,k
                val = view.value
            
                if val == None:
                    q = discord.Embed(title="🚩🚩🚩 You have timed out 🚩🚩🚩",color=discord.Color.red())
                    await ctx.send(embed=q)
                    return
                
                table = {
                    "p":"Pawn | ♟",
                    "n":"Knight | ♞",
                    "b":"Bishop | ♝",
                    "r":"Rook | ♜",
                    "q":"Queen | ♛",
                    "k":"King | ♚",
                }
                
                q = discord.Embed(title=f"{brain_obj.name} chossen **{table[val]}**")
                q.add_field(name=f"{hand_obj.name} enter move",value=" ")
                q.set_author(name=hand_obj.name, icon_url=hand_obj.avatar)
                
                await ctx.respond(embed=q)
                
                
                try:
                    msg = await self.bot.wait_for('message', check=lambda x: x.author.id == hand_obj.id,timeout=40)
                except asyncio.TimeoutError:
                    q = discord.Embed(title="🚩🚩🚩 You have timed out 🚩🚩🚩",color=discord.Color.red())
                    await ctx.send(embed=q)
                    return
                        
                move = msg.content

                if move in stop_moves or "/" in move or "m!" in move or " " in move:
                    q = discord.Embed(title="You left the game.",color=discord.Color.red())
                    await ctx.send(embed=q)
                    return
                    

                try:
                    move = board.parse_san(move).uci()
                except Exception:
                    q = discord.Embed(title="Invalid move.",color=discord.Color.red())
                    q.set_footer(text="If you belive this is an error plese report at github issue, Thanks.")
                    await ctx.send(embed=q)
                    continue
                
                start_sq = move[0:2]
                print(f"{start_sq=}")
                
                piece = board.piece_at(chess.parse_square(start_sq))

                print(piece)
                
                if not sf.is_move_correct(move):
                    await ctx.send(f"{ctx.author.mention} {move} is not a valid move")
                else:
                    if str(piece).lower() == val:
                        break
                    
                    
                move = ""
                
            
            sf.make_moves_from_current_position([move])
            board.push_uci(move)
            
            last_good_move = move
                
            
                    
                
            
            
            
            if board.is_stalemate() or board.is_insufficient_material() or board.can_claim_threefold_repetition() or board.can_claim_fifty_moves() or board.can_claim_draw():
                
                r = "Draw"
                if board.can_claim_draw():
                    r = "Draw"
                elif board.is_insufficient_material():
                    r = "Insufficient material"
                elif board.can_claim_threefold_repetition():
                    r = "Threefold repetition"
                elif board.can_claim_fifty_moves():
                    r = "50 move rule"
                elif board.is_stalemate():
                    r = "Stalemate"
                    
                q = discord.Embed(title=r,color=discord.Color.gray())
                
                q.add_field(name=f"**{white_hand.name}** / **{white_brain.name}** vs ",value=f"**{black_hand.name}** / **{black_brain.name}**")
                
                await ctx.send(embed=q)
              
              
            # win lose detect  
            outcome = None
            try:    
                outcome = board.outcome().result()
            except AttributeError:
                pass
            
            if not outcome == None:
                if outcome == "1-0":
                    q = discord.Embed(title="White wins",color=discord.Color(0xFFFFFF))
                elif outcome == "0-1":    
                    q = discord.Embed(title="Black wins")
                elif outcome == "1/2-1/2":
                    q = discord.Embed(title="Draw",color=discord.Color.gray())
                    
                q.add_field(name=f"**{white_hand.name}** / **{white_brain.name}** vs ",value=f"**{black_hand.name}** / **{black_brain.name}**")
                await ctx.send(embed=q)
                
                return

def setup(bot: commands.Bot):
    bot.add_cog(chesshandCog(bot))