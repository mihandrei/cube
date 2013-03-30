from geometry import translations, rotations, FULLCUBE
from util import read_pointset, print_pointset
import functools

pieces = """
. . . .  . . . .  . . . .  . . . .
. . . .  . . . .  . . . .  . . . .
x . . .  . . . .  . . . .  . . . .
x x . .  x . . .  . . . .  . . . .

. . . .  . . . .  . . . .  . . . .
x x . .  . . . .  . . . .  . . . .
. x x .  . . . .  . . . .  . . . .
. . . .  . . . .  . . . .  . . . .

x x x x  x x x x  x x x x  x x x x
. . x x  x x x x  x x x x  x x x x
. . . x  x x x x  x x x x  x x x x
. . x x  . x x x  x x x x  x x x x
""".split("\n\n")


pieces = [read_pointset(pstr) for pstr in pieces]

CONFIGS = []


def all_configurations(ps):
    ret = set()
    for r in rotations(ps):
        ret.update(translations(r))
    return ret


def describe_piece_simmetry(ps):
    print_pointset(ps)
    print 'translations', len(list(translations(ps)))
    print 'rotations', len(rotations(ps))
    print 'all_configurations', len(all_configurations(ps))


def compute_score(state):
    if len(state) > len(pieces):
        return -1

    config_pieces = [set(CONFIGS[pieceid][configid]) for pieceid, configid in enumerate(state)]

    union = set()

    for conf in config_pieces:
        if union & conf != set():
            #this piece will intersect a previous one
            return -1
        else:
            union.update(conf)

    if union == FULLCUBE:
        return 1
    else:
        return 0


def sucessors(s):
    s = s[:]
    pieceid = len(s)
    if pieceid == len(pieces):
        return []  # no more sucessors
    else:
        return [s + [i] for i in xrange(len(CONFIGS[pieceid]))]


def search(state):
    for s in sucessors(state):
        score = compute_score(s)
        if score == 1:  # win
            yield s
        elif score == -1:  # overlap no possible solution
            continue
        else:
            for s in search(s):
                yield s

def test_simetry():
    describe_piece_simmetry(pieces[0]) 
    
    
def test_succesors():
    print sucessors ([0, 0])

    
def test_evaluation():
    print compute_score([0, 0, 0])
    print_pointset(CONFIGS[0][0])
    print_pointset(CONFIGS[1][0])
    print_pointset(CONFIGS[2][0])
    

def main():   
    print "precompute all piece configurations"
    global CONFIGS
    CONFIGS = [list(all_configurations(p)) for p in pieces]

    for s in search([]):
        for pieceid, configid in enumerate(s):
            print_pointset(CONFIGS[pieceid][configid])
            print
        print "=" * 8

if __name__ == '__main__':
    main()
