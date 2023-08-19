def prilet(a, b, cas=1):
    # print(a, b)
    x_r = b[0] - a[0]
    y_r = b[1] - a[1]
    x = f"t * {x_r / cas}"
    y = f"t * {y_r / cas}"
    b = "self.besedilo"
    # print(x_r, y_r)
    return x, y, b


def natipkanje(a, b, cas=1):
    x = "0"
    y = "0"
    b = f"self.besedilo[0:(round(t * 10 // {cas / 10}) // 1)]"
    return x, y, b
