import { currentlyClicked } from './html-ui.js';

let postPreviewObj = null;

WL.registerComponent('planetOnCollision', {
    material_org: {type: WL.Type.Material},
    material_change: {type: WL.Type.Material},
    canvas_mesh: {type: WL.Type.Mesh},
    canvas_material: {type: WL.Type.Material},
}, {
    init: function() {
        console.log('init() with param', this.param);
    },
    start: function() {
        var cursor = this.object.getComponent("cursor-target");
        var selected = false;
        cursor.addClickFunction( o=>{
            if (!selected) {
                find_planet = this.object.getComponent("planetPostInfo");
                if (find_planet != null) {
                    currentlyClicked.clicked = find_planet.planet_id;
                }
                var newMesh = this.object.children[0].children[0].children[0].children[0].getComponent("mesh");
                newMesh.material = this.material_change;

                var allInactiveButtons = document.querySelectorAll(".inactive_button");
                allInactiveButtons.forEach(element => {
                    element.className = "active_button";
                    element.disabled = false;
                });

                postPreviewObj = WL.scene.addObject();
                var postPreviewMesh = postPreviewObj.addComponent("mesh");

                postPreviewMesh.mesh = this.canvas_mesh;
                postPreviewMesh.material = this.canvas_material;

                postPreviewObj.setTranslationWorld(glMatrix.vec3.add([], this.object.getTranslationWorld([]), [0, 2, 0]));

                selected = true;
            } else {
                var newMesh = this.object.children[0].children[0].children[0].children[0].getComponent("mesh");
                newMesh.material = this.material_org;

                var allActiveButtons = document.querySelectorAll(".active_button");
                allActiveButtons.forEach(element => {
                    element.className = "inactive_button";
                    element.disabled = true;
                });

                if (postPreviewObj != null) {
                    
                }

                selected = false;
            }
        })
    },
    update: function(dt) {
    },
});