from Car import Car
from NeuralNetwork import NeuralNetwork

class CarAI(Car):

	def __init__(self, track):
		super().__init__(track)
		self.nn = NeuralNetwork(6)
		self.nn.addLayer(4)
		self.nn.addLayer(2)

	def control(self):
		scans = self.getScans()
		results = self.nn.feedForward([*scans, self.v])
		self.acc = -1 + 2 * results[0]
		self.steer = -1 + 2 * results[1]
