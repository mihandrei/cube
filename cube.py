from geometry import translations, rotations, FULLCUBE
from util import read_pointset, print_pointset
import functools
pieces = ["""
.... .... .... ....
x... .... .... ....
xx.. x... .... ....
""",
"""
xx.. .... .... ....
.xx. .... .... ....
.... .... .... ....
""",
"""
..xx xxxx xxxx xxxx
...x xxxx xxxx xxxx
..xx .xxx xxxx xxxx
"""
]

def memoize(obj):
    cache = obj.cache = {}
 
    @functools.wraps(obj)
    def memoizer(*args, **kwargs):
        if args not in cache:
            cache[args] = obj(*args, **kwargs)
        return cache[args]
    return memoizer

pieces = [read_pointset(pstr) for pstr in pieces]

@memoize
def all_configurations(ps):    
    ret = set()    
    for r in rotations(ps):
        ret.update(translations(r))
    return ret

def describe_piece_simmetry(piece_str):
    ps = read_pointset(piece_str)    
    print_pointset(ps)

    print 'translations', len(list(translations(ps)))    
    print 'rotations', len(rotations(ps))    
    print 'all_configurations', len(all_configurations(ps))

def is_goal(state):
    if len(state) < len(pieces):
        return False
    
    union = set()
    
    for pieceid in state:
        union.update(pieces[pieceid])

    return union == FULLCUBE

def sucessors(s):
    pieceid = len(s)    
    if pieceid == len(pieces):
        return [] # no more sucessors
    else:
        return all_configurations(pieces[pieceid])    

def search(state):
    for s in sucessors(state):
        if is_goal(s):
            yield s
        else:
            for s in search(s):
                yield s 

def main():
    #describe_piece_simmetry(pieces[0])
    for s in search([]):
        print s
        
if __name__ == '__main__':
    main()