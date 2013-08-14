(function(THREE) {
    var wireTexture;
    var scene;
    var pieces = [];

    function lights(scene){
        var lammb = new THREE.AmbientLight(0x111111);
        scene.add(lammb);

        var lighta = new THREE.DirectionalLight(0xffff44);
        lighta.position.set(0.5, 0.5, 6);
        scene.add(lighta);

        var spotlight = new THREE.DirectionalLight(0xff8888);
        // spotlight.shadowCameraFov = 45;
        //spotlight.castShadow = true;
        spotlight.position.set(1, 5, 4);
        scene.add(spotlight);

        var spotlight2 = new THREE.DirectionalLight(0x8888ff);
        // spotlight2.shadowCameraFov = 45;
        //spotlight2.castShadow = true;
        spotlight2.position.set(-4, -2, 3);
        scene.add(spotlight2);
    }


    function static_geom(scene, box){
        var guideCubeGeo = new THREE.CubeGeometry(box.NI, box.NJ, box.NK, box.NI, box.NJ, box.NK);
        var mat = new THREE.MeshBasicMaterial({color: 0x222222, wireframe:true});
        var guideCube = new THREE.Mesh(guideCubeGeo, mat);
        guideCube.position.set(box.NI/2, box.NJ/2, box.NK/2);
        scene.add(guideCube);
    }

    function init(box, tdiv){
        wireTexture = new THREE.ImageUtils.loadTexture('square.png' );
        scene = new THREE.Scene();
        var cam_pos = Math.max(box.NI, box.NJ, box.NK);
        var renderer = new THREE.WebGLRenderer({antialias:false});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColorHex(0x333333, 1.0);
        renderer.clear();
        document.body.appendChild(renderer.domElement);

        var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);

        //loot at considera asta vectorul up implicit e 0,1,0
        camera.up = new THREE.Vector3(0,0,1);

        static_geom(scene, box);
        lights(scene);

        tdiv = (tdiv||8)*1000;

        function render(t) {
            requestAnimationFrame(render);
            var circlex = cam_pos * Math.sin(t/tdiv) + box.NI/2;
            var circley = cam_pos * Math.cos(t/tdiv) + box.NJ/2;

            camera.position.x =  circlex ;
            camera.position.y =  circley ;
            camera.position.z = cam_pos + box.NK/2;
            camera.lookAt(new THREE.Vector3(box.NI/2, box.NJ/2, box.NK/2));

            renderer.render(scene, camera);
        }

        render(new Date().getTime());
        return scene;
    }


    function piece_geom(voxels){
        function vox(v3){
            var r = new THREE.CubeGeometry(1,1,1,3,3,3);
            r.applyMatrix(new THREE.Matrix4().translate(new THREE.Vector3(v3[0] + 0.5, v3[1] + 0.5, v3[2] + 0.5)));
            return r;
        }

        var geometry = vox(voxels[0]);

        for (var i = 1; i < voxels.length; i++) {
            THREE.GeometryUtils.merge(geometry, vox(voxels[i]));
        }

        return geometry;
    }


    function piece(voxes, color){
        var material = new THREE.MeshLambertMaterial({map: wireTexture,
                 color: color
                 // emissive:color
             });

        var cube = new THREE.Mesh(piece_geom(voxes), material);
        return cube;
    }


    function display(new_pieces){
        for (var i = 0; i < pieces.length; i++) {
            scene.remove(pieces[i]);
        }

        pieces = [];

        for (i = 0; i < new_pieces.length; i++) {
            var p = new_pieces[i];
            pieces.push(p);
            scene.add(p);
        }
    }


    View = {
        init:init,
        display:display,
        piece:piece
    };

})(THREE);