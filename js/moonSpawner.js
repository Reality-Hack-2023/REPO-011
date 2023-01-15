WL.registerComponent('moonSpawner', {
    num_moons: {type: WL.Type.Int, default: 0},
    mesh: {type: WL.Type.Mesh},
    material: {type: WL.Type.Material},
}, {
    init: function() {
        
    },
    start: function() {
        // this.last_num_moons = this.num_moons;
        var newObj = WL.scene.addObject();
        var newMesh = newObj.addComponent("mesh");

        newMesh.mesh = this.mesh;
        newMesh.material = this.material;


        var moonRotation = newObj.addComponent('moonRotation');
        moonRotation.speed = (Math.random() + 1) * 1000
        moonRotation.x = Math.random() * 360
        moonRotation.y = Math.random() * 360
        moonRotation.z = Math.random() * 360
        

    },
    update: function(dt) {
        // if(this.last_num_moons != this.num_moons){
        //     for(let i = last_num_moons; i < this.num_moons; ++i){
        //         var newObj = WL.scene.addObject();
        //         var newMesh = newObj.addComponent("mesh");

        //         newMesh.mesh = this.mesh;
        //         newMesh.material = this.material;

        //         newObj.addComponent('moonRotation');
        //     }
        // }
    },
});
