import colorsys


def kontrast(barva):
    return 255 - barva[0], 255 - barva[1], 255 - barva[2]


def crnobelo(barva):
    if sum(list(barva)) / 3 < 130:
        return "white"
    else:
        return "black"


def hsv2rgb(h, s, v):
    return tuple(round(i * 255) for i in colorsys.hsv_to_rgb(h, s, v))
