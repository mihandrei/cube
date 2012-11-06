from geometry import translations, rotations
from util import read_3pointset, print_3pointset

PL = """
... ... ...
x.. ... ...
xx. x.. x..
"""

def main():
	ps = read_3pointset(PL)	
	print_3pointset(ps)

	for tr in translations(ps):
		print_3pointset(tr)

	print 'rotations'

	for r in rotations(ps):
		print_3pointset(r)
		
if __name__ == '__main__':
	main()