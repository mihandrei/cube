(function(m4mul, matrix_eq, set_add){
    // all rotations in the S4 group
    function S4() {
        // rotation-translation matrices by 90 degrees,
        // homogeneous coordonates
        var rotz = [[0,-1, 0, 0 ],
                    [1, 0, 0, 0 ],
                    [0, 0, 1, 0 ],
                    [0, 0, 0, 1 ]
                ],
            rotx = [[1, 0,  0, 0 ],
                    [0, 0, -1, 0 ],
                    [0, 1,  0, 0 ],
                    [0, 0,  0, 1 ]
                ],
            roty = [[ 0, 0,  1, 0 ],
                    [ 0, 1,  0, 0 ],
                    [-1, 0,  0, 0 ],
                    [ 0, 0,  0, 1 ]
                ],
            rotid = [[ 1, 0, 0, 0 ],
                     [ 0, 1, 0, 0 ],
                     [ 0, 0, 1, 0 ],
                     [ 0, 0, 0, 1 ]
                ],
            rotx2 = m4mul(rotx, rotx),
            rotx3 = m4mul(rotx2, rotx),
            roty2 = m4mul(roty, roty),
            roty3 = m4mul(roty2, roty),
            rotz2 = m4mul(rotz, rotz),
            rotz3 = m4mul(rotz2, rotz),
            //rotation bases
            x_rotations = [rotid, rotx, rotx2, rotx3],
            y_rotations = [rotid, roty, roty2, roty3],
            z_rotations = [rotid, rotz, rotz2, rotz3],
            all_rotations = [];

            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    for (var k = 0; k < 4; k++) {
                        var xr = x_rotations[i],
                            yr = y_rotations[j],
                            zr = z_rotations[k],
                            matrix = m4mul(m4mul(xr, yr), zr);

                        set_add(all_rotations, matrix, matrix_eq);
                    }
                }
            }
            return all_rotations;
    }
    cube.S4 = S4;
})(cube.math.m4mul, cube.math.matrix_eq, cube.math.set_add);