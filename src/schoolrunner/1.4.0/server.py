from fastapi import FastAPI
import requests, random

app = FastAPI()

# Pomožna spremenljivka za shranjevanje trenutnih podatkov (slovarjev)
paralelki = ["A", "B"]
denar = {}
igralci = {}
for r in range(1, 10):
    for p in paralelki:
        denar[f"{r}.{p}"] = random.randint(200, 1000)
        igralci[f"{r}.{p}"] = int("1" * len(list(open("slike/Figure/Cenik.txt", "r").read().split("\n"))))
        # denar[f"{r}.{p}"] = 0


# Določanje poti za branje denarja
@app.get("/beri_denar")
def get_data():
    return {"denar": denar}


# Določanje poti za branje denarja
@app.get("/beri_igralce")
def get_data():
    return {"igralci": igralci}


# Določanje poti za posodabljanje denarja
@app.put("/pisi_denar")
def update_data(new_data: dict):
    global denar
    denar = new_data
    return {"obvestilo": "Data updated successfully", "nov_denar": new_data}


# Določanje poti za posodabljanje denarja
@app.put("/pisi_igralce")
def update_data(novi_podatki: dict):
    global igralci
    igralci = novi_podatki
    return {"obvestilo": "Data updated successfully", "novi_igralci": novi_podatki}
