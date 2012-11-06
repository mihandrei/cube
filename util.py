import geometry

def read_3pointset(s):
	s=s.strip()
	pointset=set()
	for j, sik in enumerate(s.split('\n')):		
		for k , si in enumerate(sik.split(' ')):
			for i, v in enumerate(si):
				if v == 'x':
					pointset.add((i,2-j,k))	
	return pointset
	
def print_3pointset(pointset):
	for j in xrange(3):
		for k in xrange(3):
			for i in xrange(3):
				if (i,2-j,k) in pointset:
					print 'x',
				else:
					print '.',
			print ' ',
		print 
	print
