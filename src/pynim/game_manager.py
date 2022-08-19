import pygame
import spremenljivke

from test_entity import Zeton
from stevilo import Stevilo


class GameManager:
    all_sprites = pygame.sprite.Group()
    zetoni = pygame.sprite.Group()
    stevila = pygame.sprite.Group()

    def naredi_zetone(self, n):
        for i in range(n):
            new_entity = Zeton(i)
            self.all_sprites.add(new_entity)
            self.zetoni.add(new_entity)
            new_number = Stevilo(i)
            self.all_sprites.add(new_number)
            self.stevila.add(new_number)

    def update(self):
        self.zetoni.update()
        # self.stevila.update()
