import copy
import sys
import time

import pygame
from pygame import mixer
import skupine_figur, svet, tocke, prihodi
import random
import math

import spremenljivke
mixer.init()
zvok = mixer.Channel(1)


def fill_gradient(surface, color, gradient, rect=None, vertical=True, forward=True):
    """fill a surface with a gradient pattern
    Parameters:
    color -> starting color
    gradient -> final color
    rect -> area to fill; default is surface's rect
    vertical -> True=vertical; False=horizontal
    forward -> True=forward; False=reverse

    Pygame recipe: http://www.pygame.org/wiki/GradientCode
    """
    if rect is None: rect = surface.get_rect()
    x1, x2 = rect.left, rect.right
    y1, y2 = rect.top, rect.bottom
    if vertical:
        h = y2 - y1
    else:
        h = x2 - x1
    if forward:
        a, b = color, gradient
    else:
        b, a = color, gradient
    rate = (
        float(b[0] - a[0]) / h,
        float(b[1] - a[1]) / h,
        float(b[2] - a[2]) / h
    )
    fn_line = pygame.draw.line
    if vertical:
        for line in range(y1, y2):
            color = (
                min(max(a[0] + (rate[0] * (line - y1)), 0), 255),
                min(max(a[1] + (rate[1] * (line - y1)), 0), 255),
                min(max(a[2] + (rate[2] * (line - y1)), 0), 255)
            )
            fn_line(surface, color, (x1, line), (x2, line))
    else:
        for col in range(x1, x2):
            color = (
                min(max(a[0] + (rate[0] * (col - x1)), 0), 255),
                min(max(a[1] + (rate[1] * (col - x1)), 0), 255),
                min(max(a[2] + (rate[2] * (col - x1)), 0), 255)
            )
            fn_line(surface, color, (col, y1), (col, y2))


class Figura(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()

    def razdalja(self, a, b):
        return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

    def kliknjen(self, x, y):
        pass


class Besedilo(Figura):
    def __init__(self, besedilo, pisava, polozaj, barva, prihod=None, dogodek=None, tip_polozaja="center"):
        super().__init__()

        self.besedilo = str(besedilo)
        self.pisava = pisava
        self.polozaj = polozaj
        self.cilj = polozaj
        self.barva = barva
        self.postavljeno = prihod is None
        self.dogodek = dogodek
        self.tip_polozaja = tip_polozaja
        # print(prihod)
        if not self.postavljeno:
            self.zacetek = time.time()
            self.zacni_ob = prihod[2]
            self.prejsnja_razdalja = None
            if isinstance(prihod[0], tuple):
                self.cilj = prihod[0]
                # print("PREMIKAMO", self.polozaj, self.cilj)
                self.f_x, self.f_y, self.f_b = prihodi.prilet(self.polozaj, self.cilj, prihod[1])
                # print(self.f_x, self.f_y, self.f_b)
            else:
                # print("TIPKAMO")
                self.f_x, self.f_y, self.f_b = prihodi.natipkanje(self.polozaj, self.polozaj, prihod[1])
                # (self.f_x, self.f_y, self.f_b)

        self.surf = self.pisava.render("", True, self.barva)
        self.rect = self.surf.get_rect()
        '''self.rect = self.surf.get_rect()
        self.rect.center = self.polozaj'''
        self.nastavi_polozaj(self.polozaj)

    def nastavi_polozaj(self, polozaj):
        self.rect = self.surf.get_rect()
        if self.tip_polozaja == "topleft":
            self.rect.topleft = polozaj
        else:
            self.rect.center = polozaj

    def update(self, besedilo):
        self.besedilo = str(besedilo)

        if not self.postavljeno:
            t = round(time.time() - self.zacetek, 2) - self.zacni_ob  # Čas
            if t < 0:
                t = 0

            x = self.polozaj[0] + eval(self.f_x)
            y = self.polozaj[1] + eval(self.f_y)
            besedilo = eval(self.f_b)

            if self.prejsnja_razdalja is not None and self.prejsnja_razdalja[0] < self.razdalja((x, y), self.cilj):
                x, y = self.cilj

            self.surf = self.pisava.render(besedilo, True, self.barva)
            '''self.rect = self.surf.get_rect()
            self.rect.center = (x, y)'''
            self.nastavi_polozaj((x, y))

            polozaj = [round(a / 10) for a in self.rect.center]
            cilj = [round(b / 10) for b in self.cilj]
            self.postavljeno = (polozaj == cilj and besedilo == self.besedilo)
            self.prejsnja_razdalja = (self.razdalja((x, y), self.cilj), (x, y))
        else:
            self.surf = self.pisava.render(self.besedilo, True, self.barva)
            self.nastavi_polozaj(self.cilj)
            if self.dogodek is not None:
                for a in self.dogodek:
                    spremenljivke.nastavi(a[0], a[1])


class BesediloGumba(Besedilo):

    def update(self, besedilo):
        x = round(time.time(), 2) * 100
        y = 50 + abs(100 - x % 200) // 2
        # print(x, y)
        self.pisava = pygame.font.SysFont("Bold", int(y))
        self.surf = self.pisava.render(self.besedilo, True, self.barva)
        self.rect = self.surf.get_rect()
        self.rect.center = self.polozaj


class Pravokotnik(Figura):
    def __init__(self, a, b, barva, druga_barva=None):
        super().__init__()
        sirina = abs(a[0] - b[0])
        visina = abs(a[1] - b[1])

        self.polozaj = a
        self.surf = pygame.Surface((sirina, visina))
        if druga_barva is None:
            self.surf.fill(barva)
        else:
            pygame.draw.line(self.surf, barva, a, (b[0], a[1]))
            pygame.draw.line(self.surf, druga_barva, (a[0], b[1]), b)
            fill_gradient(self.surf, barva, druga_barva)
            # self.surf = pygame.transform.gradient_linear()
        self.rect = self.surf.get_rect()
        self.rect.topleft = self.polozaj

    def update(self):
        pass


class Slika(Figura):

    def __init__(self, x, y, v, ime, prihod=None):
        super().__init__()
        self.ime = ime

        self.polozaj = (x, y)
        self.surf = pygame.image.load(f"slike/{self.ime}.png")
        sirina, visina = self.surf.get_size()
        self.sirina = v
        self.visina = visina * (v / sirina)
        self.surf = pygame.transform.scale(self.surf, (self.sirina, self.visina))
        self.rect = self.surf.get_rect()
        self.rect.center = self.polozaj

        self.postavljeno = prihod is None
        if not self.postavljeno:
            self.zacetek = time.time()
            self.cilj = prihod[0]
            self.f_x, self.f_y, b = prihodi.prilet(self.polozaj, self.cilj, prihod[1])

    def update(self):
        if not self.postavljeno:
            t = round(time.time() - self.zacetek, 2)
            x = self.polozaj[0] + eval(self.f_x)
            y = self.polozaj[1] + eval(self.f_y)
            self.rect.center = (x, y)
            polozaj = [round(a / 10) for a in self.rect.center]
            cilj = [round(b / 10) for b in self.cilj]
            self.postavljeno = (polozaj == cilj)


class Gumb(Figura):

    def __init__(self, x, y, v, ime, ob_kliku, besedilo=None):
        super().__init__()
        self.ime = ime
        self.ob_kliku = ob_kliku
        self.besedilo = besedilo

        self.polozaj = (x, y)
        self.surf = pygame.image.load(f"slike/gumbi/{self.ime}.png")
        sirina, visina = self.surf.get_size()
        self.sirina = v
        self.visina = visina * (v / sirina)
        self.surf = pygame.transform.scale(self.surf, (self.sirina, self.visina))
        self.rect = self.surf.get_rect()
        self.rect.center = self.polozaj

        if self.besedilo is not None:
            # print(besedilo)
            # print(besedilo[0], besedilo[1], (x, y), (0, 0, 0))
            self.besedilo = BesediloGumba(besedilo[0], besedilo[1], (x, y), (0, 0, 0))
            skupine_figur.ospredje.add(self.besedilo)
            skupine_figur.vse_figure.add(self.besedilo)

    def update(self):
        x = round(time.time(), 2)
        y = (4 + abs(1 - x % 2)) / 4
        self.surf = pygame.image.load(f"slike/gumbi/{self.ime}.png")
        self.surf = pygame.transform.scale(self.surf, (self.sirina * y, self.visina * y))
        self.rect = self.surf.get_rect()
        self.rect.center = self.polozaj

    def kliknjen(self, x, y):
        # print(f"Kliknjen gumb {self.ime}")
        '''if self.ime == "Kupi":
            # print(tocke.denar[spremenljivke.spremenljivke["razred"]])'''
        for dogodek in self.ob_kliku:
            # print(dogodek)
            spremenljivke.nastavi(dogodek)
        '''if self.ime == "Kupi":
            print(tocke.denar[spremenljivke.spremenljivke["razred"]])'''


class Stevec(Figura):

    def __init__(self, x, y, v, ime, pisava, barva):
        super().__init__()
        self.ime = ime

        self.besedilo = Besedilo(self.ime, pisava, (x + v * 1.2, y + v//4), barva, tip_polozaja="topleft")
        skupine_figur.vse_figure.add(self.besedilo)

        self.polozaj = (x, y)
        self.surf = pygame.image.load(f"slike/Orodna vrstica/{self.ime}.png")
        self.surf = pygame.transform.scale(self.surf, (v, v))
        self.rect = self.surf.get_rect()
        self.rect.topleft = self.polozaj

        if self.ime == "Čas":
            self.opozorilo = None

    def update(self, st):
        self.besedilo.update(st)
        if self.ime == "Čas" and spremenljivke.spremenljivke["čas"] < 11:
            if self.opozorilo is None:
                self.opozorilo = Gumb(self.besedilo.polozaj[0], self.polozaj[1] - 150, 150, "kbk", ("", ""))
                skupine_figur.vse_figure.add(self.opozorilo)
            else:
                self.opozorilo.update()


class Igralec(Figura):
    def __init__(self, x, y, v=100, ime="Tohman"):
        super().__init__()

        self.ime = ime
        self.slika = 0
        self.velikost = (v, v)

        self.prejsnje_stanje = copy.deepcopy((tocke.denar, tocke.zivljenja))

        self.surf = pygame.image.load(f"slike/Figure/{self.ime}/{self.slika}.png")
        self.surf = pygame.transform.scale(self.surf, self.velikost)

        self.rect = self.surf.get_rect()
        self.rect.center = (x, y)

    def update(self):
        self.surf = pygame.image.load(f"slike/Figure/{self.ime}/{self.slika}.png")
        self.surf = pygame.transform.scale(self.surf, self.velikost)
        if self.slika != 0:
            if self.slika == 5:
                self.slika = 0
                self.prejsnje_stanje = copy.deepcopy((tocke.denar, tocke.zivljenja))
            else:
                if self.slika == 1:
                    zvok.play(mixer.Sound("zvoki/vgriz.mp3"))
                self.slika = self.slika + 1
        else:
            if self.prejsnje_stanje != (tocke.denar, tocke.zivljenja):
                self.slika = 1


class Izbor(Figura):
    def __init__(self, x, y, v, n):
        super().__init__()

        self.t = 0
        self.premikanje = False
        self.imena = [a[0] for a in spremenljivke.spremenljivke["igralci"]]
        self.cene = [a[1] for a in spremenljivke.spremenljivke["igralci"]]
        self.hitrosti = [a[2] for a in spremenljivke.spremenljivke["igralci"]]
        self.povecave = [a[3] for a in spremenljivke.spremenljivke["igralci"]]
        self.n = n
        self.p = 1
        self.ime = self.imena[(self.n + spremenljivke.spremenljivke["zamik"]) % len(self.imena)]
        self.cena = int(self.cene[(self.n + int(spremenljivke.spremenljivke["zamik"])) % len(self.cene)])
        self.hitrost = float(self.hitrosti[(self.n + int(spremenljivke.spremenljivke["zamik"])) % len(self.hitrosti)])
        self.povecava = self.povecave[(self.n + spremenljivke.spremenljivke["zamik"]) % len(self.povecave)]

        self.polozaj = (x, y)
        self.velikost = (v, v)

        self.polozaj_miske = (0, 0)

        self.surf = pygame.image.load("slike/Trgovina/Na voljo.png")
        self.surf = pygame.transform.scale(self.surf, self.velikost)

        self.rect = self.surf.get_rect()
        self.rect.center = self.polozaj

        self.igralec = Slika(self.polozaj[0], self.polozaj[1], 100, f"Figure/{self.ime}/0")
        skupine_figur.ospredje.add(self.igralec)
        skupine_figur.vse_figure.add(self.igralec)

        self.gumb = Gumb(self.polozaj[0], self.polozaj[1] + self.velikost[0] * 0.3, 100, "Kupi",
                         [("kupljeno", spremenljivke.spremenljivke["kupljeno"] + [self.ime])])
        skupine_figur.ospredje.add(self.gumb)
        skupine_figur.vse_figure.add(self.gumb)
        font = pygame.font.SysFont("Arial", 20)
        self.prikaz_cene = BesediloGumba(str(self.cena), font,
                                         (self.polozaj[0], self.polozaj[1] - self.velikost[0] * 0.3), "#000000")
        skupine_figur.ospredje.add(self.prikaz_cene)
        skupine_figur.vse_figure.add(self.prikaz_cene)

    def zamenjaj_sliko(self, ime):
        x, y = self.polozaj_miske
        self.surf = pygame.image.load(f"slike/Trgovina/{ime}.png")
        if self.rect.collidepoint(x, y):  # Če se dotika miške.
            if self.p < 1.08:
                self.p += 0.01
            self.surf = pygame.transform.scale(self.surf, [a * self.p for a in self.velikost])
            self.rect.center = [a - (self.p / 2 - 0.5) * self.velikost[0] for a in self.polozaj]
            spremenljivke.spremenljivke["podatki"] = f"Hitrost: {int(self.hitrost * 100)}, " \
                                                     f"Dodatne točke: {self.povecava.replace('*', '×')}"
        else:
            if self.p > 1:
                self.p -= 0.01
                spremenljivke.spremenljivke["podatki"] = ""
            self.surf = pygame.transform.scale(self.surf, [a * self.p for a in self.velikost])
            self.rect.center = [a - (self.p / 2 - 0.5) * self.velikost[0] for a in self.polozaj]

    def update(self, x, y):
        a = 0
        if spremenljivke.spremenljivke["izbran"] == self.ime:
            a = round(time.time() * 10 % 5)
            self.zamenjaj_sliko("Izbran")
            if self.ime != "Tohman":
                self.gumb.ime = "Prodaj"
                k = copy.deepcopy(spremenljivke.spremenljivke["kupljeno"])
                k.remove(self.ime)
                self.gumb.ob_kliku = [("kupljeno", k), ("izbran", "Tohman"), ("denar", self.cena), ("povečava", "*1")]
            else:
                self.gumb.ime = "Nič"
        elif spremenljivke.spremenljivke["kupljeno"].count(self.ime) or self.ime == "Tohman":
            self.zamenjaj_sliko("Kupljen")
            self.gumb.ime = "Izberi"
            self.gumb.ob_kliku = [("izbran", self.ime),  ("hitrost", self.hitrost), ("povečava", self.povecava)]
        elif tocke.denar[spremenljivke.spremenljivke['razred']] >= self.cena:
            self.zamenjaj_sliko("Na voljo")
            if self.ime != "Tohman":
                self.gumb.ime = "Kupi"
                k = spremenljivke.spremenljivke["kupljeno"] + [self.ime]
                self.gumb.ob_kliku = [("kupljeno", k), ("izbran", self.ime), ("denar", -self.cena),
                                      ("hitrost", self.hitrost), ("povečava", self.povecava)]
            else:
                self.gumb.ime = "Nič"
        else:
            self.zamenjaj_sliko("Predrag")
            self.gumb.ime = "Nič"

        self.ime = self.imena[int((self.n + spremenljivke.spremenljivke["zamik"]) % len(self.imena))]
        self.igralec.surf = pygame.image.load(f"slike/Figure/{self.ime}/{a}.png")
        self.igralec.surf = pygame.transform.scale(self.igralec.surf, (self.igralec.sirina, self.igralec.visina))

        self.cena = int(self.cene[(self.n + int(spremenljivke.spremenljivke["zamik"])) % len(self.cene)])
        self.prikaz_cene.besedilo = str(self.cena)

        self.hitrost = float(self.hitrosti[(self.n + int(spremenljivke.spremenljivke["zamik"])) % len(self.hitrosti)])
        self.povecava = self.povecave[int((self.n + spremenljivke.spremenljivke["zamik"])) % len(self.povecave)]

        self.polozaj_miske = (x, y)


class Kvadrat(Figura):
    def __init__(self, x, y, n, v=100):
        super().__init__()
        self.stolpec = x
        self.vrstica = y
        self.x = x * n
        self.y = y * n
        self.n = n
        self.v = v
        self.doseg = [4]
        self.slika = ""
        self.surf = self.spremeni_sliko(self.stolpec, self.vrstica)
        self.rect = self.surf.get_rect()
        self.rect.topleft = (x * n, y * n)
        if (self.stolpec, self.vrstica) in svet.dotaknjeno:
            # self.v = self.v * 0.5
            skupine_figur.okolica.add(self)

    def popravi(self, stolpec, vrstica):
        stolpec_ok = False
        vrstica_ok = False
        # print("A")
        # print(svet.sirina, svet.visina)
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
        # print(int(stolpec), int(vrstica))
        # print("Ž")
        return int(stolpec), int(vrstica)

    def spremeni_sliko(self, stolpec, vrstica, ime=None):
        stolpec, vrstica = (int(a) for a in self.popravi(stolpec, vrstica))
        if ime is not None:
            svet.popravi(stolpec, vrstica, ime)
        # print(stolpec, vrstica)
        self.slika = f"slike/{svet.svet[vrstica][stolpec]}.png"
        surf = pygame.image.load(self.slika)
        surf = pygame.transform.scale(surf, (self.v, self.v))

        return surf

    def update(self, x, y):
        s = self.stolpec + x // 1
        v = self.vrstica - y // 1
        self.surf = self.spremeni_sliko(s, v)
        self.rect.topleft = (self.x - (x % 1) * self.n, self.y + (y % 1) * self.n)
        if self in skupine_figur.okolica and "Sk" in self.slika:
            if svet.dotaknjeno.index((self.stolpec, self.vrstica)) in self.doseg:
                if "ž" in self.slika:
                    tocke.spremeni(1, o=self.slika.replace("slike/Sk", "").replace("ž.png", ""), s="življenja")
                else:
                    tocke.spremeni(int(self.slika.replace("slike/Sk", "").replace(".png", "")))
                self.spremeni_sliko(s, v, "Tla")

    def videz(self):
        # self.surf = pygame.transform.scale(self.surf, (self.v, self.v))
        return self.slika, svet.dotaknjeno.index((self.stolpec, self.vrstica))

    def kliknjen(self, x, y):
        s = self.stolpec + x // 1
        v = self.vrstica - y // 1
        s, v = self.popravi(s, v)
        svet.popravi(s, v)
        # print(s, v, len(svet.svet) - 1, len(svet.svet[0]) - 1)
        self.surf = self.spremeni_sliko(s, v)
