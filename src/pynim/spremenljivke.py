import random
from random import randint

ZETONI = 0
POTEZA = 0
CLEN = 0


def spremeni_zetone_za(x, y):
    global ZETONI
    global POTEZA
    ZETONI += x
    POTEZA += y


def spremeni_clen():
    global CLEN
    CLEN = random.randint(0, 3)
