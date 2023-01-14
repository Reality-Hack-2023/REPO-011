var spheres = [];
WL.registerComponent('planetSpawner', {
    mesh: {type: WL.Type.Mesh},
    material: {type: WL.Type.Material},
}, {
    init: function() {
        console.log('init() with param', this.param);
    },
    start: function() {
        var cursor = this.object.getComponent("cursor-target");
        cursor.addClickFunction( o=>{
            var newObj = WL.scene.addObject();
            var newMesh = newObj.addComponent("mesh");
            newMesh.mesh = this.mesh;
            newMesh.material = this.material;
            if (spheres.length == 0)
                newObj.translateWorld = this.object.translateWorld;
            else
                newObj.setTranslationWorld(glMatrix.vec3.add([], spheres[spheres.length-1].getTranslationWorld([]), [1.5, 0, 0]));
            newObj.addComponent("planetRotation");
            spheres.push(newObj);
            console.log(newObj.transformLocal);
        })
    },
    update: function(dt) {
    },
});
