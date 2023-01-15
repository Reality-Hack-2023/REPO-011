import './firestore-api.js';

const HTMLCode = `
<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css');

h2 {
  color: white;
}

.comment_button {
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


.comment_button:after {
  content: "";
  position: absolute;
  padding-top: 300%;
  padding-left: 350%;
  margin-left: -20px !important;
  margin-top: -120%;
  opacity: 0;
}

.comment_button:active {
  transform: translateY(-3px);
  background-color: #bbb;
}

.comment_button:active:after {
  padding: 0;
  margin: 0;
  opacity: 1;
  transition: 0s
}

.like_button {
  position: relative;
  background-color: #EFAAC4;
  border: none;
  font-size: 12px;
  color: #000;
  padding: 20px 10px;
  width: 70px;
  text-align: center;
  test-transform: uppercase; 
  letter-spacing 3px:
  font-weight: 500px; 
  transition-duration: all 0.3s ease 0;
  text-decoration: none;
  overflow: hidden;
  cursor: pointer;
}

.like_button:after {
  content: "";
  display: block;
  position: absolute;
  padding-top: 300%;
  padding-left: 350%;
  margin-left: -20px;
  margin-top: -120%;
  opacity: 0;
  transition: all 0.8s
}

.like_button:active:after {
  padding: 0;
  margin: 0;
  opacity: 1;
  transform: translateY(-2px);
}

.post_button {
  position: relative;
  background-color: #96C0B7;
  border: none;
  font-size: 12px;
  color: #000;
  padding: 20px 10px;
  width: 70px;
  text-align: center;
  test-transform: uppercase; 
  letter-spacing 3px:
  font-weight: 500px; 
  transition-duration: all 0.3s ease 0;
  text-decoration: none;
  overflow: hidden;
  cursor: pointer;
}

.post_button:after {
  content: "";
  display: block;
  position: absolute;
  padding-top: 300%;
  padding-left: 350%;
  margin-left: -20px;
  margin-top: -120%;
  opacity: 0;
  transition: all 0.8s
}

.post_button:active:after {
  padding: 0;
  margin: 0;
  opacity: 1;
  transform: translateY(-2px);
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
  padding: 20px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  transition: all 0.2s ease-in-out;
  position: absolute; /* add position */
  top: 25%;  /* center the form vertically */
  left: 50%; /* center the form horizontally */
  transform: translate(-50%, -50%); /* adjust the position */
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
    <input type="text" id="author" name="author" required>
    <br>
    <label for="text">Text:</label>
    <textarea id="text" name="text" required></textarea>
    <br>
    <button type="submit" id="submit-button" onclick="closeForm();newPost(author, text)">Submit</button>
  </form>
</div>

<div class='button-container'>
  <div class='content'>
  <button class="comment_button"><i class="fas fa-comment"></i></button>
  </div>

  <div class='content'>
  <button class="comment_button"><i class="fas fa-heart"></i></button>
  </div>

  <div class='content'>
  <button class="comment_button" onclick="openForm()"><i class="fas fa-pen"></i></button>
  </div>
</div>
`
window.openForm = function() {
  document.getElementById("post-form").style.display = "block";
}

window.closeForm = function() {
  document.getElementById("post-form").style.display = "none";
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

