import { getPosts, newPost, newComment, newLikes, db,posts_list } from './firestore-api.js'
var spheres = [];
WL.registerComponent('PostSpawner', {
    param: {type: WL.Type.Float, default: 1.0},
}, {
    init: function() {
        console.log('init() with param', this.param);
    },
    start: function() {
        console.log('start() with param', this.param);
        getPosts(db).then(console.log);
        async function callGetPosts(db) {
            setInterval(async () => {
                const posts = await getPosts(db);
                for (let i = 0; i < posts_list.length; ++i){
                    console.log(posts);
                var newObj = WL.scene.addObject();
                var newMesh = newObj.addComponent("mesh");
                newMesh.mesh = this.mesh;
                newMesh.material = this.material;
                if (spheres.length == 0)
                    newObj.translateWorld = this.object.translateWorld;
                else
                    newObj.setTranslationWorld(glMatrix.vec3.add([], spheres[spheres.length-1].getTranslationWorld([]), [1.5, 0, 0]));
                newObj.addComponent("planetRotation");
                spheres.push(newObj);
                console.log(newObj.transformLocal);
            }
            }, 5000);
          }
        callGetPosts()
    },
    update: function(dt) {
    },
});
