# Svet
import random
import sys


def nakljucno_naredi_svet():
    datoteka = open("Svet.txt", "w")
    prejsnja_vrstica = []
    # print(sirina, visina)

    for a in range(visina):
        vrstica = []
        utezi = [0.75, 0.05, 0.1]
        # utezi = [1, 0, 0]
        for b in range(sirina):
            if a > 0 < b:
                if "Zid" in (prejsnja_vrstica[b], vrstica[b - 1]):
                    utezi = [0.4, 0.4, 0.2]
            vrstica += random.choices(["Tla", "Zid", "Sk1"], utezi)
        datoteka.write(", ".join(str(x) for x in vrstica))
        prejsnja_vrstica = vrstica
        if a < visina - 1:
            datoteka.write("\n")


def shrani():
    global svet, sirina, visina
    datoteka = open("Svet.txt", "w")

    for a in range(len(svet)):
        v = svet[a]
        vrstica = []
        for s in v:
            vrstica.append(s)
        datoteka.write(", ".join(str(x) for x in vrstica))
        if a < len(svet) - 1:
            datoteka.write("\n")


def popravi(s, v, ime=None):
    moznosti = ["Tla", "Zid", "Sk1", "Sk-1", "Sk+ž", "Sk-ž", "Sk10", "Sk-10"]
    # moznosti = ["Tla", "Zid"]
    if ime is None:
        svet[v][s] = moznosti[moznosti.index(svet[v][s]) + 1 - len(moznosti) * (svet[v][s] == moznosti[-1])]
    else:
        if "Sk" in svet[v][s]:
            nov_skitels()
        svet[v][s] = ime
    shrani()


def izbrisi_skitelse():
    for a in range(visina):
        for b in range(sirina):
            if "Sk" in svet[a][b]:
                svet[a][b] = "Tla"
    shrani()


def nov_skitels(skitels=None):
    if skitels is None:
        '''t = str(svet).count("Sk1") + str(svet).count("Sk10") * 10
        s = str(svet).count("Sk")'''
        utezi = [0.2, 0.3, 0.2, 0.1, 0.1, 0.1]
        skitels = random.choices(["Sk1", "Sk-1", "Sk-ž", "Sk+ž", "Sk10", "Sk-10"], utezi)[0]
    while str(svet).count("Tla"):
        x = random.randint(0, sirina)
        y = random.randint(0, visina)
        if svet[y][x] == "Tla":
            svet[y][x] = skitels
            break
    shrani()


def nakljucno_naredi_skitelse(st=None):
    if st is None:
        st = (sirina * visina) // 5 - str(svet).count("Sk")
        # print(sirina, visina, (sirina * visina) // 10 - str(svet).count("Sk"))
    for a in range(st):
        nov_skitels("Sk1")


def posodobi_skitelse():
    izbrisi_skitelse()
    nakljucno_naredi_skitelse()


def popravi_koordinate(stolpec, vrstica):
    stolpec_ok = False
    vrstica_ok = False
    while not (stolpec_ok and vrstica_ok):
        if stolpec > sirina:
            stolpec -= sirina
        elif stolpec < 0:
            stolpec += sirina
        else:
            stolpec_ok = True
        if vrstica > visina:
            vrstica -= visina
        elif vrstica < 0:
            vrstica += visina
        else:
            vrstica_ok = True
    return int(stolpec), int(vrstica)


def najdi_kvadrat(x, y):
    x, y = popravi_koordinate(x, y)
    return svet[y][x]


def se_dotika(seznam):
    global okolica, dotaknjeno, videzi
    dotaknjeno = seznam
    videzi = [None] * 8


def videz_najden(videz, stevilo):
    global videzi
    # print("Delamo!!!", videz, stevilo)
    videzi[stevilo] = videz
    # print(videzi)


dotaknjeno = [None] * 9
videzi = [None] * 9

sirina = 20
visina = 20

# print(sirina, visina)
nakljucno_naredi_svet()
svet = [list(vrstica.split(", ")) for vrstica in list(open("Svet.txt", "r").read().split("\n"))]
sirina = len(svet[0]) - 1
visina = len(svet) - 2
# izbrisi_skitelse()
# nakljucno_naredi_skitelse()

