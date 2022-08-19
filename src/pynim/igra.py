# Import the pygame module
import random

import pygame
import time
import colorsys
import zaslon

# import Igralci
import besedilo
import spremenljivke
import test_entity
from barve import *
from besedilo import *
from nastavitve import nastavitve, save
from event_handler import EventHandler
from game_manager import GameManager
from konstante import *
from pygame.locals import *
from entity.image_path import get_image_path

pygame.init()
pygame.font.init()

screen = zaslon.naredi_zaslon(get_desktop_sizes()[0])
text = test_entity.Figura("", 72, "white", (30, 30), True)

pygame.display.set_caption("PyNim")
Icon = pygame.image.load(get_image_path('icon.png'))
pygame.display.set_icon(Icon)
priporocilo = 0
vzel = ['Jaz bi vzel ', 'Dobra izbira bi bila ', 'Vzemi ', 'Prosim, daj mi možnost za zmago in ne vzemi ']
a = nastavitve()
TEZAVNOST, NA_POTEZI, ZADNJI_IZGUBI, SPEED, IGRALEC, IZPISI, POMAGALA, MAX_ZETONI = a
CLEN = 0


def izprazni_skupino(skupina):
    for event in skupina:
        event.kill()
    obnovi_pygame(True)


def obnovi_pygame(gm):
    pygame.display.flip()
    pygame.display.update()
    if gm:
        game_manager.update()


def obnovi_zaslon():
    global BACKGROUND_COLOR, screen
    if spremenljivke.ZETONI > 0:
        if spremenljivke.ZETONI < len(game_manager.zetoni):
            obnovi_zetone()
        BACKGROUND_COLOR = hsv2rgb(barva / 360, 1, 1)
        screen.fill(BACKGROUND_COLOR)
        for entity in game_manager.all_sprites:
            screen.blit(entity.surf, entity.rect)


def obnovi_zetone():
    izprazni_skupino(game_manager.zetoni)
    izprazni_skupino(game_manager.stevila)
    obnovi_pygame(False)
    if running:
        game_manager.naredi_zetone(spremenljivke.ZETONI)
    time.sleep(0.1)


def obnovi_besedilo(besedilo):
    global text
    text.barva = kontrast(BACKGROUND_COLOR)
    text.besedilo = besedilo
    text.update()
    screen.blit(text.surf, text.rect)


def pripravi_besedilo(poteza, n=0):
    global priporocilo
    pripis = ""
    if poteza % 2 == NA_POTEZI:
        if POMAGALA:
            priporocilo = namig(spremenljivke.ZETONI, ZADNJI_IZGUBI, TEZAVNOST, MAX_ZETONI)
            if isinstance(priporocilo, int):
                pripis = vzel[spremenljivke.CLEN] + str(priporocilo)
            else:
                pripis = priporocilo


    else:
        pripis = "Računalnik vzame {0}".format(n)
    return "{0}. poteza     {1}".format(poteza + 1, pripis)


def izvedi_potezo():
    global CLEN
    if spremenljivke.POTEZA % 2 != NA_POTEZI % 2:  # check za računalnikovo potezo
        vzeto = IGRALEC.poteza(spremenljivke.ZETONI)
        obnovi_besedilo(pripravi_besedilo(spremenljivke.POTEZA, vzeto))
        spremenljivke.spremeni_zetone_za(0 - vzeto, 1)
        spremenljivke.spremeni_clen()
        return SPEED
    else:
        obnovi_besedilo(pripravi_besedilo(spremenljivke.POTEZA))
        for zeton in game_manager.zetoni:
            zeton.poteza(priporocilo)
        return 0


def konec_igre():
    for entity in game_manager.all_sprites:
        entity.kill()
    obnovi_pygame(True)
    Surface = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT))
    pravokotnik = pygame.draw.rect(Surface, BACKGROUND_COLOR, Surface.get_rect(), 0)
    screen.blit(Surface, pravokotnik)
    besedilo = create_font("Konec igre", s=200, c=kontrast(BACKGROUND_COLOR))
    screen.blit(besedilo, (200, 200))
    besedilo = create_font(IZPISI[spremenljivke.POTEZA % 2], s=100, c=kontrast(BACKGROUND_COLOR))
    screen.blit(besedilo, (300, 500))
    obnovi_pygame(False)
    time.sleep(0.9)
    return False


def je_treba_koncati():
    vrni = True
    for event in pygame.event.get():  # Ali je treba končati?
        if spremenljivke.ZETONI < 1:
            vrni = konec_igre()
        elif event.type == KEYDOWN:
            if event.key == K_ESCAPE:
                # IDEJA: Vprašaj: Si že obupal?
                vrni = False
        elif event.type == QUIT:
            vrni = False
        else:
            event_handler.handle_event(event)
    return vrni


game_manager = GameManager()
event_handler = EventHandler(game_manager)
game_manager.naredi_zetone(spremenljivke.ZETONI)

running = True
clock = pygame.time.Clock()
barva = 0

while running:
    running = je_treba_koncati()
    if running:
        pressed_keys = pygame.key.get_pressed()  # updata tipke
        obnovi_zaslon()
        if spremenljivke.ZETONI > 0:
            premor = izvedi_potezo()
            obnovi_pygame(True)  # obnovi zaslon
            time.sleep(premor)

        clock.tick(FRAMERATE)
        barva = barva % 360 + SPEED_BKG
