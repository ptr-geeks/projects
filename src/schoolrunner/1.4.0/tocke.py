import sys
import requests

import spremenljivke

api_url = "http://127.0.0.1:8000"


def beri():
    global denar
    response = requests.get(f"{api_url}/beri_denar")
    # print(response.json())
    return response.json()["denar"]


def shrani(a):
    # print(a)
    response = requests.put(f"{api_url}/pisi_denar", json=a)
    if response.status_code == 200:
        print("Podatki uspešno posodobljeni.")
    else:
        print("Napaka pri posodabljanju podatkov.")


def spremeni(n, o="+", s="denar"):
    global denar, zivljenja
    if s == "denar":
        denar[spremenljivke.spremenljivke['razred']] = eval(f"denar[spremenljivke.spremenljivke['razred']] {o} n")
        shrani(denar)
    elif s == "življenja":
        zivljenja = eval(f"zivljenja {o} n")
        if zivljenja < 1:
            spremenljivke.nastavi("stanje", "konec")


denar = beri()
zivljenja = 3
# print(denar)
