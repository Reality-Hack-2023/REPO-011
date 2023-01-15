WL.registerComponent('planetPostInfo', {
    planet_id: {type: WL.Type.String, default: ""},
}, {
    init: function() {
    },
    start: function() {
        console.log('New Planet Spawned: ', this.planet_id);
    },
    update: function(dt) {
    },
});
