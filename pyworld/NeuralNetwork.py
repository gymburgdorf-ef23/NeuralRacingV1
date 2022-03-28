import json
import math
import random

def sigmoid(x):
    return 1/(1+math.exp(-x))

class NeuralNetwork:
    def __init__(self, inputsize):
        print("createNeuralNetwork")
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
        print("addLayer")

    def importState(self, file):
        f = open(file)
        data = json.load(f)
        f.close()
        self.weights = data["weights"][1:]
        self.biases = data["biases"][1:]
"""
nn = NeuralNetwork(6)
nn.addLayer(4)
nn.addLayer(2)
output = nn.feedForward([0.5, 0.5, 0.5,  0.5, 0.5, 0.5])
print(output)
"""