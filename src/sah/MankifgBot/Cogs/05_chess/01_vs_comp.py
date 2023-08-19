import discord
from discord.ext import commands
from functions import *
from stockfish import Stockfish
import requests
import asyncio

import chess

base = "https://backscattering.de/web-boardimage/board.png"

sf = Stockfish(path=r"./stockfish/stockfish-windows-x86-64-avx2.exe")



color = "wikipedia"
coords = True
size = 500
stop_moves = ["stop","exit","resign"]


sf_version = sf.get_stockfish_major_version()

class chessCog(commands.Cog, name="chess command"):
    def __init__(self, bot: commands.bot):
        self.bot = bot

    @commands.command(name="chess", usage=" @username", description="")
    @commands.cooldown(1, 2, commands.BucketType.member)
    async def chess(self, ctx,elo=1500):
    
        try:
            elo = int(elo)
        except ValueError:
            q = discord.Embed(title="Invalid `elo` parameter.",color=discord.Color.red())
            q.add_field(name="Correct form: ",value="`m!chess [elo:int=1500]`") 
            await ctx.send(embed=q)
            return
            
        if elo < 1:
            q = discord.Embed(title="Invalid `elo` parameter.",color=discord.Color.red())
            q.add_field(name="Correct form: ",value="`m!chess [elo:int=1500]`") 
            await ctx.send(embed=q)
            return
        
        
        move = ""
        my_id = ctx.author.id
        last_good_move = ""
        
        sf.set_position()
        board = chess.Board()
        
        sf.set_elo_rating(elo)
        
        
        while True:
            full_fen = sf.get_fen_position() # rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2
            fen, tomove, caste_rightrs, french_baguete, fiftymove_rule,moveN = full_fen.split(" ")
            
            if tomove == "w":
                q = discord.Embed(title="Chess Game")
                urll = f"{base}?fen={fen}&color={color}&lastMove={last_good_move}&coordinates={coords}&size={size}"
                q.set_image(url=urll)
                q.set_author(name=ctx.author.name, icon_url=ctx.author.avatar)
                q.add_field(name=f"{ctx.author.name} vs ",value=f"Stockfish  {sf_version}, elo: {elo}")

                await ctx.send(embed=q)
                try:
                    msg = await self.bot.wait_for('message', check=lambda x: x.author.id == my_id,timeout=30)
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
            else:
                move = sf.get_best_move()
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
                    
                    q.add_field(name=f"**{ctx.author.name}** vs ",value=f"**Stockfish**  {sf_version}, elo: {elo}")
                    
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
                    
                    
                q.add_field(name=f"**{ctx.author.name}** vs ",value=f"**Stockfish**  {sf_version}, elo: {elo}")
                await ctx.send(embed=q)
                
                return

def setup(bot: commands.Bot):
    bot.add_cog(chessCog(bot))