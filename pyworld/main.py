from Track import *
from Car import *
from CarAI import *
from CarFromData import *
from Monaco import setupMonaco

track = setupMonaco()
car = CarAI(track)
car.nn.importState("../data/testnn.json")

steps = 0
def step():
	global steps
	if car.gameOver:
		print(car.x, car.y)
	else:
		car.control()
		car.move()
		car.updateScore()
		if car.checkCollision() or car.score > 2000:
			car.gameOver = True
		steps += 1

while not car.gameOver:
	step()

print(car.score, car.x, car.y)