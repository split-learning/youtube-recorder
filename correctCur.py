import json
import pdb
from pprint import pprint

with open('sketch.js.json') as f:
    data = json.load(f)

for i,v in enumerate(data['formatArray']):
	v['file'] = "sketch.js"
	if(v['op'] == 'cur'):
		data['formatArray'][i] = v
	

with open('data.json', 'w') as outfile:
    json.dump(data, outfile)