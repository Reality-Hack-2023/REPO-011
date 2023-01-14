WL.registerComponent('planetRotation', {
    param: {type: WL.Type.Float, default: 1.0},
}, {
    init: function() {
        console.log('init() with param', this.param);
    },
    update: function(dt) {
        this.object.rotateAxisAngleDegObject([0,1,0], dt*10)
    },
});
