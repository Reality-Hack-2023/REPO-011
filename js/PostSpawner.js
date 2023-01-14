import { getPosts, newPost, newComment, newLikes, db } from './firestore-api.js'
WL.registerComponent('PostSpawner', {
    param: {type: WL.Type.Float, default: 1.0},
}, {
    init: function() {
        console.log('init() with param', this.param);
    },
    start: function() {
        console.log('start() with param', this.param);
        getPosts(db).then(console.log);
    },
    update: function(dt) {
        console.log('update() with delta time', dt);
    },
});
