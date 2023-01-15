import { planets, currentlyClicked } from './html-ui.js';

WL.registerComponent('planetOnCollision', {
    material_org: {type: WL.Type.Material},
    material_change: {type: WL.Type.Material},
    postPreviewObj: {type: WL.Type.Object},
}, {
    init: function() {
        console.log('init() with param', this.param);
    },
    start: function() {
        var cursor = this.object.getComponent("cursor-target");
        
        var selected = false;
        cursor.addClickFunction( o =>{
            if (!selected) {
                find_planet = this.object.getComponent("planetPostInfo");
                if (find_planet != null) {
                    currentlyClicked.clicked = find_planet.planet_id;
                    console.log("Clicked:", currentlyClicked)
                }
                var newMesh = this.object.getComponent("mesh");
                this.material_org = newMesh.material;
                newMesh.material = this.material_change;

                var allInactiveButtons = document.querySelectorAll(".inactive_button");
                allInactiveButtons.forEach(element => {
                    element.className = "active_button";
                    element.disabled = false;
                });

                if (currentlyClicked.clicked) {
                    this.postPreviewObj.getComponent("uiHandler").setPost(planets.get(currentlyClicked.clicked).data.text)
                    this.postPreviewObj.active = true;
                }

                this.postPreviewObj.setTranslationWorld(glMatrix.vec3.add([], this.object.getTranslationWorld([]), [0, 2, 0]));
                this.postPreviewObj.lookAt(WL.scene.activeViews[0].object.getTranslationWorld([]));
                this.postPreviewObj.rotateAxisAngleDegObject([0, 1, 0], 180);

                selected = true;
            } else {
                var newMesh = this.object.getComponent("mesh");
                newMesh.material = this.material_org;

                var allActiveButtons = document.querySelectorAll(".active_button");
                allActiveButtons.forEach(element => {
                    element.className = "inactive_button";
                    element.disabled = true;
                });

                this.postPreviewObj.active = false;

                selected = false;
            }
        })
    },
    update: function(dt) {
    },
});