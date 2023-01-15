import { map } from '@firebase/util';
import { textures } from '@wonderlandengine/api';
import { getPosts, newPost, newComment, newLikes, db } from './firestore-api.js'
var planets = new Map();
WL.registerComponent('PostSpawner', {
    mesh: {type: WL.Type.Mesh},
    material: {type: WL.Type.Material},
    moon_mesh: {type: WL.Type.Mesh},
    moon_material: {type: WL.Type.Material},
}, {
    init: function() {
        console.log('init() with param', this.param);
    },
    start: function() {//add all textures
        this.textures = [];
        [].forEach(file => {
            WL.textures.load(this.url, 'anonymous')
                .then((texture) => {
                        this.textures.push(textures);
                }
                );
        });

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
                            var newInfo = newObj.addComponent("planetPostInfo");
                            newObj.addComponent("planetOnCollision");
                            
                            newMesh.mesh = this.mesh;
                            newMesh.material = this.material.clone();
                            //newMesh.material.diffuseTexture = ...

                            newInfo.planet_id = post.ref.id;

                            post.data().comments.forEach((comment) => {
                                var moonObj = WL.scene.addObject(newObj);
                                moonObj.scalingWorld = [0.3,0.3,0.3]
                                var moonMesh = moonObj.addComponent("mesh");

                                moonMesh.mesh = this.moon_mesh;
                                moonMesh.material = this.moon_material;

                                moonObj.addComponent('moonRotation');
                            })

                            if (planets.length == 0)
                                newObj.translateWorld = this.object.translateWorld;
                            else{
                                //TESTING
                                const minAngle = 0;
                                const maxAngle = -180;
                                const angle = Math.random() * (maxAngle - minAngle) + minAngle;
                                const x = Math.cos(angle) * 10;
                                const y = Math.sin(angle) * 10;
                                newObj.setTranslationWorld([Math.abs(x),Math.abs(Math.floor(Math.random() * 7)),-Math.abs(y)]);
                                //TESTING
                                //newObj.setTranslationWorld([Math.floor(Math.random() * 12),Math.abs(Math.floor(Math.random() * 6)),Math.floor(Math.random() * 10)-12]);
                            }
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