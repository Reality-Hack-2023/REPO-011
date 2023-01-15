import { map } from '@firebase/util';
import { getPosts, newPost, newComment, newLikes, db } from './firestore-api.js'
var planets = new Map();
WL.registerComponent('PostSpawner', {
    mesh: {type: WL.Type.Mesh},
    material: {type: WL.Type.Material},
}, {
    init: function() {
        console.log('init() with param', this.param);
    },
    start: function() {
        console.log('start() with param', this.param);
            // setTimeout recursively to make sure it waits for the last request to finish
            let updatePosts;
            updatePosts = () => {
                getPosts(db).then((posts) => {
                    console.log("YO", posts)
                    posts.forEach(post => {
                        if(!planets.has(post.ref.id)){
                            
                            var newObj = WL.scene.addObject();
                            var newMesh = newObj.addComponent("mesh");
                            var newInfo = newObj.addComponent("planetPostInfo")
                            
                            newMesh.mesh = this.mesh;
                            newMesh.material = this.material;
                            newInfo.planet_id = post.ref.id;

                            if (planets.length == 0)
                                newObj.translateWorld = this.object.translateWorld;
                            else
                                newObj.setTranslationWorld([Math.random() * 20 + 10, Math.random() * 20 + 10, 0]);
                            newObj.addComponent("planetRotation");
                            console.log(newObj.transformLocal);

                            planets.set(post.ref.id, {data: post.data(), object: newObj});

                            console.log('PostSpawner: ', newObj.getComponent('planetPostInfo').planet_id);
                        }
                    });
                    setTimeout(updatePosts, 5000);
                })
            }
            updatePosts();
    },
    update: function(dt) {
    },
});