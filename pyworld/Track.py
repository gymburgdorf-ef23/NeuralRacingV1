import math
sign = lambda x: x and (-1 if x < 0 else 1)


def getParam(x, y, x1, y1, x2, y2):
	Ax = x - x1
	Ay = y - y1
	Bx = x2 - x1
	By = y2 - y1

	dotProduct = Ax * Bx + Ay * By
	len_sq = Bx ** 2 + By ** 2
	return dotProduct / len_sq if len_sq > 0 else  0


def getDistSqr(x, y, x1, y1, x2, y2):
	param = getParam(x, y, x1, y1, x2, y2)

	if param < 0:
		param = 0
	if param > 1:
		param = 1

	px = x1 + param * (x2 - x1)
	py = y1 + param * (y2 - y1)

	dx = x - px
	dy = y - py
	return dx * dx + dy * dy

class Track:

	def __init__(self, points, width):
		self.points = points
		self.width = width
		self.distCache = {}
		#self.prepareScores()

	def getStartPosition(self):
		p0 = self.points[0]
		p1 = self.points[1]
		rot = math.atan2(p1[1] - p0[1], p1[0] - p0[0])
		return {
			"x": p0[0],
			"y": p0[1],
			"rot": rot
		}

	def getExactOffset(self, x, y) :
		dSqrMin = float("inf")
		points = self.points
		for i in range(len(points)):
			x1, y1 = points[i]
			x2, y2 = points[(i+1) % len(points)]
			dSqr = getDistSqr(x, y, x1, y1, x2, y2)
			if dSqr < dSqrMin:
				dSqrMin = dSqr
		return dSqrMin ** 0.5

	def getOffset(self, x, y):
		rx = round(x)
		ry = round(y)
		key = str(rx) + "_" + str(ry)
		cached = self.distCache[key] if key in self.distCache else False 
		if cached and cached < 0.9 * self.width:
			return cached
		else:
			dist = self.getExactOffset(x, y)
			rounddist = self.getExactOffset(rx, ry)
			self.distCache[key] = rounddist
			return rounddist if dist < 0.9 * self.width else dist

	def scan(self, x0, y0, dir):
		rmax = self.width / 2
		x = x0
		y = y0
		r = self.getOffset(x, y)
		while r < rmax - 1e-2:
			maxStep = rmax - r
			x += maxStep * math.cos(dir)
			y += maxStep * math.sin(dir)
			r = self.getOffset(x, y)
		
		dist = ((x-x0)**2 + (y-y0)**2)**0.5
		return {"x": x, "y": y, "dist": dist}

	def getCheckPoint(self, x, y):
		dmin = float("inf")
		checkPoint = 0
		points = self.points
		for i in range(len(points)):
			x1, y1 = points[i]
			x2, y2 = points[(i+1) % len(points)]
			d = getDistSqr(x, y, x1, y1, x2, y2)
			if(d < dmin):
				dmin = d
				checkPoint = i + getParam(x, y, x1, y1, x2, y2)
		return checkPoint

	def addPointToScores(self, x, y, score):
		key = (x,y)
		maxDist = 0.7 if score == 0 else 0.5
		if self.getExactOffset(x, y) <= maxDist * self.width and not key in self.scores:
			self.scores[key] = score
			return True
		return False

	def prepareScores(self):
		startpos = self.getStartPosition()
		x = startpos["x"]
		y = startpos["y"]
		rot = startpos["rot"]
		key = (x,y)
		self.scores = {key: 0}
		dx = math.sin(rot) #sin for 90° rot!
		dy = -math.cos(rot)  #-cos for 90° rot!
		pending = []

		# Line with score 0
		nextScore = 0
		for i in range(math.floor(-0.6*self.width), math.ceil(0.6*self.width+1)):
			xP = round(x + i*dx)
			yP = round(y + i*dy)
			self.addPointToScores(xP, yP, nextScore)
		
		# Line with score 1
		nextScore = 1
		for i in range(math.floor(-0.6*self.width), math.ceil(0.6*self.width+1)):
			horizontal = abs(math.tan(rot)) < 1
			xP = round(x - i*dx) + (sign(math.cos(rot)) if horizontal else 0)
			yP = round(y - i*dy) + (0 if horizontal else sign(math.sin(rot)))
			if self.addPointToScores(xP, yP, nextScore):
				pending.append([xP, yP])
		
		# Fill score using Breadth First Search
		while len(pending) > 0:
			nextPending = []
			nextScore += 1
			for point in pending:
				x, y = point
				for delta in [[1,0], [0,1], [-1, 0], [0, -1]]:
					dx, dy = delta
					xP = x + dx 
					yP = y + dy 
					if self.addPointToScores(xP, yP, nextScore):
						nextPending.append([xP, yP])

			pending = nextPending
		print(self.scores)

	def getScoreFromPoint(self, x, y):
		key = (round(x), round(y))
		return self.scores[key]
