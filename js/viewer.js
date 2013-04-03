(function(THREE) {
    var wireTexture;
    var scene;
    var pieces = [];

    function lights(scene){
        var lighta = new THREE.DirectionalLight(0xaaaaaa);
        lighta.position.set(-0.5,-0.5,1);
        scene.add(lighta);

        var spotlight = new THREE.SpotLight(0xff0000);
        spotlight.shadowCameraFov = 45;
        //spotlight.castShadow = true;
        spotlight.position.set(0, 5, 5);
        scene.add(spotlight);

        var spotlight2 = new THREE.SpotLight(0xaa00ff);
        spotlight2.shadowCameraFov = 45;
        //spotlight2.castShadow = true;
        spotlight2.position.set(5, 0, 5);
        scene.add(spotlight2);
    }


    function static_geom(scene){
        var guideCubeGeo = new THREE.CubeGeometry(4,4,4,4,4,4);
        var mat = new THREE.MeshBasicMaterial({color: 0x222222, wireframe:true});
        var guideCube = new THREE.Mesh(guideCubeGeo, mat);
        guideCube.position.set(0,0,2.5);
        scene.add(guideCube);
    }


    function init(){
        wireTexture = new THREE.ImageUtils.loadTexture('square.png' );
        scene = new THREE.Scene();

        var renderer = new THREE.WebGLRenderer({antialias:false});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColorHex(0x111111, 1.0);
        renderer.clear();
        document.body.appendChild(renderer.domElement);

        var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);

        camera.position.set(6,6,6);
        //loot at considera asta vectorul up implicit e 0,1,0
        camera.up = new THREE.Vector3(0,0,1);
        camera.lookAt(new THREE.Vector3(0,0,0));

        static_geom(scene);
        lights(scene);

        function render(t) {
            requestAnimationFrame(render);
            var circlex = 3 * Math.sin(t/15000);
            var circley = 3 * Math.cos(t/15000);

            camera.position.x =  circlex ;
            camera.position.y =  circley ;
            camera.position.z = 6;
            camera.lookAt(new THREE.Vector3(0, 0, 2));

            renderer.render(scene, camera);
        }

        render(new Date().getTime());
        return scene;
    }


    function piece_geom(voxels){
        function vox(v3){
            var r = new THREE.CubeGeometry(1,1,1,3,3,3);
            r.applyMatrix(new THREE.Matrix4().translate(new THREE.Vector3(v3[0],v3[1],v3[2])));
            return r;
        }

        var geometry = vox(voxels[0]);

        for (var i = 1; i < voxels.length; i++) {
            THREE.GeometryUtils.merge(geometry, vox(voxels[i]));
        }

        return geometry;
    }


    function piece(voxes, color){
        var material = new THREE.MeshLambertMaterial({map: wireTexture, color: 0xffffff, emissive:color});

        var cube = new THREE.Mesh(piece_geom(voxes), material);
        cube.position.set(-1.5,-1.5, 1);
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