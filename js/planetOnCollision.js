import './html-ui.js';

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
            var allInactiveButtons = document.querySelectorAll(".inactive_button");
            allInactiveButtons.forEach(element => {
                element.className = "active_button";
            });
        })
        cursor.addUnHoverFunction( o=>{
            var newMesh = this.object.children[0].children[0].children[0].children[0].getComponent("mesh");
            newMesh.material = this.material_org;
            var allActiveButtons = document.querySelectorAll(".active_button");
            allActiveButtons.forEach(element => {
                element.className = "inactive_button";
            });
        })
    },
    update: function(dt) {
    },
});
