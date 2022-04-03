import json
import math
import random
from copy import deepcopy

def sigmoid(x):
    if x < 0:
        return 1 - 1 / (1 + math.exp(x))
    return 1 / (1 + math.exp(-x))

class NeuralNetwork:
    def __init__(self, inputsize):
        self.inputsize = inputsize
        self.weights = []
        self.biases = []

    def feedForward(self, inputs):
        return [0.5 + 0.5 * random.random(), random.random()] # [acc, steer]

    def addLayer(self, size):
        pass

    def clone(self):
        return self

    
    def randomAdjust(self, howmuch):
        pass

"""
nn = NeuralNetwork(6)
nn.addLayer(4)
nn.addLayer(2)
output = nn.feedForward([0.5, 0.5, 0.5,  0.5, 0.5, 0.5])
"""
