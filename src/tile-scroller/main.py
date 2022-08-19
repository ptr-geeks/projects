import pygame
import random

COLOR = (255, 100, 98)
SURFACE_COLOR = (167, 255, 100)
WIDTH = int(512)
HEIGHT = int(512)

TileSize = int(32)

playerX = int(96)
playerY = int(96)

levelHeight = 20
levelWidth = 30

vY = float(0)

TileGrid = []
########################################################################################################################################
def generateWorld():
    i1 = 0
    i2 = 0
    i3 = 0
    list1 = []

    while i3 < 10:
        while i1 < levelWidth + 20:
            list1.append("#")
            i1 += 1
        TileGrid.append(list1.copy())
        i3 += 1

    i1 = 0
    list1 = []

    while i1 < levelHeight:

        i3 = 0
        while i3 < 10:
            list1.append("#")# 10X "#"
            i3 += 1

        while i2 < levelWidth:
            if random.randint(0,9) == 0:# random fill
                list1.append(" ")
            else:
                list1.append(" ")
            i2 += 1

        i3 = 0
        while i3 < 10:
            list1.append("#")# 10X "#"
            i3 += 1

        TileGrid.append(list1.copy())# add row
        list1 = []
        i2 = 0
        i1 += 1

    i1 = 0
    i3 = 0
    list1 = []

    while i3 < 10:
        while i1 < levelWidth + 20:
            list1.append("#")
            i1 += 1
        TileGrid.append(list1.copy())
        i3 += 1
########################################################################################################################################
def generatePlatforms():
    i = 0
    while i < levelHeight * levelWidth * 0.1:
        x = random.randint(0, levelWidth + 10)
        y = random.randint(0,levelHeight + 10)
        a = random.randint(3,7)
        b = 0
        while b < a:
            TileGrid[y][x + b] = "#"
            b += 1
        i += 1
########################################################################################################################################
generateWorld()
generatePlatforms()
########################################################################################################################################
def drawLevel():
    x = 0
    y = 0
    while y < HEIGHT:
        while x < WIDTH:
            if TileGrid[int((y + playerY) / TileSize)][int((x + playerX) / TileSize)] == "#":
                pygame.draw.rect(surface,GREEN,pygame.Rect(x - (x + playerX) % TileSize,y - (y + playerY) % TileSize,TileSize,TileSize),0)
            a = int(x - playerX % TileSize)
            b = int(y - playerY % TileSize)

#            if TileGrid[int((y + playerY) / TileSize)][int((x + playerX) / TileSize)] == "R":
#                pygame.draw.polygon(surface,"black",(((0 + a),(16 + b))   ,   ((32 + a),(0 + b))   ,   ((32 + a),(32 + b))),0)

#            if TileGrid[int((y + playerY) / TileSize)][int((x + playerX) / TileSize)] == "D":
#                pygame.draw.polygon(surface,"black",(((16 + a),(0 + b))   ,   ((0 + a),(32 + b))   ,   ((32 + a),(32 + b))),0)

#            if TileGrid[int((y + playerY) / TileSize)][int((x + playerX) / TileSize)] == "L":
#                pygame.draw.polygon(surface,"black",(((32 + a),(16 + b))   ,   ((0 + a),(32 + b))   ,   ((0 + a),(0 + b))),0)

#            if TileGrid[int((y + playerY) / TileSize)][int((x + playerX) / TileSize)] == "U":
#                pygame.draw.polygon(surface,"black",(((16 + a),(32 + b))   ,   ((32 + a),(0 + b))   ,   ((0 + a),(0 + b))),0)

            x += TileSize
        x = 0
        y += TileSize
########################################################################################################################################
def generatePath(x,y,dir,a):
    global A
    if dir == "a":
        generatePath(x,y,"U",a)
        generatePath(x,y,"D",a)
        generatePath(x,y,"L",a)
        generatePath(x,y,"R",a)
    else:
        x2 = x
        y2 = y

        list1 = [(1,0),(0,1),(-1,0),(0,-1),(1,0),(0,1),(-1,0),(0,-1)]
        list2 = ["R","D","L","U","R","D","L","U"]

        x1,y1 = list1[list2.index(dir)]
        x2 += x1
        y2 += y1
        if TileGrid[y2][x2] == " " or (a == A and TileGrid[y2][x2] != "#"):
            TileGrid[y2][x2] = dir
            generatePath(x2,y2,dir,a)
        x2 -= x1
        y2 -= y1

        if a > 0:

            x1,y1 = list1[list2.index(dir) + 1]
            x2 += x1
            y2 += y1
            if TileGrid[y2][x2] == " ":
                TileGrid[y2][x2] = list2[list2.index(dir) + 1]
                generatePath(x2,y2,list2[list2.index(dir) + 1],a - 1)
            x2 -= x1
            y2 -= y1

            x1,y1 = list1[list2.index(dir) - 1]
            x2 += x1
            y2 += y1
            if TileGrid[y2][x2] == " ":
                TileGrid[y2][x2] = list2[list2.index(dir) - 1]
                generatePath(x2,y2,list2[list2.index(dir) - 1],a - 1)
            x2 -= x1
            y2 -= y1

########################################################################################################################################
class Sprite(pygame.sprite.Sprite):
    def __init__(self, color, height, width):
        super().__init__()

        self.image = pygame.Surface([width, height])
        self.image.fill(SURFACE_COLOR)
        self.image.set_colorkey(COLOR)

        pygame.draw.rect(self.image,
                         color,
                         pygame.Rect(0, 0, width, height))

        self.rect = self.image.get_rect()

    def moveRight(self, a):
        self.rect.x -= a

    def moveLeft(self, a):
        self.rect.x += a

    def moveUp(self, a):
        self.rect.y -= a

    def moveDown(self, a):
        self.rect.y += a

    def goto(self,x,y):
        self.rect.x = x
        self.rect.y = y

    def collisionBL(self,x,y):
        return(bool(TileGrid[int((y + 270) / TileSize)][int((x + 242) / TileSize)] == "#"))
    def collisionBR(self,x,y):
        return(bool(TileGrid[int((y + 270) / TileSize)][int((x + 270) / TileSize)] == "#"))
    def collisionTL(self,x,y):
        return(bool(TileGrid[int((y + 242) / TileSize)][int((x + 242) / TileSize)] == "#"))
    def collisionTR(self,x,y):
        return(bool(TileGrid[int((y + 242) / TileSize)][int((x + 270) / TileSize)] == "#"))

    def collision(self,x,y):
        a = self.collisionTL(x,y)
        b = self.collisionTR(x,y)
        c = self.collisionBL(x,y)
        d = self.collisionBR(x,y)
        return(a or b or c or d)
########################################################################################################################################
    def pathfind1(self):
        global enemy1X
        global enemy1Y

#        prevX = enemy1X
#        prevY = enemy1Y
        if TileGrid[enemy1X // TileSize][enemy1Y // TileSize] == "#":
            enemy1X = enemy1X // TileSize * TileSize
            enemy1Y = enemy1Y // TileSize * TileSize #+ TileSize

        list1 = [(1,0),(0,1),(-1,0),(0,-1),(0,0),(0,0)]
        list2 = ["R","D","L","U"," ","#"]
        x1,y1 = list1[list2.index(TileGrid[(enemy1Y + 16)// TileSize][(enemy1X + 16)// TileSize])]

        enemy1X -= x1 * 2

        if enemy1.collision(enemy1X -240,enemy1Y -240):
            enemy1X += x1 * 2
#                print(enemy1Y)
            a = enemy1Y % TileSize
            if a >= TileSize / 2:
                a -= TileSize
                enemy1Y -= a
            enemy1Y -= y1 * 2

        enemy1Y -= y1 * 2

        if enemy1.collision(enemy1X -240,enemy1Y -240):
            enemy1Y += y1 * 2
#                print(enemy1X)
            a = enemy1X % TileSize
            if a >= TileSize / 2:
                a -= TileSize
                enemy1X -= a
            enemy1X -= x1 * 2

#random movement
#        if prevX == enemy1X and prevY == enemy1Y:
#            a = random.randint(5,10)
#            x1 = random.randint(-1,1) * 2
#            y1 = random.randint(-1,1) * 2
#            i = 0
#            while i < a:
#                enemy1X += x1
#                if enemy1.collision(enemy1X -240,enemy1Y -240):
#                    enemy1X -= x1
#                enemy1Y += y1
#                if enemy1.collision(enemy1X -240,enemy1Y -240):
#                    enemy1Y -= y1
#                i += 1

    def pathfind2(self):
        global playerX
        global playerY
        global enemy2X
        global enemy2Y
        global enemy2vY
        global a
        global wantsToJump

        if enemy2Y - playerY < 5 * TileSize:
            x1 = 4
#            print("player is close")
        else:
            x1 = 4
#            print("player is far")

        enemy2vY -= 1
        if wantsToJump:
            wantsToJump = bool(False)
#            print("tried to jump")
            enemy2Y += 4
            if not(enemy2.collision(enemy2X - 240,enemy2Y - 240)):
                enemy2Y -= 4
#                print("jump failed")
            else:
                enemy2Y -= 4
                enemy2vY += 30
#                print("jumped")

        enemy2vY *= 0.9
        enemy2Y -= int(enemy2vY)
        if enemy2.collision(enemy2X - 240,enemy2Y - 240):
#            print("collidedY")
            enemy2Y += int(enemy2vY)
            enemy2vY = 0
            enemy2Y -= int(enemy2Y % TileSize)

#        print("enemy2X " + str(enemy2X))
#        print("playerX " + str(playerX))
#        print("enemy2Y " + str(enemy2Y))
#        print("playerY " + str(playerY))
#        print("- " + str(playerX - (playerY - enemy2Y) * -1))
#        print("+ " + str(playerX + (enemy2Y - playerY)))

        if enemy2X < playerX - (playerY - enemy2Y) * -1 + TileSize * 15:
            a = 1
#            print("out of range R")

        if enemy2X > playerX - (playerY - enemy2Y):
            a = -1
#            print("out of range L")

        enemy2X += x1 * a
        if enemy2.collision(enemy2X - 240,enemy2Y - 240):
#            print("collidedX")
            enemy2X -= x1 * a
            wantsToJump = bool(True)
        else:
            wantsToJump = bool(False)

########################################################################################################################################

pygame.init()###########################################################################################################################

surface = pygame.display.set_mode((400,300))

RED = (255,0,0)
GREEN = (0,255,0)
BLUE = (0,0,255)

enemy1X = (9 + levelWidth) * TileSize
enemy1Y = (9 + levelHeight) * TileSize

enemy2X = (18 + levelWidth) * int(TileSize * 0.5)
enemy2Y = (8 + levelHeight) * TileSize - 16
enemy2vY = 0
wantsToJump = bool(False)
a = 1

size = (WIDTH, HEIGHT)
screen = pygame.display.set_mode(size)
pygame.display.set_caption("tile scroller")

all_sprites_list = pygame.sprite.Group()

player = Sprite(BLUE,TileSize,TileSize)
enemy1 = Sprite(RED,TileSize,TileSize)
enemy2 = Sprite("grey",TileSize,TileSize)

all_sprites_list.add(player)
all_sprites_list.add(enemy1)
all_sprites_list.add(enemy2)

exit = True
clock = pygame.time.Clock()

while exit:#############################################################################################################################

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            exit = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_x:
                exit = False

    keys = pygame.key.get_pressed()
    
    if keys[pygame.K_LEFT]:
        if playerX >= 0:
            playerX -= 3
            if player.collision(playerX,playerY):
                playerX += 3

    if keys[pygame.K_RIGHT]:
        if playerX <= (levelWidth + 20) * TileSize - WIDTH:
            playerX += 3
            if player.collision(playerX,playerY):
                playerX -= 3

    vY -= 1
    if keys[pygame.K_UP]:
        playerY += 4
        if not(player.collision(playerX,playerY)):
            playerY -= 4
        else:
            playerY -= 4
            if playerY >= 0:
                vY += 30
    vY *= 0.9
    playerY -= int(vY)
    if player.collision(playerX,playerY):
        playerY += int(vY)
        vY = 0
        playerY -= int(playerY % TileSize - 16)

    screen.fill("white")
    i1 = int(0)
    i2 = int(0)
    while i1 < len(TileGrid):
        while i2 < len(TileGrid[i1]):
            if TileGrid[i1][i2] != '#':
                TileGrid[i1][i2] = ' '
            i2 += 1
        i1 += 1
        i2 = 0
    if enemy1X - 270 < playerX < enemy1X - 210 and enemy1Y - 270 < playerY < enemy1Y - 210 or enemy2X - 270 < playerX < enemy2X - 210 and enemy2Y - 270 < playerY < enemy2Y - 210:
        exit = False
    else:
        A = 3
        generatePath(playerX // TileSize + 8, playerY // TileSize + 8,"a",3)
        drawLevel()
        enemy1.pathfind1()
        enemy2.pathfind2()
        player.goto(240,240)
        enemy1.goto(enemy1X - playerX,enemy1Y - playerY)
        enemy2.goto(enemy2X - playerX,enemy2Y - playerY)
    
#    print(" ")
#    print(playerX)
#    print(playerY)
#    print(enemy1X)
#    print(enemy1Y)
#    print(enemy2X)
#    print(enemy2Y)
    all_sprites_list.update()
    all_sprites_list.draw(screen)
    pygame.display.flip()
    clock.tick(60)
    print("time: " + str(int(pygame.time.get_ticks()) / 1000))
pygame.quit()