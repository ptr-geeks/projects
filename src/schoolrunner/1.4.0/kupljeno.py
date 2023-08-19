import os
import requests

import spremenljivke

api_url = "http://127.0.0.1:8000"


def beri():
    global kupljeno
    response = requests.get(f"{api_url}/beri_igralce")
    # print(response.json())
    return response.json()["igralci"]


def shrani(a):
    # print("shranjijemo podatke...", a)
    response = requests.put(f"{api_url}/pisi_igralce", json=a)
    # spremenljivke.nastavi("kupljeno", seznam())
    if response.status_code == 200:
        print("Podatki uspešno posodobljeni.")
    else:
        print("Napaka pri posodabljanju podatkov.")


def pretvori(s):
    rezultat = ""
    for igralec in igralci:
        # print(s)
        rezultat += str(s.count(igralec) + 1)
    return int(rezultat)


def spremeni(s):
    global kupljeno, zivljenja
    novo = pretvori(s)
    kupljeno[spremenljivke.spremenljivke['razred']] = novo
    shrani(kupljeno)


def seznam():
    s = []
    for a in range(len(str(kupljeno[spremenljivke.spremenljivke["razred"]]))):
        # print(kupljeno[spremenljivke.spremenljivke["razred"]], a)
        stevka = str(kupljeno[spremenljivke.spremenljivke["razred"]])[a]
        if int(stevka) - 1:
            s.append(igralci[a])
    # print("Prebrani podatki", s)
    return s


igralci = os.listdir("slike/Figure")
igralci.remove("Cenik.txt")
kupljeno = beri()
