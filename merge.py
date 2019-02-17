import json
import pdb
from pprint import pprint
import argparse
import numpy as np

def attrgetter(elem):
    return float(elem['ts'])


# def normalize(alist):
# 	for i,v in enumerate(alist):
# 		 if(i > 0):
# 		 	if(float(alist[i]['ts']) == float(alist[i-1]['ts'])):
# 		 		new = float(alist[i]['ts']) + 0.001
# 				alist[i]['ts'] = format("%.3f" % (new))

parser = argparse.ArgumentParser(description='Merge JSON transcripts.')
parser.add_argument('-l','--list', nargs='+', help='<Required> Set flag', required=True)
parser.add_argument('-o','--out', help='<Required> Set flag', required=True)

args = parser.parse_args()

print(args.list)

dataList = []
for f in args.list:
	with open(f) as file:
		data = json.load(file)
		dataList.append(data)

finalFormatArray = []
for i,v in enumerate(dataList): #data['formatArray']):
	# normalize(v['formatArray'])
	finalFormatArray = finalFormatArray + v['formatArray']
	

def insertionSort(alist):
   for index in range(1,len(alist)):

     currentvalue = alist[index]
     position = index

     while position>0 and float(alist[position-1]['ts'])>float(currentvalue['ts']):
         alist[position]=alist[position-1]
         position = position-1

     alist[position]=currentvalue

# finalFormatArray = sorted(finalFormatArray, key=attrgetter)
insertionSort(finalFormatArray)
# import pdb 
# for i,v in enumerate(finalFormatArray):
# 	# pdb.set_trace()
# 	if(finalFormatArray[i]['ts'] != dataList[0]['formatArray'][i]['ts']):
# 		print(i, finalFormatArray[i], dataList[0]['formatArray'][i])


a = dataList[0]
a['formatArray'] = finalFormatArray
with open(args.out, 'w') as outfile:
	json.dump(a, outfile)