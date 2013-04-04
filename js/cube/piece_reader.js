(function () {
    var empty = '.';
    var colors = 'XOABCDEGHKLM';
    var NI = cube.geo.NI,
        NJ = cube.geo.NJ,
        NK = cube.geo.NK;

    function read_piece(s, color){
        var piece = [];
        color = color || colors[0];

        s = s.replace(/\s+/g, '');

        for (var j = 0; j < NJ; j++) {
            for (var k = 0; k < NK; k++) {
                for (var i = 0; i < NI; i++) {
                    if (s[i + k*NI + j*NI*NK] === color){
                        piece.push([i, NJ-1-j, k]);
                    }
                }
            }
        }

        return piece;
    }

    function write_piece(piece, color){
        var s = '';
        color = color || colors[0];

        for (var j = 0; j < NJ; j++) {
            for (var k = 0; k < NK; k++) {
                for (var i = 0; i < NI; i++) {
                    if (cube.math.set_in(piece, [i, NJ-1-j, k], cube.math.v_eq)){
                        s += color;
                    }else{
                        s += empty;
                    }
                }
                s+=' ';
            }
            s+='\n';
        }

        s+='\n';
        return s;
    }

    function read_pieces(pieces_str_list){
        var pieces = [];

        for (var i = 0; i < pieces_str_list.length; i++) {
            pieces.push(cube.read_piece(pieces_str_list[i]));
        }

        return pieces;
    }

    cube.read_piece = read_piece;
    cube.read_pieces = read_pieces;
    cube.write_piece = write_piece;
})();