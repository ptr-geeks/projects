# The School Runner 1.4.0

# UVOZ KNJIŽNIC
import random
import sys
import time

import pygame
import figure, skupine_figur, svet
from pygame.locals import *
from pygame import mixer
from mutagen.mp3 import MP3


# ZAČETNE SPREMENLJIVKE
import kupljeno
import spremenljivke
import tocke

razlicica = "1.4.0"

pygame.init()  # Zaženemo Pygame
mixer.init()  # Zaženemo mešalnik zvoka

mixer.music.load('zvoki/videogame.mp3')
glasba = MP3('zvoki/videogame.mp3')
dolzina_glasbe = glasba.info.length - 0.1
glasba_v_ozadju = mixer.Channel(0)
glasba_v_ozadju.play(mixer.Sound('zvoki/videogame.mp3'))

zaslon = pygame.display.set_mode((0, 0), pygame.FULLSCREEN)
sirina_zaslona, visina_zaslona = zaslon.get_size()
ura = pygame.time.Clock()
velikost = 100
izvajanje = True
barva = "#ffbb00"
x = 0
y = 0
okolica = [None] * 9
videzi = [None] * 9

premik_desno = True
premik_levo = True
premik_gor = True
premik_dol = True

premik_desno_gor = True
premik_levo_gor = True
premik_desno_dol = True
premik_levo_dol = True

funkcije = []
denar_pred_zacetkom = 0
zacetek_igranja = time.time()
zacetek_glasbe = time.time()
cas_igranja = 30
spremenljivke.nastavi("podatki", "")

'''ozadje = pygame.image.load().convert()
ozadje = pygame.transform.scale(ozadje, zaslon.get_size())'''


def popravi(stolpec, vrstica):
    # print(stolpec, vrstica)
    # print(svet.sirina, svet.visina)
    stolpec_ok = False
    vrstica_ok = False
    while not (stolpec_ok and vrstica_ok):
        if stolpec > svet.sirina:
            stolpec -= svet.sirina
        elif stolpec < 0:
            stolpec += svet.sirina
        else:
            stolpec_ok = True
        if vrstica > svet.visina:
            vrstica -= svet.visina
        elif vrstica < 0:
            vrstica += svet.visina
        else:
            vrstica_ok = True
    return int(stolpec), int(vrstica)


def moznost_premika():
    global premik_desno, premik_levo, premik_gor, premik_dol
    global premik_desno_gor, premik_desno_dol, premik_levo_gor, premik_levo_dol
    time.sleep(0.01)
    r = 0.2
    if 0 <= x % 1 <= r:
        if 0 <= y % 1 <= r:
            premik_desno = "Zid" not in videzi[5]
            premik_levo = "Zid" not in videzi[3]
            premik_gor = "Zid" not in videzi[1]
            premik_dol = "Zid" not in videzi[7]

            premik_desno_gor = "Zid" not in videzi[2]
            premik_levo_gor = "Zid" not in videzi[0]
            premik_desno_dol = "Zid" not in videzi[8]
            premik_levo_dol = "Zid" not in videzi[6]
        else:
            premik_desno = "Zid" not in videzi[2] and "Zid" not in videzi[5]
            premik_levo = "Zid" not in videzi[0] and "Zid" not in videzi[3]
            premik_gor = True
            premik_dol = True

            premik_desno_gor = "Zid" not in videzi[2]
            premik_levo_gor = "Zid" not in videzi[0]
            premik_desno_dol = "Zid" not in videzi[5]
            premik_levo_dol = "Zid" not in videzi[3]
    else:
        if 0 <= y % 1 <= r:
            premik_desno = True
            premik_levo = True
            premik_gor = "Zid" not in videzi[1] and "Zid" not in videzi[2]
            premik_dol = "Zid" not in videzi[7] and "Zid" not in videzi[8]

            premik_desno_gor = "Zid" not in videzi[2]
            premik_levo_gor = "Zid" not in videzi[1]
            premik_desno_dol = "Zid" not in videzi[8]
            premik_levo_dol = "Zid" not in videzi[7]
        else:
            premik_desno = True
            premik_levo = True
            premik_gor = True
            premik_dol = True

            premik_desno_gor = True
            premik_levo_gor = True
            premik_desno_dol = True
            premik_levo_dol = True


def preveri_dogodke():
    global x, y, io

    rezultat = True
    for dogodek in pygame.event.get():
        if dogodek.type == pygame.QUIT:
            rezultat = False
        elif dogodek.type == KEYDOWN:
            if dogodek.key == K_ESCAPE:
                rezultat = False
        elif dogodek.type == MOUSEBUTTONDOWN:
            kliknjene_figure = [figura for figura in skupine_figur.vse_figure if figura.rect.collidepoint(dogodek.pos)]
            for figura in kliknjene_figure:
                figura.kliknjen(x, y)

    return rezultat


def prikazi_figure():
    for figura in skupine_figur.vse_figure:
        zaslon.blit(figura.surf, figura.rect)


def prikazi_figure_po_plasteh():
    for figura in skupine_figur.ozadje:
        zaslon.blit(figura.surf, figura.rect)
        # print("ozadje")

    for figura in skupine_figur.ospredje:
        zaslon.blit(figura.surf, figura.rect)
        # print("ospredje")


def posodobi_svet(x_d=None, y_d=None):
    global x, y, okolica

    for a in skupine_figur.ospredje:
        a.update()

    vrnjeno = []
    for kvadrat in skupine_figur.okolica:
        vrnjeno.append(kvadrat.videz())
    for a in vrnjeno:
        # print(a, videzi)
        videzi[a[1]] = a[0]

    moznost_premika()
    pritisnjeno = pygame.key.get_pressed()

    desno = pritisnjeno[K_RIGHT] and premik_desno
    levo = pritisnjeno[K_LEFT] and premik_levo
    gor = pritisnjeno[K_UP] and premik_gor
    dol = pritisnjeno[K_DOWN] and premik_dol

    if desno:
        if not levo:
            x += spremenljivke.spremenljivke["hitrost"]
        if gor and premik_desno_gor:
            y += spremenljivke.spremenljivke["hitrost"]
        elif dol and premik_desno_dol:
            y -= spremenljivke.spremenljivke["hitrost"]
    elif levo:
        x -= spremenljivke.spremenljivke["hitrost"]
        if gor and premik_levo_gor:
            y += spremenljivke.spremenljivke["hitrost"]
        elif dol and premik_levo_dol:
            y -= spremenljivke.spremenljivke["hitrost"]
    else:
        if gor:
            y += spremenljivke.spremenljivke["hitrost"]
        elif dol:
            y -= spremenljivke.spremenljivke["hitrost"]

    '''
    if pritisnjeno[K_RIGHT] and premik_desno:
        x += spremenljivke.spremenljivke["hitrost"]
    if pritisnjeno[K_LEFT] and premik_levo:
        x -= spremenljivke.spremenljivke["hitrost"]
    if pritisnjeno[K_UP] and premik_gor:
        y += spremenljivke.spremenljivke["hitrost"]
    if pritisnjeno[K_DOWN] and premik_dol:
        y -= spremenljivke.spremenljivke["hitrost"]
    '''

    for kvadrat in skupine_figur.svet:
        kvadrat.update(x, y)


def posodobi_stevce():
    cas = cas_igranja - round(time.time() - zacetek_igranja)
    spremenljivke.nastavi("čas", cas)
    if cas == 0:
        spremenljivke.nastavi("stanje", "konec")
    else:
        podatki = {"Točke": tocke.denar[spremenljivke.spremenljivke['razred']], "Življenja": tocke.zivljenja, "Čas": cas}
        for stevec in skupine_figur.stevci:
            stevec.update(podatki[stevec.ime])


def dodatne_tocke():
    if spremenljivke.spremenljivke["povečava"] == "*1":
        return ""
    elif "+" in spremenljivke.spremenljivke["povečava"]:
        return ""


def pososdobi_figure():
    for figura in skupine_figur.vse_figure:
        if figura in skupine_figur.spremenljivo_besedilo:
            if figura.besedilo.count("Točke:"):
                figura.update(f"Točke: {tocke.denar[spremenljivke.spremenljivke['razred']]}")
            elif figura.besedilo.count("mesto po točkah"):
                mesto = sorted(tocke.denar, key=lambda k: tocke.denar[k], reverse=True).index(
                    spremenljivke.spremenljivke['razred']) + 1
                figura.update(f"{mesto}. mesto po točkah.")
            else:
                figura.update(spremenljivke.spremenljivke["podatki"])
        else:
            try:
                figura.update()
            except TypeError:
                try:
                    figura.update(figura.besedilo)
                except AttributeError:
                    x, y = pygame.mouse.get_pos()
                    figura.update(x, y)


def sestavi_svet():
    global okolica
    c_x = sirina_zaslona // velikost // 2
    c_y = visina_zaslona // velikost // 2
    c_x, c_y = popravi(c_x, c_y)
    svet.popravi(c_x, c_y, "Tla")
    okolica = [(c_x - 1, c_y - 1),
               (c_x, c_y - 1),
               (c_x + 1, c_y - 1),

               (c_x - 1, c_y),
               (c_x, c_y),
               (c_x + 1, c_y),

               (c_x - 1, c_y + 1),
               (c_x, c_y + 1),
               (c_x + 1, c_y + 1)]
    svet.se_dotika(okolica)

    for x in range(-1, sirina_zaslona // velikost + 2):
        for y in range(-1, visina_zaslona // velikost + 2):
            kvadrat = figure.Kvadrat(x, y, velikost, velikost)
            skupine_figur.svet.add(kvadrat)
            skupine_figur.vse_figure.add(kvadrat)


def slo_tocke(tocke):
    tocke = str(tocke).replace("-", "")
    if ("0" + tocke).endswith("01"):
        return "točko"
    elif ("0" + tocke).endswith("02"):
        return "točki"
    elif ("0" + tocke).endswith("03") or ("0" + str(tocke)).endswith("04"):
        return "točke"
    else:
        return "točk"


def naredi_figuro(figura, parametri, skupine=None, font=None):
    if skupine is None:
        skupine = ["vse_figure"]
    f = eval(f"figure.{figura}({parametri})")
    for skupina in skupine:
        eval(f"skupine_figur.{skupina}.add(f)")


def zacetek():
    global funkcije
    funkcije = [prikazi_figure, pososdobi_figure]
    v = sirina_zaslona // 5
    y1 = visina_zaslona // 1.5 - v // 5
    y2 = visina_zaslona // 1.5 + v // 5

    naredi_figuro("Pravokotnik", f'(0, {y1} + 5), (sirina_zaslona, {y2} + 5), "#000000"')  # Senca
    naredi_figuro("Pravokotnik", f'(0, {y1}), (sirina_zaslona, {y2}), (200, 10, 0), (100, 5, 0)')  # Pravokotnik
    naredi_figuro("Gumb", f'sirina_zaslona // 2, visina_zaslona // 1.5, {v}, "začni", [("stanje", "vpis")]')  # Začni
    naredi_figuro("Slika", f'sirina_zaslona // 2, 0, sirina_zaslona // 2, "Naslov", '
                           f'((sirina_zaslona // 2, visina_zaslona // 4), 1)')  # The School Runner
    naredi_figuro("Besedilo", f'f"Različica: {razlicica}", font, (sirina_zaslona // 2, visina_zaslona // 2), '
                              f'"#000000", ("", 5, 2)', ["vse_figure"], pygame.font.SysFont("Courier New", 30))  # Verzija


def vpis():
    global funkcije, zacetek_igranja
    funkcije = [prikazi_figure_po_plasteh, pososdobi_figure]
    paralelki = ["A", "B"]
    v = sirina_zaslona // 15
    zamik_x = v * 1.5
    zamik_y = v * 0.8
    naredi_figuro("Besedilo", f'"Izberi razred:", font, (5, visina_zaslona * 0.2 + 5), (0, 0, 0), ((sirina_zaslona // 2'
                              f' + 5, visina_zaslona * 0.2 + 5), 1, 0)', ["vse_figure", "ozadje"], pygame.font.SysFont("Impact", 200))  # Senca
    naredi_figuro("Besedilo", f'"Izberi razred:", font, (0, visina_zaslona * 0.2), (100, 10, 0), ((sirina_zaslona // 2'
                              f', visina_zaslona * 0.2), 1, 0)', ["vse_figure", "ozadje"], pygame.font.SysFont("Impact", 200))  # Izberi razred
    for r in range(1, 10):
        for paralelka in range(2):
            ime = f"{r}.{paralelki[paralelka]}"
            naredi_figuro("Gumb", f'{r}*{zamik_x}, visina_zaslona//2+{paralelka}*{zamik_y}, {v}, "Gumb", [("stanje", '
                                  f'"razred"), ("razred", "{ime}")], ("{ime}", font)', ["vse_figure", "ozadje"], pygame.font.SysFont("Bold", 50))
    naredi_figuro("Gumb", f'sirina_zaslona // 2, visina_zaslona * 0.9, 300, "Gumb", [("stanje", "rezultati")], '
                          f'("rezultati", font)', ["vse_figure", "ozadje"], pygame.font.SysFont("Bold", 50))
    zacetek_igranja = time.time() + 1


def razred():
    global funkcije
    funkcije = [prikazi_figure_po_plasteh, pososdobi_figure]
    if "izbran" not in list(spremenljivke.spremenljivke.keys()):
        spremenljivke.nastavi("izbran", "Tohman")
        spremenljivke.nastavi("hitrost", 0.1)
        spremenljivke.nastavi("povečava", "*1")
    naredi_figuro("Pravokotnik", '(0, 0), (sirina_zaslona, 500), (255, 10, 0), (100, 10, 0)', ["vse_figure", "ozadje"])
    naredi_figuro("Besedilo", '"Razred", font, (sirina_zaslona // 2, 100), "#ffbb00", ("", 8, 0)'
                              '', ["vse_figure", "ozadje"], pygame.font.SysFont("Courier New", 150))
    naredi_figuro("Besedilo", 'spremenljivke.spremenljivke["razred"], font, (sirina_zaslona // 2,  - 200), "#ffbb00", ('
                              '(sirina_zaslona // 2, 300), 0.1, 1), [("stanje", "trgovina")]', ["vse_figure", "ospredje"], pygame.font.SysFont("Impact", 300))


def trgovina():
    global funkcije
    funkcije = [prikazi_figure_po_plasteh, pososdobi_figure]
    spremenljivke.nastavi(("zamik", -1))
    spremenljivke.nastavi(("igralci", list(a.split(", ") for a in list(open("slike/Figure/Cenik.txt", "r").read().split("\n")))))
    spremenljivke.nastavi("kupljeno", kupljeno.seznam())
    naredi_figuro("Pravokotnik", '(0, 0), (sirina_zaslona, 500), (255, 10, 0), (100, 10, 0)', ["vse_figure", "ozadje"])
    naredi_figuro("Besedilo", '"Razred", font, (sirina_zaslona // 2, 100), "#ffbb00", ((sirina_zaslona * 0.2, 100), 0.1'
                              ', 1)', ["vse_figure", "ospredje"], pygame.font.SysFont("Courier New", 150))
    naredi_figuro("Besedilo", 'spremenljivke.spremenljivke["razred"], font, (sirina_zaslona // 2, 300), "#ffbb00", (('
                              'sirina_zaslona * 0.2, 300), 0.1, 1)', ["vse_figure", "ospredje"], pygame.font.SysFont("Impact", 300))
    t = tocke.denar[spremenljivke.spremenljivke['razred']]
    naredi_figuro("Besedilo", f'"Točke: {t}", font, (sirina_zaslona*0.6, 100), "#ffbb00", ("", 8, 2)'
                              f'', ["vse_figure", "ozadje", "spremenljivo_besedilo"], pygame.font.SysFont("Courier New", 100))
    mesto = sorted(tocke.denar, key=lambda k: tocke.denar[k], reverse=True).index(spremenljivke.spremenljivke['razred']) + 1
    naredi_figuro("Besedilo", f'"{mesto}. mesto po točkah.", font, (sirina_zaslona * 0.6, 200), "#ffbb00", ("", 8, 2'
                              f')', ["vse_figure", "ozadje", "spremenljivo_besedilo"], pygame.font.SysFont("Courier New", 50))
    naredi_figuro("Gumb", 'sirina_zaslona * 0.1, visina_zaslona * 0.9, 150, "Gumb", [("stanje", "vpis")], ("Nazaj", '
                          'font)', ["vse_figure", "ozadje"], pygame.font.SysFont("arial", 10))
    naredi_figuro("Gumb", 'sirina_zaslona * 0.9, visina_zaslona * 0.9, 150, "Začni", [("stanje", "igra")'
                          ']', ["vse_figure", "ozadje"])
    for a in range(8):
        naredi_figuro("Izbor", f'{sirina_zaslona//16 + (sirina_zaslona//8 * a)}, visina_zaslona*0.6, '
                               f'sirina_zaslona//8, {a}', ["vse_figure", "ozadje"])

    naredi_figuro("Pravokotnik", f'(0, 500), '
                                 f'({sirina_zaslona // 8}, 600 + {sirina_zaslona // 8}), '
                                 f'(255, 187, 0)', ["vse_figure", "ospredje"])
    naredi_figuro("Pravokotnik", f'({sirina_zaslona * 0.875}, 500), '
                                 f'({sirina_zaslona}, 600 + {sirina_zaslona // 8}), '
                                 f'(255, 187, 0)', ["vse_figure", "ospredje"])
    naredi_figuro("Gumb", f'{sirina_zaslona//16}, visina_zaslona * 0.6, 100, '
                          f'"Levo", [("zamik", "-=1")]', ["vse_figure", "ospredje"])
    naredi_figuro("Gumb", f'{sirina_zaslona - sirina_zaslona//16}, visina_zaslona * 0.6, 100, '
                          f'"Desno", [("zamik", "+=1")]', ["vse_figure", "ospredje"])
    naredi_figuro("Besedilo", "'', font, (sirina_zaslona//2, visina_zaslona*0.8), '#000000'",
                  ["vse_figure", "ozadje", "spremenljivo_besedilo"], pygame.font.SysFont("Courier New", 50))


def igranje():
    global funkcije, zacetek_igranja, denar_pred_zacetkom
    funkcije = [prikazi_figure, posodobi_svet, posodobi_stevce]
    zacetek_igranja = time.time()
    denar_pred_zacetkom = tocke.denar[spremenljivke.spremenljivke['razred']]
    svet.posodobi_skitelse()
    sestavi_svet()
    cas = cas_igranja - round(time.time() - zacetek_igranja)
    spremenljivke.nastavi("čas", cas)
    tocke.spremeni(3-tocke.zivljenja, s="življenja")

    naredi_figuro("Igralec", f"sirina_zaslona // 2 - 20, visina_zaslona // 2 + 20, velikost, "
                             f"'{spremenljivke.spremenljivke['izbran']}'", ["vse_figure", "ospredje"])
    naredi_figuro("Pravokotnik", "(0, visina_zaslona - 100), (sirina_zaslona, visina_zaslona), (100, 100, 100), (0, 0,"
                                 " 0)", ["vse_figure"])

    stevci = ["Točke", "Življenja", "Čas"]
    for a in range(3):
        naredi_figuro("Stevec", f'{a}*(sirina_zaslona//3), visina_zaslona-100, 100, "{stevci[a]}", pygame.font.SysFont'
                                f'("Bold", 50), (255, 255, 255)', ["vse_figure", "stevci"])


def konec():
    global funkcije
    funkcije = [prikazi_figure_po_plasteh, pososdobi_figure]
    font = pygame.font.SysFont("Impact", 200)
    v = font.get_linesize() * 1.1
    naredi_figuro("Besedilo", f'"Konec", font, (sirina_zaslona, visina_zaslona * 0.2), (100, 10, 0), ((sirina_zaslona '
                              f'// 2 - {v}, visina_zaslona * 0.2), 1, 0)', ["vse_figure", "ospredje"], font)
    naredi_figuro("Besedilo", f'"Konec", font, (sirina_zaslona + 5, visina_zaslona * 0.2 + 5), (0, 0, 0), ((sirina_za'
                              f'slona // 2 - {v} + 5, visina_zaslona * 0.2 + 5), 1, 0)', ["vse_figure", "ozadje"], font)
    naredi_figuro("Besedilo", f'"igre", font, (0, visina_zaslona * 0.2), (100, 10, 0), ((sirina_zaslona // 2 + {v}, '
                              f'visina_zaslona * 0.2), 1, 0)', ["vse_figure", "ospredje"], font)
    naredi_figuro("Besedilo", f'"igre", font, (0 + 5, visina_zaslona * 0.2 + 5), (0, 0, 0), ((sirina_zaslona // 2 + '
                              f'{v} + 5, visina_zaslona * 0.2 + 5), 1, 0)', ["vse_figure", "ozadje"], font)
    r = spremenljivke.spremenljivke['razred']
    d = tocke.denar[spremenljivke.spremenljivke['razred']]
    a = d - denar_pred_zacetkom
    font = pygame.font.SysFont("Courier New", 50)
    if spremenljivke.spremenljivke["povečava"] == "*1":
        naredi_figuro("Besedilo", f'"{r} je to igro pridobil {a} {slo_tocke(a)}.", font, (sirina_zaslona // 2, visina_za'
                                  f'slona // 2), (0, 0, 0), ("natipkaj", 5, 2)', ["vse_figure", "ospredje"], font)
    else:
        p = spremenljivke.spremenljivke["povečava"]
        naredi_figuro("Besedilo", f'"{r} je to igro pridobil {a}{p} = {eval(f"{a}{p}")} {slo_tocke(eval(f"{a}{p}"))}."'
                                  f', font, (sirina_zaslona // 2, visina_zaslona // 2), (0, 0, 0), ("natipkaj", 5, '
                                  f'2)', ["vse_figure", "ospredje"], font)
        tocke.spremeni(eval(f"{a}{p}") - a)
        d = tocke.denar[spremenljivke.spremenljivke['razred']]
    naredi_figuro("Besedilo", f'"Skupne točke: {d}", font, (sirina_zaslona // 2, visina_zaslona * 0.6), (0, 0, 0), '
                              f'("natipkaj", 5, 5)', ["vse_figure", "ospredje"], font)
    mesto = sorted(tocke.denar, key=lambda k: tocke.denar[k], reverse=True).index(spremenljivke.spremenljivke['razred']) + 1
    naredi_figuro("Besedilo", f'"{mesto}. mesto po točkah.", font, (sirina_zaslona // 2, visina_zaslona * 0.7), (0, 0,'
                              f' 0), ("natipkaj", 5, 7)', ["vse_figure", "ospredje"], font)
    naredi_figuro("Gumb", 'sirina_zaslona * 0.1, visina_zaslona * 0.9, 150, "Gumb", [("stanje", "razred")], ("Nazaj", '
                          'font)', ["vse_figure", "ozadje"], pygame.font.SysFont("arial", 10))


def rezultati():
    global funkcije
    funkcije = [prikazi_figure_po_plasteh, pososdobi_figure]

    naredi_figuro("Pravokotnik", '(sirina_zaslona * 0.5, 0), (sirina_zaslona, 500), (255, 10, 0), (100, 10, '
                                 '0)', ["vse_figure", "ozadje"])
    naredi_figuro("Besedilo", '"REZULTATI.", font, (sirina_zaslona*0.55, -200), (255, 187, 0), ((sirina_zaslona*0.55, '
                              '100), 0.1, 0), tip_polozaja="topleft"', ["vse_figure", "ospredje"], pygame.font.SysFont("Impact", 200))

    font = pygame.font.SysFont("Impact", 50)

    lestvica = sorted(tocke.denar, key=lambda k: tocke.denar[k], reverse=True)
    podatki = [f"{a + 1}. {lestvica[a]} ({tocke.denar[lestvica[a]]})" for a in range(len(lestvica))]
    for a in range(len(podatki)):
        b = podatki[a]
        naredi_figuro("Besedilo", f'"{b}", font, (0, visina_zaslona+100), "#000000", ((sirina_zaslona * 0.1, '
                                  f'{a}*50+visina_zaslona * 0.1), 1, ({len(podatki) - a}) / 10), '
                                  f'tip_polozaja="topleft"', ["vse_figure", "ospredje"], font)
    naredi_figuro("Gumb", 'sirina_zaslona * 0.9, visina_zaslona * 0.9, 150, "Gumb", [("stanje", "vpis")], ("Nazaj", '
                          'font)', ["vse_figure", "ozadje"], pygame.font.SysFont("arial", 10))


def izbrisi_figure():
    if len(skupine_figur.vse_figure):
        for figura in skupine_figur.vse_figure:
            figura.kill()


def ustvari_figure(postavitev="začetek"):
    izbrisi_figure()
    if postavitev == "začetek":
        zacetek()
    elif postavitev == "vpis":
        vpis()
    elif postavitev == "razred":
        razred()
    elif postavitev == "trgovina":
        trgovina()
    elif postavitev == "igra":
        igranje()
    elif postavitev == "konec":
        konec()
    elif postavitev == "rezultati":
        rezultati()


ustvari_figure()

n = 0
stanje = "začetek"
spremenljivke.nastavi("stanje", stanje)

# Igralna zanka
while izvajanje:
    if stanje != spremenljivke.spremenljivke["stanje"]:
        # print(stanje, spremenljivke.spremenljivke["stanje"])
        stanje = spremenljivke.spremenljivke["stanje"]
        ustvari_figure(stanje)

    izvajanje = preveri_dogodke()
    zaslon.fill(barva)

    for funkcija in funkcije:
        funkcija()

    if round(time.time() - zacetek_glasbe, 1) == round(dolzina_glasbe, 1):
        zacetek_glasbe = time.time()
        glasba_v_ozadju.play(mixer.Sound('zvoki/videogame.mp3'))

    pygame.display.flip()
    pygame.display.update()
    ura.tick(100)

# shrani_podatke()
pygame.quit()
