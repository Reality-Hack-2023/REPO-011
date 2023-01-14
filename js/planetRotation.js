WL.registerComponent('planetRotation', {
    speed: {type: WL.Type.Float, default: 100},
}, {
    init: function() {
        console.log('init() with param', this.param);
    },
    start: function() {
    },
    update: function(dt) {
        this.object.rotateAxisAngleDeg([0,0,1], dt*100);
    },
});
