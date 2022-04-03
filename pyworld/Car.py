import math
id = 0
sign = lambda x: x and (-1 if x < 0 else 1)

class Car:

	def __init__(self, track):
		global id
		self.track = track
		self.id = id
		id += 1
		self.traces = []
		self.reset()

	def reset(self):
		start = self.track.getStartPosition()
		self.x = start["x"]
		self.y = start["y"]
		self.rot = start["rot"]
		self.v = 0.1
		self.acc = 0
		self.steer = 0
		self.score = 0
		self.lastCheckPoint = 0
		self.gameOver = False

	def move(self):
		dt = 0.1
		self.v = 0.99 * self.v + 0.08 * self.acc
		self.rot = (self.rot + 0.03 * self.steer * sign(self.v)) % (2*math.pi)
		self.x += math.cos(self.rot) * self.v * dt
		self.y += math.sin(self.rot) * self.v * dt
		self.traces.append([self.x, self.y, self.rot])

	def checkCollision(self):
		return self.track.getOffset(self.x, self.y) > 0.5 * self.track.width

	def updateScore(self):
		checkPoint = self.track.getCheckPoint(self.x, self.y)
		if checkPoint > self.lastCheckPoint and checkPoint < self.lastCheckPoint + 10:
			self.score += checkPoint - self.lastCheckPoint
			self.lastCheckPoint = checkPoint
		if checkPoint < 0.05 * self.lastCheckPoint:
			self.score += 0.1
			self.lastCheckPoint = checkPoint
		return self.score

	# updateScore() {
	# 	return self.track.getScoreFromPoint(self.x, self.y)
	# }

	def getScans(self):
		scans = []
		for l in range(5):
			dir = self.rot + 0.25 * (l-2) * math.pi
			dist = self.track.scan(self.x, self.y, dir)["dist"]
			scans.append(0.5 * dist)
		return scans

	def getLifetime(self):
		return len(self.traces)
