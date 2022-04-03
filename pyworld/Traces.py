import os
import json

tracepath = "../data"

def clearTraces():
	
	files = os.listdir(tracepath)
	tracefiles = [f for f in files if f.startswith("traces") and f.endswith(".json")]
	for t in tracefiles:
		os.remove(tracepath + "/" + t)

def saveTraces(cars, generation=0):
	traces = []
	for car in cars:
		traces.append(car.traces)
	f = open(tracepath + "/traces"+str(generation)+".json", "w")
	json.dump(traces, f)
	f.close()
