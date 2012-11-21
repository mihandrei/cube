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

pieces = [read_pointset(pstr) for pstr in pieces]

CONFIGS = []

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

def compute_score(state):
    if len(state) < len(pieces):
        return -1
    
    config_pieces = [set(CONFIGS[pieceid][configid]) for pieceid, configid in enumerate(state)]

    if set.union(*config_pieces) == FULLCUBE:        
        return 1
    elif set.intersection(*config_pieces) != set():
        print "A"        
    else:
        return 0

def sucessors(s):
    s = s[:]
    pieceid = len(s)    
    if pieceid == len(pieces):
        return [] # no more sucessors
    else:
        return [s + [i] for i in xrange(len(CONFIGS[pieceid]))]

def search(state):
    for s in sucessors(state):
        score = compute_score(s)
        if score == 1: #win
            yield s
        elif score == -1 : #overlap no possible solution
            continue            
        else:
            for s in search(s):
                yield s 

def main():
    #describe_piece_simmetry(pieces[0])    
    print "precompute all piece configurations"
    global CONFIGS
    CONFIGS = [list(all_configurations(p)) for p in pieces]
    
    #print sucessors ([0,1])
    #print score([1,1,3])
    for s in search([]):
        print s
        
if __name__ == '__main__':
    main()