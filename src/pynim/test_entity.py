import pygame
import math
import time
from random import randint

import spremenljivke
import konstante
from entity.image_path import get_image_path


class Zeton(pygame.sprite.Sprite):
    def __init__(self, i):
        super().__init__()
        if konstante.MAX_ZETONI % 2 == 0:
            sliki = ['rpika.png', 'pika.png']
        else:
            sliki = ['pika.png', 'rpika.png']

        self.i = i
        self.na_potezi = False
        self.surf = pygame.image.load(get_image_path('zpika.png'))
        self.surf.set_colorkey((255, 255, 255))
        VRSTA = int(konstante.SCREEN_WIDTH / 60 - 1)
        self.rect = self.surf.get_rect(center=((i % VRSTA + 1) * 60, 200 + int(i / VRSTA) * 60))
        # Text.create_font(str(i), )  create_font(t, s=72, c=(255, 255, 255), b=False, i=False)
        '''if konstante.MAX_ZETONI % 2 == 1:
            i += 1'''
        if self.i < konstante.MAX_ZETONI:
            if i % 2 == 0:
                self.surf = pygame.image.load(get_image_path(sliki[0]))
            else:
                self.surf = pygame.image.load(get_image_path(sliki[1]))

    def update(self):
        if self.na_potezi and self.i < konstante.MAX_ZETONI:
            if pygame.mouse.get_pressed()[0] and self.rect.collidepoint(pygame.mouse.get_pos()):
                spremenljivke.spremeni_zetone_za(-(self.i + 1), 1)
                self.na_potezi = False

    def poteza(self, namig):
        if self.i + 1 == namig and self.rect.y != 165:
            self.surf = pygame.image.load(get_image_path("icon.png"))
        self.na_potezi = True


class Figura(pygame.sprite.Sprite):
    def __init__(self, besedilo, velikost, barva, pos, center):
        super().__init__()
        self.besedilo = besedilo
        self.velikost = velikost
        self.barva = barva
        self.font = pygame.font.Font(None, velikost)
        self.surf = self.font.render(self.besedilo, True, self.velikost)
        if center:
            self.rect = self.surf.get_rect(center=(pos))
        else:
            self.rect = self.surf.get_rect(topleft=pos)

    def update(self):
        self.surf = self.font.render(self.besedilo, True, self.barva)

