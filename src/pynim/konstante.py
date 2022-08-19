import igralci
import pygame
from pygame.display import get_desktop_sizes
import spremenljivke

pygame.init()

SCREEN_WIDTH = get_desktop_sizes()[0][0]
SCREEN_HEIGHT = get_desktop_sizes()[0][1]
FRAMERATE = 30
SPEED = 1
#BACKGROUND_COLOR = (30, 51, 191)
BACKGROUND_COLOR = (147, 136, 228)  # PAZI NA: 121: 'BACKGROUND_COLOR = hsv2rgb(tezt/360, 1, 1)' v igra.py
SPEED_BKG = 1  # 0-359
#BACKGROUND_COLOR = (0, 255, 0)

ZADNJI_IZGUBI = True
NA_POTEZI = 0
IZPISI = {}
TEZAVNOST = 10
POMAGALA = True
MAX_ZETONI = 2

IGRALEC = None


CUSTOM_EVENT = "custom_event"
CUSTOM_EVENT2 = "custom_event2"


def nastavi_vrednosti(nastavljeno):
    global TEZAVNOST, NA_POTEZI, ZADNJI_IZGUBI, SPEED, IGRALEC, POMAGALA, MAX_ZETONI
    nastavljeno[1] = int(nastavljeno[1])
    nastavljeno[3] = (10 - nastavljeno[3]) / 10 + 0.01
    TEZAVNOST, NA_POTEZI, ZADNJI_IZGUBI, SPEED, POMAGALA, MAX_ZETONI = tuple(nastavljeno)
    if ZADNJI_IZGUBI:
        IZPISI[NA_POTEZI] = "Zmagal si!"
        IZPISI[1 - NA_POTEZI] = "Zmagal je računalnik."
    else:
        IZPISI[NA_POTEZI] = "Zmagal je računalnik."
        IZPISI[1 - NA_POTEZI] = "Zmagal si!"
        TEZAVNOST = 10 - TEZAVNOST
    pameten_igralec = igralci.PametenIgralec(spremenljivke.ZETONI, MAX_ZETONI)
    neumen_igralec = igralci.NeumenIgralec(spremenljivke.ZETONI, MAX_ZETONI)
    IGRALEC = igralci.NastavljiviIgralec(spremenljivke.ZETONI, MAX_ZETONI, pameten_igralec.strategija,
                                         neumen_igralec.strategija, TEZAVNOST / 10)
    return TEZAVNOST, NA_POTEZI, ZADNJI_IZGUBI, SPEED, IGRALEC, IZPISI, POMAGALA, MAX_ZETONI
