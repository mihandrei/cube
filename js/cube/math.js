var cube = cube || {};

(function () {
    //=== linear set
    function set_in(s, el, eq){
        for (var i = 0; i < s.length; i++) {
            if (eq(s[i], el)){
                return true;
            }
        }
        return false;
    }

    function set_add(s, el, eq){
        if(!set_in(s,el,eq)){
            s.push(el);
        }
    }

    function set_intersection(s1, s2, eq){
        var ret = [];
        for (var i = 0; i < s2.length; i++) {
            if(set_in(s1, s2[i], eq)){
                ret.push(s2[i]);
            }
        }
        return ret;
    }


    function set_union(s1, s2, eq){
        var ret = s1.slice();
        for (var i = 0; i < s2.length; i++) {
            set_add(ret, s2[i], eq);
        }
        return ret;
    }

    //======some affine math

    function v3add(v1,v2){
        return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
    }


    function m4mul(a, b){
        ret = [];
        for (var r = 0; r < 4; r++) {
            ret[r] = [];
            for (var c = 0; c < 4; c++) {
                ret[r][c] = 0;
                for (var i = 0; i < 4; i++) {
                    ret[r][c] += a[r][i] * b[i][c];
                }
            }
        }
        return ret;
    }


    function matrix_eq(a, b){
        //we asume with no checks that a, b are well formed
        var nr = a.length;
        if (nr !== b.length) return false;
        if (nr === 0) return true;

        var nc = a[0].length;

        for (var r = 0; r < nr; r++) {
            for (var c = 0; c < nc; c++) {
                if (a[r][c]!==b[r][c]){
                    return false;
                }
            }
        }
        return true;
    }

    function v_eq(a, b){
        var nr = a.length;
        if (nr !== b.length) return false;

        for (var i = 0; i < nr; i++) {
            if(a[i]!==b[i]){
                return false;
            }
        }
        return true;
    }

    // different for mmul to avoid column vectors or transposes
    // also hides the homogenous coordonate
    function vmul(m, v){
        v = v.slice();
        //homog coord
        v.push(1);
        var ret = [0, 0, 0, 0];
        for (var r = 0; r < 4; r++) {
            for (var i = 0; i < 4; i++) {
                ret[r] += m[r][i] * v[i];
            }
        }
        return ret.slice(0,-1);
    }

    function bbox(points){
        var bb = {};
        bb.xmin = bb.ymin = bb.zmin = Infinity;
        bb.xmax = bb.ymax = bb.zmax = - Infinity;

        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            bb.xmin = Math.min(p[0], bb.xmin);
            bb.ymin = Math.min(p[1], bb.ymin);
            bb.zmin = Math.min(p[2], bb.zmin);
            bb.xmax = Math.max(p[0], bb.xmax);
            bb.ymax = Math.max(p[1], bb.ymax);
            bb.zmax = Math.max(p[2], bb.zmax);
        }

        bb.dx = 1 + bb.xmax - bb.xmin;
        bb.dy = 1 + bb.ymax - bb.ymin;
        bb.dz = 1 + bb.zmax - bb.zmin;

        return bb;
    }

    function translation_matrix(v){
        return [[1,0,0,v[0]],
                [0,1,0,v[1]],
                [0,0,1,v[2]],
                [0,0,0,  1]];
    }

    cube.math = {
        set_add : set_add,
        set_in : set_in,
        set_union : set_union,
        set_intersection : set_intersection,
        //v3add : v3add,
        m4mul : m4mul,
        matrix_eq : matrix_eq,
        v_eq:v_eq,
        vmul : vmul,
        bbox : bbox,
        translation_matrix:translation_matrix
    };

})();