from konstante import CUSTOM_EVENT, CUSTOM_EVENT2
from game_manager import GameManager
import pygame


class EventHandler():
    def __init__(self, game_manager: GameManager):
        self.game_manager = game_manager
        self.post_test_event()

    def handle_event(self, event: pygame.event.Event):

        # look to post_test_event for how to trigger custom events
        if event.type == pygame.USEREVENT:
            if event.custom_type == CUSTOM_EVENT:
                # do stuff
                pass
            elif event.custom_type == CUSTOM_EVENT2:
                # do some other stuff
                print('hello2')

    def post_test_event(self):
        # custom_type is defined in constants.py and message can be anything
        my_event = pygame.event.Event(pygame.USEREVENT, custom_type=CUSTOM_EVENT, message='Hello')

        # post an event right now
        pygame.event.post(my_event)

        # set a timer
        pygame.time.set_timer(my_event, 1000)
