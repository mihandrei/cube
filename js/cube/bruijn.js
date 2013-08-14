(function (){
    function min_key(v, keyfn){
        var m = keyfn(v[0]);

        for (var i = 1; i < v.length; i++) {
            var c = keyfn(v[i]);
            if(c < m){
                m = c;
            }
        }

        return m;
    }


    function min_by_dimension(dim, points){
        var minval = min_key(points, function(a){return a[dim];});
        return points.filter(function(a){return a[dim] == minval;});
    }

    function root_tiling(points){
        return min_by_dimension(0, min_by_dimension(1, min_by_dimension(2, points)))[0];
    }

    cube.bruijn_solver = function(pieces){
        var ROTS = [];
        var NI = pieces.box.NI;
        var NJ = pieces.box.NJ;
        var NK = pieces.box.NK;

        for (var i = 0; i < pieces.length; i++) {
            var rot = cube.geo.canonical(cube.geo.rotations(pieces[i]));
            rot.root = root_tiling(rot);
            ROTS[i] = rot;
        }
        //sort_rots_by_complexity()

        function next_bruijn_hole(hole){
            var ret = {x:hole.x, y:hole.y, z:hole.z};
            if(hole.x < NI - 1){
                ret.x += 1;
            }else if(hole.y < NJ - 1){
                ret.x = 0;
                ret.y += 1;
            }else if(hole.z < NK - 1){
                ret.x = 0;
                ret.y = 0;
                ret.z += 1;
            }else{
                return null;
            }
            return ret;
        }

        function next_free_hole(state){
            var hole;
            do{
                hole = next_bruijn_hole(state.bruijn_hole);
            }while(hole && set_in(hole, state.union));
            return hole;
        }

        function fits(rot, hole, state){
            var image = cube.geo.translate_piece(rot, hole - rot.root);
            //if (any image cublet in state.union or outside the cube){
            for (var i = 0; i < image.length; i++) {
                var cublet = image[i];
                if (cublet[0] < 0 || cublet[0] >= NI ||
                    cublet[1] < 0 || cublet[1] >= NJ ||
                    cublet[2] < 0 || cublet[2] >= NK ||
                    set_in(cublet, state.union)){
                        return null;
                }
            }
            return image;
        }


    //state = {plasate [{pieceid:2, rot:3, bruijn_hole:xyz}] remaining : pieceids}

        function successors(state){
            var ret = [];
            var bruijn_hole = next_free_hole();
            if(!bruijn_hole) return [];

            //generate canditates
            for (var pieceId = 0; pieceId < state.remaining.length; pieceId++) {
                for (var i = 0; i < ROTS[pieceId].length; i++) {
                    var rot = ROTS[pieceId][i];
                    //test
                    if(fits(rot, bruijn_hole)){
                        var placed = state.placed.slice();
                        placed.push({pieceId:pieceId, rot:i, bruijn_hole:bruijn_hole});

                        var rem = state.remaining.slice();
                        rem.splice(pieceId, 1);

                        var newstate = {
                            placed : placed,
                            remaining : rem,
                            union : set_union(state.union, rot),
                            bruijn_hole : bruijn_hole
                        };
                        ret.push(newstate);
                    }
                }
            }

            return ret;
        }

        return {search:search};
    };

})();
