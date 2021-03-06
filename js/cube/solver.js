(function() {
    var NI = cube.geo.NI,
        NJ = cube.geo.NJ,
        NK = cube.geo.NK;

    function fullcube(){
        var ret = [];
        for (var i = 0; i < NI ; i++){
            for (var j = 0; j < NJ ; j++){
                for (var k = 0; k < NK; k++){
                    ret.push([i, j, k]);
                }
            }
        }
        return ret;
    }

    function sort_by_bbox(pieces){
        function compare(a, b){
            var ba = cube.math.bbox(a);
            var bb = cube.math.bbox(b);
            return  bb.dx*bb.dy*bb.dz - ba.dx*ba.dy*ba.dz;
        }
        pieces.sort(compare);
    }

    var FULLCUBE = fullcube();
    FULLCUBE.sort();

    cube.solve = function(pieces, on_win){
        var nevals = 0;
        var CONFIGS = [];
        // sort pieces decreasing in volume of their bounding box
        sort_by_bbox(pieces);

        // do not generate rotations for first piece
        // doing so leads to 27 solutions that are rotations of the same.
        CONFIGS.push(cube.geo.translations(pieces[0]));

        //compute all configs for the rest
        for (var i = 1; i < pieces.length; i++) {
            CONFIGS.push(cube.geo.configurations(pieces[i]));
        }


        function state2pieces(state){
            var pieces = [];
            for (var piece_id = 0; piece_id < state.length; piece_id++) {
                var config_id = state[piece_id];
                var config_piece = CONFIGS[piece_id][config_id];
                pieces.push(config_piece);
            }
            return pieces;
        }


        function successors(state){
            var pieceid = state.length;

            if (pieceid === pieces.length) {
                return [];
            }

            var ret = [];

            for (var i = 0; i < CONFIGS[pieceid].length; i++) {
                var newstate = state.slice();
                newstate.push(i);
                ret.push(newstate);
            }

            return ret;
        }


        function evaluate(state){
            nevals += 1;

            if (state.length > pieces.length){
                return -1;
            }

            var union = [];
            var config_pieces = state2pieces(state);

            for (var i = 0; i < config_pieces.length; i++) {
                var config_piece = config_pieces[i];

                var intersection = cube.math.set_intersection(union, config_piece, cube.math.v_eq);
                if ( ! cube.math.v_eq(intersection, [])) {
                    return -1;
                } else{
                    union = cube.math.set_union(union, config_piece, cube.math.v_eq);
                }
            }

            union.sort();

            if (cube.math.matrix_eq(union, FULLCUBE)) {
                return 1;
            } else{
                return 0;
            }

        }


        function search(state){
            var succ = successors(state);
            for (var i = 0; i < succ.length; i++) {
                var score = evaluate(succ[i]);
                if (score === 1) {
                    var shouldcontinue = on_win(state2pieces(succ[i]));
                    if (!shouldcontinue){
                        return;
                    }
                } else if (score === -1) {
                    continue;
                } else {
                    search(succ[i]);
                }
            }
        }

        search([]);

        console.log(nevals);
        console.log(CONFIGS);
    };

})();