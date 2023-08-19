# "SSS" stands for Solar System Simulation
import pygame as p
import math   as m
p.init()
###################################################################################################
if True:
    horizonY       =      0
    upArrow        =      0
    downArrow      =      0
    wKey           =      0
    aKey           =      0
    sKey           =      0
    dKey           =      0
    cameraX        =      0
    cameraY        =      0
    cameraZ        =      0
    cameraI        =      0
    cameraIu       =      0
    cameraIn       =      0
    cameraIs       =      0
    cameraIe       =      0
    cameraIw       =      0
    cameraIne      =      0
    cameraInw      =      0
    cameraIse      =      0
    cameraIsw      =      0
    yaw            =      0
    pitch          =      0
    roll           =      0
    x              =      0
    y              =      0
    z              =      0
    zoom           =      1
    speed          =   5000
    FOVx           =    100# 60 --> 1039    120 --> 346
    FOVy           =     75
    timewarp       =  10000
    width          =   1200
    #height         =    600
    a              =       m.tan(m.radians(FOVx / 2))
    b              =       m.tan(m.radians(FOVy / 2))
    screenScale    =       int(width / (2 * a))
    sensitivity    =       500 / screenScale
    #print(screenScale)
    #width          =       a * screenScale * 2
    height         =       int(b * screenScale * 2)
    pointsT        =       []
    pointsR1       =       []
    pointsR2       =       []
    pointsP        =       []
    lines          =       []
    polygons       =       []
    dinamicPoints  =       []
    A              =       []
    B              =       []
    C              =       []
    read_only_list =       [1,2,4]#,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768]
    points         =       [[   0,   0,   0],[1000,   0,   0],[   0,1000,   0],[   0,   0,1000]]
    lines          =       [[0,1,(255,0,0),3],[0,2,(0,255,0),3],[0,3,(0,0,255),3]]#origin
    staticPoints   =       points
    screen         =       p.display.set_mode([width,height])
    font           =       p.font.Font('freesansbold.ttf', int(15))
    deltaX,deltaY  =       0,0
    cameraPos      =       (20,60)
    running        =       True
    hideCursor     =       False
    isometric      =       False
    cameraView     =       False
    paused         =       True
###################################################################################################
def distanceToCamera(i):
    global x
    global y
    global z
    avgX = (points[i[0][0]][0] + points[i[0][1]][0] + points[i[0][2]][0] + points[i[0][3]][0]) / 4
    avgY = (points[i[0][0]][1] + points[i[0][1]][1] + points[i[0][2]][1] + points[i[0][3]][1]) / 4
    avgZ = (points[i[0][0]][2] + points[i[0][1]][2] + points[i[0][2]][2] + points[i[0][3]][2]) / 4
    return m.sqrt(abs(x - avgX) * abs(x - avgX) + abs(y - avgY) * abs(y - avgY) + abs(z - avgZ) * abs(z - avgZ))

def value(i):
    return i[0] * 4 + i[1] * 2 + i[2]

def center(i):
    x = points[i[0][0]][0] + points[i[0][1]][0] + points[i[0][2]][0] + points[i[0][3]][0]
    y = points[i[0][0]][1] + points[i[0][1]][1] + points[i[0][2]][1] + points[i[0][3]][1]
    z = points[i[0][0]][2] + points[i[0][1]][2] + points[i[0][2]][2] + points[i[0][3]][2]
    x *= 0.25
    y *= 0.25
    z *= 0.25
    return [x,y,z]
###################################################################################################
class sphere:
    def __init__(this,_color,_n_color,_lineColor,_center,_longitude,_latitude,_radius,_orbitRadius,_angle,_ADirection,_orbitAngle,_oADirection,_day,_year,_hasCamera,_other):
        if _hasCamera:
            global cameraI
            global cameraIu
            global cameraIn
            global cameraIs
            global cameraIe
            global cameraIw
            global cameraIne
            global cameraInw
            global cameraIse
            global cameraIsw
            global centerI
        this.pos         = 0
        this.orbitPos    = 0
        this.rotationPos = 0
        this.Pts         = []
        this.polygons    = []
        this.originPts   = []
        this.day         = _day
        this.year        = _year
        this.color       = _color
        this.angle       = _angle
        this.other       = _other
        this.center      = _center
        this.radius      = _radius
        this.n_color     = _n_color
        this.latitude    = _latitude
        this.lineColor   = _lineColor
        this.longitude   = _longitude
        this.hasCamera   = _hasCamera
        this.ADirection  = _ADirection
        this.orbitAngle  = _orbitAngle
        this.orbitRadius = _orbitRadius
        this.oADirection = _oADirection
        
        for i in range(this.longitude + 1):
            for j in range(this.latitude // 2 + 1):
                x_ = this.radius * m.cos(m.radians((360 / this.longitude) * i)) * m.sin(m.radians((360 / this.latitude) * j))
                y_ = this.radius * m.sin(m.radians((360 / this.longitude) * i)) * m.sin(m.radians((360 / this.latitude) * j))
                z_ = this.radius * m.cos(m.radians((360 / this.latitude) * j))
                this.originPts.append([this.center[0] + x_,this.center[1] + y_,this.center[2] + z_])
                if i == 0 or j == 0:continue
                p = [len(this.originPts) - 1,len(this.originPts) - 2,len(this.originPts) - 3 - int(this.latitude * 0.5),len(this.originPts) - 2 - int(this.latitude * 0.5)]
                this.polygons.append([p])
        
        if _hasCamera:
            cameraI   = len(this.originPts)
            this.originPts.append([(this.radius +  0) * -m.cos(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])),
                                   (this.radius +  0) * -m.sin(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])),
                                   (this.radius +  0) * -m.cos(m.radians(cameraPos[1]))])
            cameraIu  = len(this.originPts)
            this.originPts.append([(this.radius + 50) * -m.cos(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])),
                                   (this.radius + 50) * -m.sin(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])),
                                   (this.radius + 50) * -m.cos(m.radians(cameraPos[1]))])
            cameraIn  = len(this.originPts)# N
            this.originPts.append([ this.radius       * -m.cos(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) + 2500 * m.cos(m.radians(cameraPos[0])) * 
                                    m.cos(m.radians(cameraPos[1])),
                                    this.radius       * -m.sin(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) + 2500 * m.sin(m.radians(cameraPos[0])) * 
                                    m.cos(m.radians(cameraPos[1])),
                                    this.radius       * -m.cos(m.radians(cameraPos[1]))                                  - 2500 * m.sin(m.radians(cameraPos[1]))   
                                                                  ])
            cameraIs  = len(this.originPts)# S
            this.originPts.append([ this.radius       * -m.cos(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) - 2500 * m.cos(m.radians(cameraPos[0])) * 
                                    m.cos(m.radians(cameraPos[1])),
                                    this.radius       * -m.sin(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) - 2500 * m.sin(m.radians(cameraPos[0])) * 
                                    m.cos(m.radians(cameraPos[1])),
                                    this.radius       * -m.cos(m.radians(cameraPos[1]))                                  + 2500 * m.sin(m.radians(cameraPos[1]))   
                                                                  ])
            cameraIe  = len(this.originPts)# E
            this.originPts.append([ this.radius       * -m.cos(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) - 2500 * m.sin(m.radians(cameraPos[0]))   
                                                                  ,
                                    this.radius       * -m.sin(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) + 2500 * m.cos(m.radians(cameraPos[0]))   
                                                                  ,
                                    this.radius       * -m.cos(m.radians(cameraPos[1]))                                                                            
                                                                  ])
            cameraIw  = len(this.originPts)# W
            this.originPts.append([ this.radius       * -m.cos(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) + 2500 * m.sin(m.radians(cameraPos[0]))   
                                                                  ,
                                    this.radius       * -m.sin(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) - 2500 * m.cos(m.radians(cameraPos[0]))   
                                                                  ,
                                    this.radius       * -m.cos(m.radians(cameraPos[1]))                                                                            
                                                                  ])
            magic_number = 1 / (2 ** 0.5)
            cameraIne = len(this.originPts)# NE
            this.originPts.append([ this.radius       * -m.cos(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) + (2500 * m.cos(m.radians(cameraPos[0])) * 
                                    m.cos(m.radians(cameraPos[1])) - 2500 * m.sin(m.radians(cameraPos[0]))) * magic_number,
                                    this.radius       * -m.sin(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) + (2500 * m.sin(m.radians(cameraPos[0])) * 
                                    m.cos(m.radians(cameraPos[1])) + 2500 * m.cos(m.radians(cameraPos[0]))) * magic_number,
                                    this.radius       * -m.cos(m.radians(cameraPos[1]))                                  - (2500 * m.sin(m.radians(cameraPos[1]))   
                                                                                                          ) * magic_number])
            cameraInw = len(this.originPts)# NW
            this.originPts.append([ this.radius       * -m.cos(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) + (2500 * m.cos(m.radians(cameraPos[0])) * 
                                    m.cos(m.radians(cameraPos[1])) + 2500 * m.sin(m.radians(cameraPos[0]))) * magic_number,
                                    this.radius       * -m.sin(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) + (2500 * m.sin(m.radians(cameraPos[0])) * 
                                    m.cos(m.radians(cameraPos[1])) - 2500 * m.cos(m.radians(cameraPos[0]))) * magic_number,
                                    this.radius       * -m.cos(m.radians(cameraPos[1]))                                  - (2500 * m.sin(m.radians(cameraPos[1]))   
                                                                                                          ) * magic_number])
            cameraIse = len(this.originPts)# SE
            this.originPts.append([ this.radius       * -m.cos(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) - (2500 * m.cos(m.radians(cameraPos[0])) * 
                                    m.cos(m.radians(cameraPos[1])) + 2500 * m.sin(m.radians(cameraPos[0]))) * magic_number,
                                    this.radius       * -m.sin(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) - (2500 * m.sin(m.radians(cameraPos[0])) * 
                                    m.cos(m.radians(cameraPos[1])) - 2500 * m.cos(m.radians(cameraPos[0]))) * magic_number,
                                    this.radius       * -m.cos(m.radians(cameraPos[1]))                                  + (2500 * m.sin(m.radians(cameraPos[1]))   
                                                                                                          ) * magic_number])
            cameraIsw = len(this.originPts)# SW
            this.originPts.append([ this.radius       * -m.cos(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) - (2500 * m.cos(m.radians(cameraPos[0])) * 
                                    m.cos(m.radians(cameraPos[1])) - 2500 * m.sin(m.radians(cameraPos[0]))) * magic_number,
                                    this.radius       * -m.sin(m.radians(cameraPos[0])) * m.sin(m.radians(cameraPos[1])) - (2500 * m.sin(m.radians(cameraPos[0])) * 
                                    m.cos(m.radians(cameraPos[1])) + 2500 * m.cos(m.radians(cameraPos[0]))) * magic_number,
                                    this.radius       * -m.cos(m.radians(cameraPos[1]))                                  + (2500 * m.sin(m.radians(cameraPos[1]))   
                                                                                                          ) * magic_number])
            centerI   = len(this.originPts)
            this.originPts.append([0,0,0])
        
        if this.other:
            this.center_i = len(this.originPts)
            this.originPts.append([0,0,0])
        
        c_ = len(staticPoints) + len(dinamicPoints)
        
        for i in range(len(this.polygons)):
            for j in range(4):
                this.polygons[i][0][j] += c_
        if _hasCamera:
            cameraI   += c_
            cameraIu  += c_
            cameraIn  += c_
            cameraIs  += c_
            cameraIe  += c_
            cameraIw  += c_
            cameraIne += c_
            cameraInw += c_
            cameraIse += c_
            cameraIsw += c_
            centerI   += c_
            this.c     = c_
        ###########################################################################################
        if True:
        
            this.Pts = this.originPts
            
            sinP = m.sin(m.radians( this.angle      ))
            cosP = m.cos(m.radians( this.angle      ))
            Pts2 = []
            for i in this.Pts:Pts2.append([i[0] * cosP + i[2] * -1 * sinP , i[1] , i[2] * cosP + i[0] * 1 * sinP])
            
            sinY = m.sin(m.radians( this.ADirection ))
            cosY = m.cos(m.radians( this.ADirection ))
            Pts41 = []
            for i in Pts2:Pts41.append([i[0] * cosY + i[1] * -1 * sinY , i[1] * cosY + i[0] * 1 * sinY , i[2] ])
            ###########################################################################################
            sinY = m.sin(m.radians(-this.oADirection))
            cosY = m.cos(m.radians(-this.oADirection))
            PtsA = []
            for i in Pts41:PtsA.append([i[0] * cosY + i[1] * -1 * sinY , i[1] * cosY + i[0] * 1 * sinY , i[2] ])
            
            sinP = m.sin(m.radians(-this.orbitAngle ))
            cosP = m.cos(m.radians(-this.orbitAngle ))
            PtsB = []
            for i in PtsA:PtsB.append([i[0] * cosP + i[2] * -1 * sinP , i[1] , i[2] * cosP + i[0] * 1 * sinP])
            
            for i in range(len(this.Pts)):PtsB[i][0] += this.orbitRadius
            
            sinP = m.sin(m.radians( this.orbitAngle ))
            cosP = m.cos(m.radians( this.orbitAngle ))
            PtsC = []
            for i in PtsB:PtsC.append([i[0] * cosP + i[2] * -1 * sinP , i[1] , i[2] * cosP + i[0] * 1 * sinP])
            
            sinY = m.sin(m.radians( this.oADirection))
            cosY = m.cos(m.radians( this.oADirection))
            PtsD = []
            for i in PtsC:PtsD.append([i[0] * cosY + i[1] * -1 * sinY , i[1] * cosY + i[0] * 1 * sinY , i[2] ])
            
            this.Pts = PtsD
        ###########################################################################################
        for i in this.polygons:
            i.append(this.color)
            i.append(this.lineColor)
        
        dinamicPoints.extend(this.Pts)
        polygons.extend(this.polygons)
    
    def rotateY(this,angle):
        sinY = m.sin(m.radians(angle))
        cosY = m.cos(m.radians(angle))
        Ptsa = []
        for i in this.Pts:Ptsa.append([i[0] * cosY + i[1] * -1 * sinY , i[1] * cosY + i[0] * 1 * sinY , i[2] ])
        this.Pts = Ptsa
    
    def rotateP(this,angle):
        sinP = m.sin(m.radians(angle))
        cosP = m.cos(m.radians(angle))
        Ptsa = []
        for i in this.Pts:Ptsa.append([i[0] * cosP + i[2] * -1 * sinP , i[1] , i[2] * cosP + i[0] * 1 * sinP])
        this.Pts = Ptsa
    
    def move(this):
        if this.hasCamera or this.other:
            global orbitCenter
        if not paused:
            if this.day  != 0:this.pos      += timewarp / this.day
            if this.year != 0:this.orbitPos += timewarp / this.year
        
        this.Pts = this.originPts
        
        this.rotateY( this.pos        )
        this.rotateP( this.angle      )
        this.rotateY( this.ADirection )
        this.rotateY(-this.oADirection)
        this.rotateP(-this.orbitAngle )
        this.rotateY(-this.orbitPos   )
        
        for i in range(len(this.Pts)):this.Pts[i][0] += this.orbitRadius
        
        this.rotateY( this.orbitPos   )
        this.rotateP( this.orbitAngle )
        this.rotateY( this.oADirection)
        
        if this.other:
            p = []
            for i in this.Pts:p.append([i[0] + orbitCenter[0],i[1] + orbitCenter[1],i[2] + orbitCenter[2]])
            this.Pts = p.copy()
        
        dinamicPoints.extend(this.Pts)
        
        if this.hasCamera:orbitCenter = this.Pts[-1]
    
    def light(this):
        for i in range(len(this.polygons)):
            if this.other:a = (this.Pts[this.center_i][0] ** 2 + this.Pts[this.center_i][1] ** 2 + this.Pts[this.center_i][2] ** 2) ** 0.5
            else:a = this.orbitRadius
            b = (center(this.polygons[i])[0] ** 2 + center(this.polygons[i])[1] ** 2 + center(this.polygons[i])[2] ** 2) ** 0.5
            
            if a > b:this.polygons[i][1] = this.color
            else    :this.polygons[i][1] = this.n_color
    
    def draw(this):
        polygons.extend(this.polygons)
###################################################################################################
Earth = sphere([ 50,100,255],[ 10, 50,150],( 50,100,255),(0,0,0),36,36,  6371  ,150000000,23.4392811,  0,0   ,0  ,  -86164.0989,-31556952,True ,False)
Sun   = sphere([255,255,  0],[255,255,  0],(255,  0,  0),(0,0,0),36,36,695000  ,        0, 0        ,  0,0   ,0  ,       0     ,        0,False,False)
Moon  = sphere([200,220,255],[ 30, 30, 30],(255,255,255),(0,0,0),36,36,  1737.4,   384400, 1.54     ,180,5.14,5.8,-2360448     , -2360448,False,True )

while running:
    for event in p.event.get():
        if event.type == p.QUIT:           running       = False
        if event.type == p.KEYDOWN:
            if event.key == p.K_UP:        upArrow       = 1
            if event.key == p.K_DOWN:      downArrow     = 1
            if event.key == p.K_s:         sKey          = 1
            if event.key == p.K_w:         wKey          = 1
            if event.key == p.K_d:         dKey          = 1
            if event.key == p.K_a:         aKey          = 1
            if event.key == p.K_q:         running       = False
            if event.key == p.K_ESCAPE:    hideCursor    = False
            if event.key == p.K_c:         cameraView    = not cameraView
            if event.key == p.K_t:         timewarp      = int(input("current timewarp is X" + str(timewarp) + " "))
            if event.key == p.K_p:         paused        = not paused
            if event.key == p.K_z:         zoom          = 6 - zoom
            if event.key == p.K_f:         speed         = 2005000 - speed
        if event.type == p.KEYUP:
            if event.key == p.K_UP:        upArrow       = 0
            if event.key == p.K_DOWN:      downArrow     = 0
            if event.key == p.K_s:         sKey          = 0
            if event.key == p.K_w:         wKey          = 0
            if event.key == p.K_d:         dKey          = 0
            if event.key == p.K_a:         aKey          = 0
        if event.type == p.MOUSEMOTION:    deltaX,deltaY = p.mouse.get_rel()
        if event.type == p.MOUSEBUTTONDOWN:hideCursor    = True
    
    if True:
        screen.fill((0,0,0))
        
        p.mouse.set_visible(not hideCursor)
        p.event.set_grab(hideCursor)
        
        pitch -= deltaY * sensitivity / zoom
        if pitch >  90:pitch =  90
        if pitch < -90:pitch = -90
        yaw   -= deltaX * sensitivity / zoom
        
        deltaX,deltaY = 0,0
        
        sinY = m.sin(m.radians(yaw  ))
        cosY = m.cos(m.radians(yaw  ))
        sinP = m.sin(m.radians(pitch))
        cosP = m.cos(m.radians(pitch))
        sinR = m.sin(m.radians(roll ))
        cosR = m.cos(m.radians(roll ))
        
        x += speed * (((sKey - wKey) * 0.1) * cosY + ((aKey - dKey) * 0.1) * sinY)
        y += speed * (((aKey - dKey) * 0.1) * cosY - ((sKey - wKey) * 0.1) * sinY)
        z += speed * (upArrow - downArrow)  * 0.1
        
        dinamicPoints = []
        polygons      = []
        points        = []
        
        Earth.move ()
        Sun  .move ()
        Moon .move ()
        
        points = staticPoints + dinamicPoints
        
        Earth.light()
        Moon .light()
        
        Earth.draw ()
        Sun  .draw ()
        Moon .draw ()
        
        pointsT  = []
        pointsR1 = []
        pointsR2 = []
        pointsR3 = []
        pointsP  = []
        
        if cameraView:
            
            cameraX = -points[cameraI][0]
            cameraY = -points[cameraI][1]
            cameraZ = -points[cameraI][2]
            
            dx = points[cameraI][0] - points[cameraIu][0]
            dy = points[cameraI][1] - points[cameraIu][1]
            dz = points[cameraI][2] - points[cameraIu][2]
            dw = (dx ** 2 + dy ** 2) ** 0.5
            
            yAW   = -m.degrees(m.atan2(dy,dx))
            pITCH =  m.degrees(m.atan2(dw,dz))
            
            SINy = m.sin(m.radians(yAW  ))
            COSy = m.cos(m.radians(yAW  ))
            SINp = m.sin(m.radians(pITCH))
            COSp = m.cos(m.radians(pITCH))
            
            points_t  = []
            points_r1 = []
            points_r2 = []
            points_r3 = []
            
            for i in points   :points_t .append([i[0] + cameraX                   , i[1] + cameraY                  , i[2] + cameraZ               ])
            for i in points_t :points_r1.append([i[0] * COSy  + i[1] * -1 * SINy  , i[1] * COSy  + i[0] * 1 * SINy  , i[2]                         ])
            for i in points_r1:points_r2.append([i[0] * COSp  + i[2] * -1 * SINp  , i[1]                            , i[2] * COSp + i[0] * 1 * SINp])
            
            y2 = -m.atan2(points_r2[cameraIs][1],points_r2[cameraIs][0])
            
            SINy2= m.sin(y2)
            COSy2= m.cos(y2)
            
            for i in points_r2:points_r3.append([i[0] * COSy2 + i[1] * -1 * SINy2 , i[1] * COSy2 + i[0] * 1 * SINy2 , i[2]                         ])
            
            pointsT = points_r3.copy()
        
        else:
            #print("7.2")
            cameraX = x
            cameraY = y
            cameraZ = z
            
            for i in points   :pointsT .append([i[0] + cameraX                 , i[1] + cameraY                , i[2] + cameraZ               ])
        
        for i in pointsT      :pointsR1.append([i[0] * cosY + i[1] * -1 * sinY , i[1] * cosY + i[0] * 1 * sinY , i[2]                         ])
        for i in pointsR1     :pointsR2.append([i[0] * cosP + i[2] * -1 * sinP , i[1]                          , i[2] * cosP + i[0] * 1 * sinP])
        for i in pointsR2     :pointsR3.append([i[0]                           , i[1] * cosR + i[2] * sinR     , i[2] * cosR + i[1] * sinR    ])
        for i in pointsR3     :
            if i[0] > 0:
                if abs(i[1] / i[0]) < a and abs(i[2] / i[0]) < b:
                    if isometric:pointsP.append([i[1] * 0.5,i[2] * 0.5])                      #isometric
                    else:pointsP.append([i[1] / i[0] * screenScale,i[2] / i[0] * screenScale])#perspective
                else:pointsP.append("a")
            else:pointsP.append("a")
        
        polygons.sort(key = distanceToCamera)
        
        for i in polygons:
            aa = []
            try:   lineColor = i[2]
            except:lineColor = (0,0,255)
            try:   color     = i[1]
            except:color     = (255,255,255)
            
            try:
                if   pointsP[i[0][0]] == pointsP[i[0][1]]:
                    if ((pointsP[i[0][1]][0] - pointsP[i[0][3]][0]) *
                        (pointsP[i[0][2]][1] - pointsP[i[0][3]][1]) -
                        (pointsP[i[0][2]][0] - pointsP[i[0][3]][0]) *
                        (pointsP[i[0][1]][1] - pointsP[i[0][3]][1])) < 0:
                        
                        for j in i[0]:aa.append([pointsP[j][0] * zoom + a * screenScale,pointsP[j][1] * zoom + b * screenScale])
                        p.draw.polygon(screen,color,aa,0)
#                        p.draw.polygon(screen,lineColor,aa,1)
                elif pointsP[i[0][0]] == pointsP[i[0][2]]:
                    if ((pointsP[i[0][1]][0] - pointsP[i[0][3]][0]) *
                        (pointsP[i[0][2]][1] - pointsP[i[0][3]][1]) -
                        (pointsP[i[0][2]][0] - pointsP[i[0][3]][0]) *
                        (pointsP[i[0][1]][1] - pointsP[i[0][3]][1])) < 0:
                        
                        for j in i[0]:aa.append([pointsP[j][0] * zoom + a * screenScale,pointsP[j][1] * zoom + b * screenScale])
                        p.draw.polygon(screen,color,aa,0)
#                        p.draw.polygon(screen,lineColor,aa,1)
                elif pointsP[i[0][1]] == pointsP[i[0][2]]:
                    if ((pointsP[i[0][0]][0] - pointsP[i[0][3]][0]) *
                        (pointsP[i[0][1]][1] - pointsP[i[0][3]][1]) -
                        (pointsP[i[0][1]][0] - pointsP[i[0][3]][0]) *
                        (pointsP[i[0][0]][1] - pointsP[i[0][3]][1])) < 0:
                        
                        for j in i[0]:aa.append([pointsP[j][0] * zoom + a * screenScale,pointsP[j][1] * zoom + b * screenScale])
                        p.draw.polygon(screen,color,aa,0)
#                        p.draw.polygon(screen,lineColor,aa,1)
                else:
                    if ((pointsP[i[0][0]][0] - pointsP[i[0][2]][0]) *
                        (pointsP[i[0][1]][1] - pointsP[i[0][2]][1]) -
                        (pointsP[i[0][1]][0] - pointsP[i[0][2]][0]) *
                        (pointsP[i[0][0]][1] - pointsP[i[0][2]][1])) < 0:
                        
                        for j in i[0]:aa.append([pointsP[j][0] * zoom + a * screenScale,pointsP[j][1] * zoom + b * screenScale])
                        p.draw.polygon(screen,color,aa,0)
#                        p.draw.polygon(screen,lineColor,aa,1)
            except:pass
        
        for i in lines:
            try:
                B = (pointsP[i[0]][0] * zoom + a * screenScale, pointsP[i[0]][1] * zoom + b * screenScale)
                C = (pointsP[i[1]][0] * zoom + a * screenScale, pointsP[i[1]][1] * zoom + b * screenScale)
            except:continue
            try:color = i[2]
            except:color = (255,255,255)
            try:line_width = i[3]
            except:line_width = 1
            p.draw.line(screen,color,B,C,line_width)
        
        try:p.draw.circle(screen,(255,255,255),(pointsP[cameraI ][0] * zoom + a * screenScale, pointsP[cameraI ][1] * zoom + b * screenScale),5,0)
        except:pass
        if cameraView:
            _xy = []
            try:
                xy = (pointsP[cameraIn][0] * zoom + a * screenScale, pointsP[cameraIn][1] * zoom + b * screenScale)
                p.draw.circle(screen,(255,255,255),xy,5,0)
                text            = font.render("N",True,(255,0,0),None)
                textRect        = text.get_rect()
                textRect.center = (xy[0],xy[1] - 32)
                screen.blit(text,textRect)
                _xy.append(xy)
            except:pass
            
            try:
                xy = (pointsP[cameraIs][0] * zoom + a * screenScale, pointsP[cameraIs][1] * zoom + b * screenScale)
                p.draw.circle(screen,(255,255,255),xy,5,0)
                text            = font.render("S",True,(255,0,0),None)
                textRect        = text.get_rect()
                textRect.center = (xy[0],xy[1] - 32)
                screen.blit(text,textRect)
                _xy.append(xy)
            except:pass
            
            try:
                xy = (pointsP[cameraIe][0] * zoom + a * screenScale, pointsP[cameraIe][1] * zoom + b * screenScale)
                p.draw.circle(screen,(255,255,255),xy,5,0)
                text            = font.render("E",True,(255,0,0),None)
                textRect        = text.get_rect()
                textRect.center = (xy[0],xy[1] - 32)
                screen.blit(text,textRect)
                _xy.append(xy)
            except:pass
            
            try:
                xy = (pointsP[cameraIw][0] * zoom + a * screenScale, pointsP[cameraIw][1] * zoom + b * screenScale)
                p.draw.circle(screen,(255,255,255),xy,5,0)
                text            = font.render("W",True,(255,0,0),None)
                textRect        = text.get_rect()
                textRect.center = (xy[0],xy[1] - 32)
                screen.blit(text,textRect)
                _xy.append(xy)
            except:pass
            
            try:
                xy = (pointsP[cameraIne][0] * zoom + a * screenScale, pointsP[cameraIne][1] * zoom + b * screenScale)
                p.draw.circle(screen,(255,255,255),xy,5,0)
                text            = font.render("NE",True,(255,0,0),None)
                textRect        = text.get_rect()
                textRect.center = (xy[0],xy[1] - 32)
                screen.blit(text,textRect)
                _xy.append(xy)
            except:pass
            
            try:
                xy = (pointsP[cameraInw][0] * zoom + a * screenScale, pointsP[cameraInw][1] * zoom + b * screenScale)
                p.draw.circle(screen,(255,255,255),xy,5,0)
                text            = font.render("NW",True,(255,0,0),None)
                textRect        = text.get_rect()
                textRect.center = (xy[0],xy[1] - 32)
                screen.blit(text,textRect)
                _xy.append(xy)
            except:pass
            
            try:
                xy = (pointsP[cameraIse][0] * zoom + a * screenScale, pointsP[cameraIse][1] * zoom + b * screenScale)
                p.draw.circle(screen,(255,255,255),xy,5,0)
                text            = font.render("SE",True,(255,0,0),None)
                textRect        = text.get_rect()
                textRect.center = (xy[0],xy[1] - 32)
                screen.blit(text,textRect)
                _xy.append(xy)
            except:pass
            
            try:
                xy = (pointsP[cameraIsw][0] * zoom + a * screenScale, pointsP[cameraIsw][1] * zoom + b * screenScale)
                p.draw.circle(screen,(255,255,255),xy,5,0)
                text            = font.render("SW",True,(255,0,0),None)
                textRect        = text.get_rect()
                textRect.center = (xy[0],xy[1] - 32)
                screen.blit(text,textRect)
                _xy.append(xy)
            except:pass
            
            try:
                hy = 0
                for i in _xy:
                    hy += i[1]
                hy /= len(_xy)
                p.draw.rect(screen,( 50,100,75),p.Rect(0,hy,width,height - hy),0)
            except:pass
            
            text = font.render(str(round((-yaw + 540) % 360)) + "  " + str(round(pitch)), True, (255,0,0), None)
            textRect        = text.get_rect()
            textRect.center = (a * screenScale,b * screenScale * 1.5)
            screen.blit(text, textRect)
        
        p.display.flip()
p.quit()