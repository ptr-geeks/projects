import pygame
import spremenljivke
from besedilo import *
from konstante import SCREEN_WIDTH


class Stevilo(pygame.sprite.Sprite):
    def __init__(self, i):
        super().__init__()
        self.i = i
        self.surf = create_font(str(spremenljivke.ZETONI - i), s=30, c="black")
        # self.surf.set_colorkey((255, 255, 255))
        VRSTA = int(SCREEN_WIDTH / 60 - 1)
        self.rect = self.surf.get_rect(center=((i % VRSTA + 1) * 60, 200 + int(i / VRSTA) * 60))
        # Text.create_font(str(i), )  create_font(t, s=72, c=(255, 255, 255), b=False, i=False)
