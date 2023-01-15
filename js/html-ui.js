import { getPosts, newPost, newComment, newLikes, db } from './firestore-api.js';
import { planet_identifier } from './planetOnCollision.js';

const HTMLCode = `
<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css');

h2 {
  color: white;
}

.post_button {
  position: relative;
  border: none;
  border-radius: 45px;
  font-size: 12px; 
  color: #000;
  background-color: #fff;
  padding: 10px 21px; 
  width: 60px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 400;
  overflow: hidden;

  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer; 
  outline: none;
} 


.post_button:after {
  content: "";
  position: absolute;
  padding-top: 300%;
  padding-left: 350%;
  margin-left: -20px !important;
  margin-top: -120%;
  opacity: 0;
}

.post_button:active {
  transform: translateY(-3px);
  background-color: #bbb;
}

.post_button:active:after {
  padding: 0;
  margin: 0;
  opacity: 1;
  transition: 0s
}

.active_button {
  position: relative;
  border: none;
  border-radius: 45px;
  font-size: 12px; 
  color: #000;
  background-color: #fff;
  padding: 10px 21px; 
  width: 60px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 400;
  overflow: hidden;

  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer; 
  outline: none;
} 


.active_button:after {
  content: "";
  position: absolute;
  padding-top: 300%;
  padding-left: 350%;
  margin-left: -20px !important;
  margin-top: -120%;
  opacity: 0;
}

.active_button:active {
  transform: translateY(-3px);
  background-color: #bbb;
}

.active_button:active:after {
  padding: 0;
  margin: 0;
  opacity: 1;
  transition: 0s
}

.inactive_button {
  position: relative;
  border: none;
  border-radius: 45px;
  font-size: 12px; 
  color: #000;
  background-color: #fff;
  padding: 10px 21px; 
  width: 60px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 400;
  overflow: hidden;
  opacity: 0.4;

  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer; 
  outline: none;
}

.content {
  padding: 10px;
}

.center {
  margin: auto;
  width: 50%;
  padding: 10px;
}

.button-container {
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  width: 100%;
}
.postForm {
  
  border-radius: 1px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  transition: all 0.2s ease-in-out;
  position: absolute; 

  --width-of-input: 200px;
  --border-height: 1px; 
  --border-before-color: #C8D3D5;
  --border-after-color: #628F93; 
    width: var(--width-of-input);  

  top: 25%;  /* center the form vertically */
  left: 50%; /* center the form horizontally */
  transform: translate(-50%, -50%); /* adjust the position */
}


/* styling of Input */
.input {
 color: #fff;
 font-size: 0.9rem;
 background-color: transparent;
 width: 100%;
 box-sizing: border-box;
 padding-inline: 0.5em;
 padding-block: 0.7em;
 border: none;
 border-bottom: var(--border-height) solid var(--border-before-color);
}

/* styling of animated border */
.input-border {
 position: absolute;
 background: var(--border-after-color);
 width: 0%;
 height: 2px;
 bottom: 0;
 left: 0;
 transition: 0.3s;
}

/* Hover on Input */
input:hover {
 background: var(--input-hovered-color);
}

input:focus {
 outline: none;
}
/* here is code of animated border */
input:focus ~ .input-border {
 width: 100%;
}

/* We disable "pointer-events" on the parent, because it needs to
 * let through any events to the canvas. But for any direct children
 * of the content, we still want clicking/hovering etc */
.content > * {
  pointer-events: auto;
}
</style>
<div id="post-form" style="display: none;" class='content postForm'>
  <form>
    <label for="author">Author:</label>
    <input class="input" placeholder="Enter your name" id="author" name="author" required>
    <br>
    <label for="text">Text:</label>
    <textarea class="input" Placeholder="Type here" name="text" id="text" required></textarea>
    <br>
    <button type="button" id="submit-button" onclick="closeForm()">Submit</button>
  </form>
</div>

<div class='button-container'>
  <div class='content'>
  <button class="inactive_button" onclick="writeComment()" disabled><i class="fas fa-comment"></i></button>
  </div>

  <div class='content'>
  <button class="inactive_button" onclick="likePost()" disabled><i class="fas fa-heart"></i></button>
  </div>

  <div class='content'>
  <button class="post_button" onclick="openForm()"><i class="fas fa-pen"></i></button>
  </div>
</div>
`
window.openForm = function() {
  document.getElementById("post-form").style.display = "block";
}

window.closeForm = function() {
  document.getElementById("post-form").style.display = "none";
  newPost(db, document.getElementById("author").value, document.getElementById("text").value);
}

window.likePost = function() {
  if (planet_identifier != null) {
    newLikes(db, planet_identifier);
  }
}

window.writeComment = function() {
  if (planet_identifier != null) {
    newComment(db, planet_identifier, );
  }
}

WL.registerComponent('html-ui', {
}, {
    start: function() {
        /* Add any HTML to the DOM here */

        const div = document.createElement('div');
        /* Overlap this div over the canvas and fill the screen */
        div.style.position = 'fixed';
        div.style.top = 0;
        div.style.display = 'box';
        div.style.width = '100%';
        div.style.height = '100%';
        /* Don't block clicks to the canvas */
        div.style.pointerEvents = 'none';

        div.innerHTML = HTMLCode;

        document.body.appendChild(div);
    },
});

