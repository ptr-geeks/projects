import copy

import kupljeno
import tocke

spremenljivke = {}


def nastavi(spremenljivka, vrednost=None):
    if vrednost is None:
        spremenljivka, vrednost = spremenljivka
    if spremenljivka == "denar":
        tocke.spremeni(int(vrednost))
    elif str(vrednost).startswith("+="):
        spremenljivke[spremenljivka] += float(vrednost.replace("+=", ""))
    elif str(vrednost).startswith("-="):
        spremenljivke[spremenljivka] -= float(vrednost.replace("-=", ""))
    else:
        spremenljivke[spremenljivka] = vrednost
    if spremenljivka == "kupljeno":
        # print("A", spremenljivke["kupljeno"])
        kupljeno.spremeni(spremenljivke["kupljeno"])
