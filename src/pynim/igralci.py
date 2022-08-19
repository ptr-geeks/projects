import random


class Igralec:
    def __init__(self, zetoni, max):
        self.max = max
        self.strategija = self.naredi_strategijo(zetoni)

    def naredi_strategijo(self, zetoni):
        strategija = {}
        return strategija

    def poteza(self, n):
        return random.choices(list(range(1, self.max + 1)), weights=self.strategija[n])[0]

    def pretvori(self, vzeto, max):
        seznam = []
        for a in range(1, max + 1):
            if a == vzeto:
                seznam.append(1)
            else:
                seznam.append(0)
        return seznam


class PametenIgralec(Igralec):
    def __init__(self, zetoni, max):
        super().__init__(zetoni, max)

    def naredi_strategijo(self, zetoni):
        strategija = {}
        for a in range(1, zetoni + 1):
            if a == 1:
                strategija[a] = [1] + [0] * (self.max - 1)
            elif a % (self.max + 1) == 0:
                strategija[a] = self.pretvori(self.max, self.max)
            elif a % (self.max + 1) == 1:
                strategija[a] = [1 / self.max] * self.max
            else:
                strategija[a] = self.pretvori(a % (self.max + 1) - 1, self.max)
        return strategija


class NeumenIgralec(Igralec):
    def __init__(self, zetoni, max):
        super().__init__(zetoni, max)

    def naredi_strategijo(self, zetoni):
        strategija = {}
        for a in range(1, zetoni + 1):
            if a == 1:
                strategija[a] = [1] + [0] * (self.max - 1)
            elif (a + 1) % (self.max + 1) == 0:
                strategija[a] = self.pretvori(self.max, self.max)
            elif (a + 1) % (self.max + 1) == 1:
                strategija[a] = [1 / self.max] * self.max
            else:
                strategija[a] = self.pretvori(a % (self.max + 1), self.max)
        return strategija


class NastavljiviIgralec(Igralec):
    def __init__(self, zetoni, max, strategijaA, strategijaB, x):
        self.strategijaA, self.strategijaB, self.x = strategijaA, strategijaB, x
        super().__init__(zetoni, max)

    def kombiniraj_strategiji(self, a):
        porazdelitev = []
        for b in range(0, self.max):
            if self.strategijaA[a][b] > self.strategijaB[a][b]:
                porazdelitev.append(self.strategijaA[a][b] * self.x)
            elif self.strategijaA[a][b] == self.strategijaB[a][b]:
                porazdelitev.append(self.strategijaA[a][b])
            else:
                porazdelitev.append(round(1 - (self.strategijaB[a][b] * self.x), 1))
        return porazdelitev

    def naredi_strategijo(self, zetoni):
        strategija = {}
        stevilo = 0
        for a in range(1, zetoni + 1):
            if self.strategijaA[a] == self.strategijaB[a]:
                porazdelitev = self.strategijaA[a]
            else:
                porazdelitev = self.kombiniraj_strategiji(a)
            strategija[a] = porazdelitev
        return strategija
