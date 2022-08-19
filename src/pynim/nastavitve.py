import time
import test_entity
from pygame.locals import *
from spremenljivke import *
from barve import *
from konstante import *
from game_manager import GameManager
from event_handler import EventHandler
import zaslon

pygame.init()
pygame.font.init()


nastavljanje = True
pravokotnik = None
naslov = None
vrednost = None

game_manager = GameManager()
event_handler = EventHandler(game_manager)

screen = zaslon.naredi_zaslon(get_desktop_sizes()[0])
clock = pygame.time.Clock()
barva = 0


def obrni(slovar):
    keys = list(slovar.keys())
    values = list(slovar.values())
    obrnjeno = {}
    for a in range(0, len(keys)):
        obrnjeno[values[a]] = keys[a]
    return obrnjeno


def shrani(nastavljeno):
    nastavljeno = [pretvori(x, obratno=True) for x in nastavljeno]
    spremeni_zetone_za(nastavljeno.pop(0), 0)
    return nastavi_vrednosti(nastavljeno)


def save(kaj):
    besedilo = ''
    for a in kaj:
        besedilo = besedilo + str(a) + ' '
    file = open("save.txt", "w")
    file.write(besedilo)
    file.close()


def preberi_nastavitve():
    file = open("save.txt", "r")
    seznam = list(file.read().split(" "))
    for a in range(0, len(seznam)):
        if len(seznam[a]) == 0:
            seznam.remove(seznam[a])
        else:
            seznam[a] = int(seznam[a])
    return seznam


def hsv2rgb(h, s, v):
    return tuple(round(i * 255) for i in colorsys.hsv_to_rgb(h, s, v))


def pretvori(vrednost, obratno=False):
    nastavitev = nastavljeno.index(vrednost)
    prevod = [{}, {}, {"0": "Ja", "1": "Ne"}, {"False": "Zmaga", "True": "Izgubi"}, {}, {"False": "Ne", "True": "Ja"},
              {}]
    slovar = prevod[nastavitev]
    if obratno:
        slovar = obrni(slovar)

    if list(slovar.keys()).count(str(vrednost)):
        vrnitev = slovar[str(vrednost)]
        if vrnitev == "True":
            return True
        elif vrnitev == "False":
            return False
        else:
            return vrnitev
    else:
        if obratno:
            return int(vrednost)
        else:
            return str(vrednost)


def obnovi_vrednosti():
    global seznam_indexov, nastavljeno
    for a in range(0, len(seznam_indexov)):
        if a == 0 or a == 6:
            nastavljeno[a] = seznam_indexov[a]
        else:
            nastavljeno[a] = vse_nastavitve[a][1][seznam_indexov[a]]


def obnovi_figure():
    global vse_nastavitve, obravnavano, naslov, vrednost, screen

    for sprite in game_manager.all_sprites:
        sprite.kill()
    pygame.display.flip()
    pygame.display.update()
    game_manager.update()
    besedilo = vse_nastavitve[obravnavano][0]
    naslov = test_entity.Figura(besedilo, 50, crnobelo(BACKGROUND_COLOR),
                                (SCREEN_WIDTH / 2, 30), True)
    besedilo = pretvori(nastavljeno[obravnavano])
    vrednost = test_entity.Figura(besedilo, 100, crnobelo(BACKGROUND_COLOR),
                                  (SCREEN_WIDTH / 2, 500), True)
    game_manager.all_sprites.add(naslov)
    game_manager.all_sprites.add(vrednost)
    screen.blit(naslov.surf, naslov.rect)
    screen.blit(vrednost.surf, vrednost.rect)

    pygame.display.flip()


def nastavitve():
    global vse_nastavitve, obravnavano, nastavljeno, seznam_indexov, nastavljanje, game_manager, event_handler, screen
    vse_nastavitve = [["Žetoni", None],
                      ["Težavnost", list(range(0, 11))],
                      ["Boš začel igro?", ["Ja", "Ne"]],
                      ["Kdor vzame zadnji žeton...", ["Zmaga", "Izgubi"]],
                      ["Hitrost računalnikove poteze", list(range(0, 11))],
                      ["Želiš imeti namige?", ["Ja", "Ne"]],
                      ["Največ koliko žetonov lahko vzameš?", None]]
    obravnavano = 0
    nastavljeno = [10, 9, 0, True, 5, True, 2]
    seznam_indexov = preberi_nastavitve()

    nastavljanje = True

    game_manager = GameManager()
    event_handler = EventHandler(game_manager)

    screen = zaslon.naredi_zaslon(get_desktop_sizes()[0])
    clock = pygame.time.Clock()
    barva = 0

    while nastavljanje:
        for event in pygame.event.get():  # Ali je treba končati?
            if event.type == KEYDOWN:
                if event.key == K_SPACE:
                    if isinstance(vse_nastavitve[obravnavano][1], list):
                        seznam_indexov[obravnavano] = (seznam_indexov[obravnavano] + 1) % len(
                            vse_nastavitve[obravnavano][1])
                    else:
                        seznam_indexov[obravnavano] += 10
                elif event.key == K_UP:
                    if isinstance(vse_nastavitve[obravnavano][1], list):
                        seznam_indexov[obravnavano] = (seznam_indexov[obravnavano] + 1) % len(
                            vse_nastavitve[obravnavano][1])
                    else:
                        seznam_indexov[obravnavano] += 1
                elif event.key == K_DOWN:
                    if isinstance(vse_nastavitve[obravnavano][1], list):
                        seznam_indexov[obravnavano] = (seznam_indexov[obravnavano] - 1) % len(
                            vse_nastavitve[obravnavano][1])
                    elif seznam_indexov[obravnavano] > 1:
                        seznam_indexov[obravnavano] -= 1
                elif event.key == K_RIGHT:
                    obravnavano = (obravnavano + 1) % len(vse_nastavitve)
                elif event.key == K_LEFT:
                    obravnavano = (obravnavano - 1) % len(vse_nastavitve)
                elif event.key == K_s:
                    save(seznam_indexov)
                    nastavljanje = False
                else:
                    nastavljanje = False

            elif event.type == QUIT:
                nastavljanje = False
            else:
                event_handler.handle_event(event)

            BACKGROUND_COLOR = hsv2rgb(barva / 360, 1, 1)  # zaslon
            screen.fill(BACKGROUND_COLOR)

            obnovi_vrednosti()
            obnovi_figure()
            time.sleep(0.01)
            barva = barva % 360 + (SPEED_BKG + 1)
            clock.tick(FRAMERATE)

    for sprite in game_manager.all_sprites:
        sprite.kill()
    pygame.display.flip()
    pygame.display.update()
    game_manager.update()
    return shrani(nastavljeno)
