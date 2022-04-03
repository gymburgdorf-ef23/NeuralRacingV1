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
        #print("createNeuralNetwork")
        self.inputsize = inputsize
        self.weights = []
        self.biases = []
        self.activations = []
        self.lastlayersize = inputsize
        self.countlayers = 0

    def feedForward(self, inputs):
        for layer in range(self.countlayers):
            previousactivations = inputs if layer == 0 else self.activations[layer-1]
            neurons = self.weights[layer]
            for neuron in range(len(neurons)):
                arrows = neurons[neuron]
                activation = 0
                for arrow in range(len(arrows)):
                    weight = arrows[arrow]
                    activation += weight*previousactivations[arrow]
                activation += self.biases[layer][neuron]
                self.activations[layer][neuron] = sigmoid(activation)
        return self.activations[self.countlayers-1]

    def addLayer(self, size):
        newweights = []
        newbiases = []
        newactivations = []
        for i in range(size):
            newarrows = []
            for j in range(self.lastlayersize):
                newarrows.append(-1+2*random.random())
            newweights.append(newarrows)
            newbiases.append(-1+2*random.random())
            newactivations.append(0)
        self.weights.append(newweights)
        self.biases.append(newbiases)
        self.activations.append(newactivations)
        self.lastlayersize = size  
        self.countlayers += 1 
        #print("addLayer")

    def importFromFile(self, file):
        f = open(file)
        self.importState(json.load(f))
        f.close()

    def importState(self, state):
        self.weights = state["weights"]
        self.biases = state["biases"]

    def exportToFile(self, file):
        f = open(file, "w")
        data = json.dumps({"weights": self.weights, "biases": self.biases})
        f.write(data)
        f.close()

    def clone(self):
        nn = NeuralNetwork(self.inputsize)
        nn.activations = deepcopy(self.activations)
        nn.weights = deepcopy(self.weights)
        nn.biases = deepcopy(self.biases)
        nn.lastlayersize = self.lastlayersize  
        nn.countlayers = self.countlayers
        return nn

    
    def randomAdjust(self, amount):
        for l in range(self.countlayers):
            for n in range(len(self.weights[l])):
                self.biases[l][n] += random.normalvariate(0, amount)
                for a in range(len(self.weights[l][n])):
                     self.weights[l][n][a] += random.normalvariate(0, amount)

"""
nn = NeuralNetwork(6)
nn.addLayer(4)
nn.addLayer(2)
output = nn.feedForward([0.5, 0.5, 0.5,  0.5, 0.5, 0.5])
print(output)
"""