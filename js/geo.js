/*
 diferenta fata de python
 1. valeu n-am structuri
  - nu sunt tuple deci nu avem egalitate structurala
  - nu exista o notiune de egalitate standard a la java .equals
    nici hash, nici compare
  - nu exista hashmap , hashset
  - doar hackuri ce transforma obj in stringuri unice si le trnateste in un {}
  Nu am multimi asa mari, implementez setul cu un array. o(n)
  pt o piesa rot:24 trans:64

  mult de configuratii e mare todo think
*/


(function(){
    var NI = 4,
        NJ = 4,
        NK = 4;

    function rotate_piece(points, matrix){
        var ret = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            ret.push(cube.math.vmul(matrix, point));
        }
        //it will sort the vectors as strings
        //since NI NJ NK < 10 this is sane
        ret.sort();
        return ret;
    }


    function translate_piece(points, tr_vector){
        return rotate_piece(points, cube.math.translation_matrix(tr_vector));
    }


    function canonical(piece){
        var bb = cube.math.bbox(piece);
        var ret = translate_piece(piece, [-bb.xmin, -bb.ymin, -bb.zmin]);
        ret.bbox_dimensions = [1 + bb.xmax - bb.xmin, 1 + bb.ymax - bb.ymin, 1 + bb.zmax - bb.zmin];
        return ret;
    }


    function translations(piece){
        piece = canonical(piece);
        var bb = piece.bbox_dimensions;
        var bi = bb[0], bj = bb[1], bk = bb[2];
        var ret = [];

        for (var di = 0; di < 1 + NI - bi; di++){
            for (var dj = 0; dj < 1 + NJ - bj; dj++){
                for (var dk = 0; dk < 1 + NK - bk; dk++){
                    ret.push(translate_piece(piece, [di, dj, dk]));
                }
            }
        }

        return ret;
    }

    // Returns the set of all rotations of the piece within the cube.
    // The cardinality of the set depends on the piece simmetry. 1..24
    function rotations(piece){
        var rotationset = [];

        for (var i = 0; i < cube.math.s4.length; i++) {
            var rp = rotate_piece(piece, cube.math.s4[i]);
            cube.math.set_add(rotationset, rp, cube.math.matrix_eq);
        }

        return rotationset;
    }

    function configurations(piece){
        var retset = [];
        var piece_rotations = rotations(piece);

        for (var i = 0; i < piece_rotations.length; i++) {
            var trans_of_rot = translations(piece_rotations[i]);
            for (var j = 0; j < trans_of_rot.length; j++) {
                //is this set necesary? can translations produce duplicates??
                cube.math.set_add(retset, trans_of_rot[j], cube.math.matrix_eq);
            }
        }
        return retset;
    }

    // def describe_piece_simmetry(ps):
//     print_pointset(ps)
//     print 'translations', len(list(translations(ps)))
//     print 'rotations', len(rotations(ps))
//     print 'all_configurations', len(all_configurations(ps))


    // function run_tests(){
    //     var bb = bbox([[0,1,0],[1,1,0]]);
    //     var piece = [[0,0,0], [0,1,0], [1,0,0], [0,0,1]];
    //     var transl = translations(piece);
    // }

    cube.geo = {
        NI : NI,
        NJ : NJ,
        NK : NK,
        translations:translations,
        rotations:rotations,
        configurations:configurations
    };

}());
