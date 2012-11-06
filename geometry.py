NI = 3
NJ = 3
NK = 3
dimensions=3

#======translations=======
def bbox(pointset):
	"returns the bounding box of the subset of points"
	dims = [[] for _ in xrange(dimensions)]
	for point in pointset:
		for dimension , coord in enumerate(point):
			dims[dimension].append(coord)
	
	return [1 + max(dim) - min(dim) for dim in dims]

def translate(pointset, tr_vector):
	def vector_add(v):
		return tuple(tr_vector[dim] + v[dim] for dim in xrange(dimensions))

	return set(vector_add(point) for point in pointset)

def translations(canonical_piece):
	bi,bj,bk = bbox(canonical_piece)

	for di in xrange(1+ NI - bi):
		for dj in xrange(1+NJ - bj):
			for dk in xrange(1+NK - bk):
				yield translate(canonical_piece, (di, dj, dk))	

#=======rotations=========
def mmul(a,b):	
	rng = range(len(a))
	ret = [[0,0,0,0] for _ in rng]

	for r in rng:
		for c in rng:			
			ret[r][c] = sum(a[r][i] * b[i][c] for i in rng)

	return ret

#different for mmul to avoid column vectors or transposes
#also hides the homogenous coordonate
def vmul(m,v):
	v = list(v)
	v.append(1) #homog coord
	rng = range(len(m))
	ret = [0,0,0,0]

	for r in rng:		
		ret[r] = sum(m[r][i] * v[i] for i in rng)

	return tuple(ret[:-1])

def mtuple(m):
	return tuple(tuple(c for c in l) for l in m)

#rotation-translation matrices by 90 degrees,
# homogeneous coordonates
rotz = [[0,-1, 0, NJ-1 ],
	    [1, 0, 0, 0    ],
		[0, 0, 1, 0    ],
		[0, 0, 0, 1    ]]

rotx = [[1, 0,  0, 0    ],
	    [0, 0, -1, NK-1 ],
		[0, 1,  0, 0    ],
		[0, 0,  0, 1    ]]

roty = [[ 0, 0,  1, 0    ],
	    [ 0, 1,  0, 0    ],
		[-1, 0,  0, NI-1 ],
		[ 0, 0,  0, 1    ]]

rotid = [[ 1, 0, 0, 0    ],
	     [ 0, 1, 0, 0    ],
		 [ 0, 0, 1, 0    ],
		 [ 0, 0, 0, 1    ]]

rotx2 = mmul(rotx,rotx)
rotx3 = mmul(rotx2,rotx)
roty2 = mmul(roty,roty)
roty3 = mmul(roty2,roty)
rotz2 = mmul(rotz,rotz)
rotz3 = mmul(rotz2,rotz)

#rotation bases
x_rotations = [rotid, rotx, rotx2, rotx3]
y_rotations = [rotid, roty, roty2, roty3]
z_rotations = [rotid, rotz, rotz2, rotz3]

#all rotations in the S4 group
#if i knew about S4 before i would have copied 
#the matrixes; well like this it is more obvious how
#the matrices were obtained
all_rotations = set()

for xr in x_rotations:
	for yr in y_rotations:
		for zr in z_rotations:
			all_rotations.add( mtuple( mmul( mmul(xr,yr), zr) ))

def rotations(canonical_piece):
	for rm in all_rotations:
		yield set( vmul(rm, point) for point in canonical_piece )

def main():
	z = [0,0,0]
	a = [2,0,0]
	b = [2,2,2]
	
	for r in [z,a,b]:
		print r
		print 'x', vmul(rotx, r)	
		print 'y',vmul(roty, r)
		print 'z',vmul(rotz, r)
		print
	
	print 'len s4', len(all_rotations)

if __name__ == '__main__':
	main()				