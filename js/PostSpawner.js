import { map } from '@firebase/util';
import { textures, Collider } from '@wonderlandengine/api';
import { getPosts, newPost, newComment, newLikes, db } from './firestore-api.js'
import { planets } from './html-ui.js'


WL.registerComponent('PostSpawner', {
    size: {type: WL.Type.Float, default: 1},
    mesh: {type: WL.Type.Mesh},
    material: {type: WL.Type.Material},
    material_onclick: {type: WL.Type.Material},
    moon_mesh: {type: WL.Type.Mesh},
    moon_material: {type: WL.Type.Material},
    postPreviewObj: {type: WL.Type.Object},
}, {
    init: function() {
        console.log('init() with param', this.param);
    },
    start: function() {//add all textures
        this.postPreviewObj.active = false;
        console.log('start() with param', this.param);
            // setTimeout recursively to make sure it waits for the last request to finish
            let updatePosts;
            updatePosts = () => {
                getPosts(db).then((posts) => {
                    console.log("YO", posts)
                    posts.forEach(post => {
                        if(!planets.has(post.ref.id)){
                            
                            var newObj = WL.scene.addObject();

                            this.size = 1 + (post.data().likes + post.data().comments.length) * 0.01
                            newObj.scale([this.size, this.size, this.size])

                            var newMesh = newObj.addComponent("mesh", {mesh : this.mesh});
                            var newCollision = newObj.addComponent("collision", {extents: [this.size, this.size, this.size], collider: Collider.Sphere, group: 1});
                            var newInfo = newObj.addComponent("planetPostInfo");
                            newObj.addComponent("cursor-target");
                            newObj.addComponent("planetOnCollision", {material_org: this.material, material_change: this.material_onclick, postPreviewObj: this.postPreviewObj});
                            
                            
                            // newMesh.mesh = this.mesh;
                            var mat = this.material.clone();
                            console.log(this.textures);
                            newMesh.material = mat;
                            mat.diffuseTexture = this.textures[Math.floor(Math.random() * this.textures.length)];
                            newInfo.planet_id = post.ref.id;
                            post.data().comments.forEach((comment) => {
                                newObj.rotateAxisAngleRadObject([1,0,0], Math.random())
                                var moonObj = WL.scene.addObject(newObj);
                                moonObj.scalingWorld = [0.3,0.3,0.3]
                                var moonMesh = moonObj.addComponent("mesh");
                                moonMesh.mesh = this.moon_mesh;
                                moonMesh.material = this.moon_material;
                                moonObj.addComponent('moonRotation', {speed: 360*Math.random()});
                            })
                            
                            do{
                                const minAngle = 0;
                                const maxAngle = -180;
                                const angle = Math.random() * (maxAngle - minAngle) + minAngle;
                                const x = Math.cos(angle) * 10;
                                const y = Math.sin(angle) * 10;
                                newObj.setTranslationWorld([Math.abs(x),Math.abs(Math.floor(Math.random() * 7)),-Math.abs(y)]);
                            }while(newObj.getComponent("collision").queryOverlaps().length != 0)
                                
                                
                            
                            newObj.addComponent("planetRotation");
                            console.log(newObj.transformLocal);
                            planets.set(post.ref.id, {data: post.data(), object: newObj});
                            console.log('PostSpawner: ', newObj.getComponent('planetPostInfo').planet_id);
                        }
                    });
                    setTimeout(updatePosts, 5000);
                })
            }
            this.textures = [];
        ["1.webp","2.webp","3.webp","4.webp","5.webp","6.webp","7.webp","8.webp","9.webp","10.webp","11.webp","12.webp","13.webp","14.webp"].forEach(file => {
            WL.textures.load("planettextures/"+ file, 'anonymous')
                .then((texture) => {
                        this.textures.push(texture);
                        if (this.textures.length == 5){
                            updatePosts();
                        }
                }
                );
        });
    },
    update: function(dt) {
    },
});