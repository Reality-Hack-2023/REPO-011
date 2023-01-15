import { vec3 } from "gl-matrix";

WL.registerComponent('moonRotation', {
    speed: {type: WL.Type.Float, default: 100},
    x: {type: WL.Type.Float, default: 0},
    y: {type: WL.Type.Float, default: 1},
    z: {type: WL.Type.Float, default: 0},

}, {
    init: function() {
        console.log('init() with param', this.param);
    },
    start: function() {
        console.log(this.x, this.y, this.z)
        this.mag = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z)
        this.axis = [this.x, this.y, this.z]
        vec3.normalize(this.axis, this.axis)
        this.object.translate([0,0,2]);
    },
    update: function(dt) {
        
        this.object.rotateAxisAngleDeg(this.axis, this.speed*dt);
    },
});
