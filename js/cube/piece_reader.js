(function () {
    var empty = '.';
    var colors = 'XOABCDEGHKLM';

    function read_piece(s, box, color){
        var piece = [];
        color = color || colors[0];

        s = s.replace(/\s+/g, '');

        for (var j = 0; j < box.NJ; j++) {
            for (var k = 0; k < box.NK; k++) {
                for (var i = 0; i < box.NI; i++) {
                    if (s[i + k * box.NI + j * box.NI * box.NK] === color){
                        piece.push([i, box.NJ-1-j, k]);
                    }
                }
            }
        }

        return piece;
    }

    function write_piece(piece, box, color){
        var s = '';
        color = color || colors[0];

        for (var j = 0; j < box.NJ; j++) {
            for (var k = 0; k < box.NK; k++) {
                for (var i = 0; i < box.NI; i++) {
                    if (cube.math.set_in(piece, [i, box.NJ-1-j, k], cube.math.v_eq)){
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

    function read_pieces(pieces_str_list, boxa){
        var pieces = [];
        pieces.box = {
            NI : boxa[0],
            NJ : boxa[1],
            NK : boxa[2]
        };

        for (var i = 0; i < pieces_str_list.length; i++) {
            pieces.push(read_piece(pieces_str_list[i], pieces.box));
        }

        return pieces;
    }

    cube.read_piece = read_piece;
    cube.read_pieces = read_pieces;
    cube.write_piece = write_piece;
})();