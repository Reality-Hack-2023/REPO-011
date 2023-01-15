WL.registerComponent('planetOnCollision', {
    material_org: {type: WL.Type.Material},
    material_change: {type: WL.Type.Material},
}, {
    init: function() {
        console.log('init() with param', this.param);
    },
    start: function() {
        var cursor = this.object.getComponent("cursor-target");
        cursor.addHoverFunction( o=>{
            var newMesh = this.object.children[0].children[0].children[0].children[0].getComponent("mesh");
            newMesh.material = this.material_change;
        })
        cursor.addUnHoverFunction( o=>{
            var newMesh = this.object.children[0].children[0].children[0].children[0].getComponent("mesh");
            newMesh.material = this.material_org;
        })
    },
    update: function(dt) {
    },
});
