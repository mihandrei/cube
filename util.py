import geometry
from geometry import NI,NJ,NK

def read_pointset(s):
	s = [c for c in s.lower() if c in "xX."]
	pointset=set()

	for j in xrange(NJ):
		for k in xrange(NK):
			for i in xrange(NI):
				v = s[i+k*NI+j*NI*NK]
				if v == 'x':
					pointset.add((i,NJ-1-j,k))	

	return frozenset(pointset)
	
def print_pointset(pointset,c='x'):
	for j in xrange(NJ):
		for k in xrange(NK):
			for i in xrange(NI):
				if (i,NJ-1-j,k) in pointset:
					print 'x',
				else:
					print '.',
			print ' ',
		print 
	print
