import binascii
from PIL import Image
import numpy as np
import scipy
import scipy.misc
import scipy.cluster
import discord
import urllib
import json
import random

NUM_CLUSTERS = 5

def read_json_file(path):
    with open(path, 'r') as f:
        return json.load(f)


def get_color(pic_path):
    im = Image.open(pic_path)
    im = im.resize((150, 150))      
    ar = np.asarray(im)
    shape = ar.shape
    ar = ar.reshape(scipy.product(shape[:2]), shape[2]).astype(float)


    codes, dist = scipy.cluster.vq.kmeans(ar, NUM_CLUSTERS)


    vecs, dist = scipy.cluster.vq.vq(ar, codes)         
    counts, bins = scipy.histogram(vecs, len(codes))    

    index_max = scipy.argmax(counts)                    
    peak = codes[index_max]
    color = binascii.hexlify(bytearray(int(c) for c in peak)).decode('ascii')
    col = discord.Color(value=int(color, 16))
    return col

def get_color_from_member(member):
    print(member.avatar)

    ''' urllib.request.urlretrieve(url, "./Photos/temp.png")
    im = Image.open(".Photos/temp.png")
    im = im.resize((150, 150))
    ar = np.asarray(url)
    shape = ar.shape
    ar = ar.reshape(scipy.product(shape[:2]), shape[2]).astype(float)


    codes, dist = scipy.cluster.vq.kmeans(ar, NUM_CLUSTERS)


    vecs, dist = scipy.cluster.vq.vq(ar, codes)         
    counts, bins = scipy.histogram(vecs, len(codes))    

    index_max = scipy.argmax(counts)                    
    peak = codes[index_max]
    color = binascii.hexlify(bytearray(int(c) for c in peak)).decode('ascii')
    col = discord.Color(value=int(color, 16))
    return col'''


def get_color_from_url(url):

    urllib.request.urlretrieve(url, "./Photos/temp.png")
    im = Image.open(".Photos/temp.png")
    im = im.resize((150, 150))
    ar = np.asarray(url)
    shape = ar.shape
    ar = ar.reshape(scipy.product(shape[:2]), shape[2]).astype(float)


    codes, dist = scipy.cluster.vq.kmeans(ar, NUM_CLUSTERS)


    vecs, dist = scipy.cluster.vq.vq(ar, codes)         
    counts, bins = scipy.histogram(vecs, len(codes))    

    index_max = scipy.argmax(counts)                    
    peak = codes[index_max]
    color = binascii.hexlify(bytearray(int(c) for c in peak)).decode('ascii')
    col = discord.Color(value=int(color, 16))
    return col

def get_footer():
    data = read_json_file('data/global_config.json')
    footer = data["footers"]
    return random.choice(footer)


# for paste
import postbin
def mainSync(): 
    url = postbin.postSync(f"FooBar Bazz 2")
    print(f"Your paste is located at {url}")