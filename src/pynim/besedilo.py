import pygame

import igralci
import spremenljivke

zmaguje = ['Ne boš me premagal', 'Tale bo težka', 'Jaz bi se na tvojem mestu predal', 'Kaj sem ti rekel?']
nekaj = ['Le kaj boš izbral...', 'Jaz bi si vzel malo časa za razmislek', 'Tvoj čas za razmišljanje je neomejen',
         'Pazljivo izberi']


def je_to_brezupno(t, p):
    if t == p:
        return zmaguje[spremenljivke.CLEN]
    else:
        return nekaj[spremenljivke.CLEN]


def namig_zadnji_izgubi(n, t, m):
    if n % (m + 1) == 1:
        return je_to_brezupno(t, 10)
    else:
        pameten_igralec = igralci.PametenIgralec(n, m)
        return pameten_igralec.poteza(n)


def namig_zadnji_zmaga(n, t, m):
    if n % 3 == 0:
        return je_to_brezupno(t, 0)
    else:
        neumen_igralec = igralci.NeumenIgralec(n, m)
        return neumen_igralec.poteza(n)


def namig(n, zadnji_izgubi, t, m):
    if zadnji_izgubi:
        return namig_zadnji_izgubi(n, t, m)
    else:
        return namig_zadnji_zmaga(n, t, m)


def create_font(t, c=(255, 255, 255), s=72, b=False, i=False):
    if not isinstance(t, str):
        t = str(t)
    font = pygame.font.SysFont("Arial", s, bold=b, italic=i)
    text = font.render(t, True, c)
    return text
