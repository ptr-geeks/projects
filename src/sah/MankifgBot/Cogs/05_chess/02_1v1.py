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
            

class chesCog(commands.Cog, name="ches command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(name="ches", usage=" @username", description="")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def ches(self, ctx,member: discord.Member = None):
        
        if member == None:
            q = discord.Embed(title="No user was supplied to duel",color=discord.Color.red())
            q.add_field(name="Correct form",value="`/ches [user:mention]`")
            await ctx.send(embed=q)
            return 
        


        q = discord.Embed(title="Chess Game",color=discord.Color.blue(),)
        q.add_field(name="White: ", value=f"**```{ctx.author.name}```**",inline=False,)
        q.add_field(name="Black: ", value=f"**```{member.name}```**", inline=False)

        dview = DuelView(member.id)

        await ctx.send(embed=q, view=dview)
    
        await dview.wait()
        #! Declined or time limit exced 
        if not dview.value or dview.value == None:
            q = discord.Embed(title=f"{member.name} declined duel",
                description=f"",
                color=discord.Color.red())
            
            await ctx.send(embed=q)
            return
        
        
        
        move = ""
        my_id = ctx.author.id
        your_id = member.id
        
        last_good_move = ""
        
        sf.set_position()
        board = chess.Board()
        
        while True:
            full_fen = sf.get_fen_position() # rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2
            fen, tomove, caste_rightrs, french_baguete, fiftymove_rule,moveN = full_fen.split(" ")
            
            if tomove == "w":
                white_move = "white"
                userObj = ctx.author
            else:
                white_move = "black"
                userObj = member

                
            q = discord.Embed(title="Chess Game")
            urll = f"{base}?fen={fen}&color={color}&lastMove={last_good_move}&coordinates={coords}&size={size}&orientation={white_move}"
            q.set_image(url=urll)
            q.set_author(name=userObj.name, icon_url=userObj.avatar)
            q.add_field(name=f"**{ctx.author.name}** vs ",value=f"**{member.name}**")

            await ctx.send(embed=q)
            
            try:
                msg = await self.bot.wait_for('message', check=lambda x: x.author.id == userObj.id,timeout=30)
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
        
            if sf.is_move_correct(move):
                sf.make_moves_from_current_position([move])
                board.push_uci(move)
                
                last_good_move = move
                
            else:
                await ctx.send(f"{ctx.author.mention} {move} is not a valid move")
                move = ""
            
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
                
                q.add_field(name=f"**{ctx.author.name}** vs ",value=f"**{member.name}**")
                
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
                    
                q.add_field(name=f"**{ctx.author.name}** vs ",value=f"**{member.name}**")
                await ctx.send(embed=q)
                
                return

def setup(bot: commands.Bot):
    bot.add_cog(chesCog(bot))