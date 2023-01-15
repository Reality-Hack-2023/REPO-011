WL.registerComponent('moonRotation', {
    speed: {type: WL.Type.Float, default: 100},
}, {
    init: function() {
        console.log('init() with param', this.param);
    },
    start: function() {
    },
    update: function(dt) {
        this.object.rotateAxisAngleDeg([0,0,10], dt*100);
    },
});
