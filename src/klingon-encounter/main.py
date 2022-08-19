"""The purpouse of this game was to chalange myself and to attempt to build a gamma from scratch,
sadly I failed therefore I had to use a template online but most of everything other than the way the images move was made by myself,
I hope that next year i will be able to improve upon the game and make one completely from scrath.

To finish:
 - Rotate Starship by pressing q and e
 - Rotate Warship by using 4 and 6 or pgup and pgdown
 - Make Photon torpedoes shimmer
 - Make disruptor shots wiggle
 - Vector based movement
 - Title screen
 - Different starhips and warships
 - Impulse drive (increases velocity)
 - Change ships stats from pygame window
"""



import pygame, math, random, time
from pygame import rect


pygame.font.init()
pygame.mixer.init()

WIDTH, HEIGHT = 1800, 980
WIN = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Klingon encounter!")

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
BLUE = (0, 0, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
PURPLE = (255, 0, 255)

FPS = 240
VEL = 1
SPEED = 1.5
BULLET_VEL = 4
MAX_BULLETS = 15

swidth = 59
slenght = 174

kwidth = 65
klenght = 54

fedhit = pygame.USEREVENT + 1
kllinhit = pygame.USEREVENT + 2


# music and sound effects used in the game
shieldsFailing = pygame.mixer.Sound("warningprimaryshieldsfailing_ep.mp3")
PhotonFireSound = pygame.mixer.Sound("tos_photon_torpedo_2.mp3")
DisruptorFireSound = pygame.mixer.Sound("klingon_disruptor_clean.mp3")
StarfleetHullDamageSound = pygame.mixer.Sound("tos_hullhit_1.mp3")
KlingonAlertSound = pygame.mixer.Sound("klingon_alert.mp3")
StructuralIntegredyFailing = pygame.mixer.Sound("structuralintegritu field has collapsed.wav")
ShieldImpactSound = pygame.mixer.Sound("shielimpact.wav")
StarfleetWinMusic = pygame.mixer.music.load("Starfleettheme.wav")



HasPlaySound = False
KlingonAlert = False
StructuralIntegr = False


BORDER = pygame.Rect(WIDTH, 0, 10, HEIGHT)


HEALTH_FONT = pygame.font.Font('Stardate81316-aolE.ttf', 40)
WINNER_FONT = pygame.font.Font('Stardate81316-aolE.ttf', 100)


starfleet_image = pygame.image.load("starfleet.png")
starship = pygame.transform.scale(starfleet_image, (swidth, slenght))

klingon_image = pygame.image.load("klingon.png")
warship = pygame.transform.scale(klingon_image, (kwidth, klenght))

SPACE = pygame.transform.scale(pygame.image.load("trek-space.jpg"), (WIDTH, HEIGHT))

PHOTON = pygame.image.load("redphoton.jpg")
photonImage = pygame.transform.scale(PHOTON, (20, 30))
photonImage.set_colorkey((0, 0, 0))

DISRUPTOR = pygame.image.load("kindpng_4836450.png")
disruptorImage = pygame.transform.scale(DISRUPTOR, (20, 20))

StarfleetLogo = pygame.image.load("Starfleet-Logo-700x394.png")
KlingonLogo = pygame.image.load("image-removebg-preview-removebg-preview-removebg-preview.png")



# for some reson they are reversed so i took the easy way out
def draw_window(red, yellow, disruptor, photon_torpedoes, klingon_hull, starfleet_hull, klingon_shield,
                starfleet_shield):
    WIN.blit(SPACE, (0, 0))
    pygame.draw.rect(WIN, BLACK, BORDER)

    klingon_shield_healt = HEALTH_FONT.render(
        "Hull Health: " + str(klingon_shield), 1, WHITE)
    starfleet_shield_health = HEALTH_FONT.render(
        "Hull Health: " + str(starfleet_shield), 1, WHITE)

    klingon_hull_health = HEALTH_FONT.render(
        "Shield Health: " + str(klingon_hull), 1, WHITE)
    starfleet_hull_healt = HEALTH_FONT.render(
        "Shield Health: " + str(starfleet_hull), 1, WHITE)

    WIN.blit(klingon_shield_healt, (WIDTH - klingon_shield_healt.get_width() - 10, 10))
    WIN.blit(starfleet_shield_health, (10, 10))
    WIN.blit(klingon_hull_health, (WIDTH - klingon_shield_healt.get_width() - 40, 40))
    WIN.blit(starfleet_hull_healt, (10, 40))

    WIN.blit(starship, (yellow.x, yellow.y))
    WIN.blit(warship, (red.x, red.y))

    for bullet in disruptor:
        WIN.blit(disruptorImage, (bullet.x, bullet.y))

    for bullet in photon_torpedoes:
        WIN.blit(photonImage, (bullet.x, bullet.y))
    # pygame.image.load("redphoton.jpg")

    pygame.display.update()


def yellow_handle_movement(keys_pressed, yellow):
    global starship

    if keys_pressed[pygame.K_q]:
        starship_copy = pygame.transform.rotate(starship, 6)
        WIN.blit(starship, (yellow.x - int(starship.get_width() / 2), yellow.y - int(starship.get_height() / 2)))


    if keys_pressed[pygame.K_a] and yellow.x - VEL > 0:  # LEFTq
        yellow.x -= VEL
    if keys_pressed[pygame.K_d] and yellow.x + VEL + yellow.width < BORDER.x:  # RIGHT
        yellow.x += VEL
    if keys_pressed[pygame.K_w] and yellow.y - VEL > 0:  # UP
        yellow.y -= VEL
    if keys_pressed[pygame.K_s] and yellow.y + VEL + yellow.height < HEIGHT - 15:  # DOWN
        yellow.y += VEL


def red_handle_movement(keys_pressed, red):
    if keys_pressed[pygame.K_LEFT] and red.x - SPEED > 0:  # LEFT
        red.x -= SPEED
    if keys_pressed[pygame.K_RIGHT] and red.x + SPEED + red.width < WIDTH:  # RIGHT
        red.x += SPEED
    if keys_pressed[pygame.K_UP] and red.y - SPEED > 0:  # UP
        red.y -= SPEED
    if keys_pressed[pygame.K_DOWN] and red.y + SPEED + red.height < HEIGHT - 15:  # DOWN
        red.y += SPEED


def handle_bullets(yellow_bullets, red_bullets, yellow, red):
    for bullet in yellow_bullets:
        bullet.x += BULLET_VEL
        if red.colliderect(bullet):
            pygame.event.post(pygame.event.Event(kllinhit))
            yellow_bullets.remove(bullet)
        elif bullet.x > WIDTH:
            yellow_bullets.remove(bullet)

    for bullet in red_bullets:
        bullet.x -= BULLET_VEL
        if yellow.colliderect(bullet):
            pygame.event.post(pygame.event.Event(fedhit))
            red_bullets.remove(bullet)
        elif bullet.x < 0:
            red_bullets.remove(bullet)


def draw_winner(text):
    draw_text = WINNER_FONT.render(text, 1, WHITE)
    WIN.blit(draw_text, (WIDTH / 2 - draw_text.get_width() /
                         2, HEIGHT / 2 - draw_text.get_height() / 2))
    pygame.display.update()
    pygame.time.delay(5000)


def main():
    brel = pygame.Rect(700, 300, kwidth, klenght)
    ent = pygame.Rect(100, 300, swidth, slenght)

    red_bullets = []
    yellow_bullets = []

    klingon_shield = 6
    starfleet_shield = 10
    klingon_hull = 5
    starfleet_hull = 6

    clock = pygame.time.Clock()
    run = True
    while run:
        clock.tick(FPS)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
                pygame.quit()

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LCTRL and len(yellow_bullets) < MAX_BULLETS:
                    bullet = pygame.Rect(
                        ent.x + ent.width, ent.y + ent.height // 2 - 2, 10, 5)
                    yellow_bullets.append(bullet)
                    pygame.mixer.Sound.play(PhotonFireSound)
                    bullet = pygame.Rect(
                        ent.x + ent.width, ent.y + 5 + ent.height //3 - 2, 10, 5)
                    yellow_bullets.append(bullet)
                    pygame.mixer.Sound.play(PhotonFireSound)

                if event.key == pygame.K_RCTRL and len(red_bullets) < MAX_BULLETS:
                    bullet = pygame.Rect(
                        brel.x, brel.y + brel.height // 2 - 2, 10, 5)
                    red_bullets.append(bullet)
                    pygame.mixer.Sound.play(DisruptorFireSound)

            if event.type == kllinhit:
                klingon_shield -= 1
                pygame.mixer.Sound(ShieldImpactSound)

            if event.type == fedhit:
                starfleet_shield -= 1
                pygame.mixer.Sound(ShieldImpactSound)

            if starfleet_shield == 0:
                global HasPlaySound
                if HasPlaySound == False:
                    pygame.mixer.music.load("warningprimaryshieldsfailing_ep.mp3")
                    pygame.mixer.music.play(1)
                    HasPlaySound = True

            if starfleet_shield < 0:
                if event.type == fedhit:
                    starfleet_hull -= 1
                    pygame.mixer.Sound(StarfleetHullDamageSound)

            if klingon_shield < 0:
                global KlingonAlert
                if event.type == kllinhit:
                    klingon_hull -= 2
                    pygame.mixer.Sound(KlingonAlertSound)
                    KlingonAlert = True

            if klingon_shield < 0:
                if event.type == kllinhit:
                    klingon_hull -= 2
                    pygame.mixer.Sound(StarfleetHullDamageSound)

                if starfleet_hull == 1:
                    global StructuralIntegr
                    if StructuralIntegr == False:
                        pygame.mixer.music.load("warningprimaryshieldsfailing_ep.mp3")
                        pygame.mixer.music.play(1)
                        StructuralIntegr = True

        winner_text = ""
        if klingon_hull <= 0:
            winner_text = "Starfleet wins!"
            pygame.mixer.music.load("Starfleettheme.wav")
            pygame.mixer.music.play(1)

        if starfleet_hull <= 0:
            winner_text = "You bring honor to the Klingon EMPIRE!!!"
            pygame.mixer.music.load("Klingon-Theme.waw")
            pygame.mixer.music.play(1)

        if winner_text != "":
            draw_winner(winner_text)
            break

        keys_pressed = pygame.key.get_pressed()
        yellow_handle_movement(keys_pressed, ent)
        red_handle_movement(keys_pressed, brel)

        handle_bullets(yellow_bullets, red_bullets, ent, brel)

        draw_window(brel, ent, red_bullets, yellow_bullets,
                    klingon_shield, starfleet_shield, klingon_hull, starfleet_hull)

        if keys_pressed[pygame.K_ESCAPE]:
                pygame.quit()

    main()


if __name__ == "__main__":
    main()
