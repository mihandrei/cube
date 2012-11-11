import geometry

def read_pointset(s):
	s=s.strip()
	pointset=set()
	for j, sik in enumerate(s.split('\n')):		
		for k , si in enumerate(sik.split(' ')):
			for i, v in enumerate(si):
				if v == 'x':
					pointset.add((i,2-j,k))	
	return frozenset(pointset)
	
def print_pointset(pointset):
	for j in xrange(geometry.NJ):
		for k in xrange(geometry.NK):
			for i in xrange(geometry.NI):
				if (i,geometry.NJ-1-j,k) in pointset:
					print 'x',
				else:
					print '.',
			print ' ',
		print 
	print
