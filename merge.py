import json
import pdb
from pprint import pprint
import argparse
import numpy as np

def attrgetter(elem):
    return elem['ts']


parser = argparse.ArgumentParser(description='Merge JSON transcripts.')
parser.add_argument('-l','--list', nargs='+', help='<Required> Set flag', required=True)

args = parser.parse_args()

print(args.list)

dataList = []
for f in args.list:
	with open(f) as file:
		data = json.load(file)
		dataList.append(data)

finalFormatArray = []
for i,v in enumerate(dataList): #data['formatArray']):
	finalFormatArray = finalFormatArray + v['formatArray']
	

sorted(finalFormatArray, key=attrgetter)
a = dataList[0]
a['formatArray'] = finalFormatArray
with open('data.json', 'w') as outfile:
	json.dump(a, outfile)