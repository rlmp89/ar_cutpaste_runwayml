
const url = 'http://4c3750f7.ngrok.io/paste';


let myCanvas, video, button; 
var input = document.querySelector('input[type=file]');

input.addEventListener('change', onFileChange);
function onFileChange(){
  var file = input.files[0];
  let imageData;
  var reader = new FileReader();
  
  reader.onload = (e) => {
    imageData = e.target.result;
    const postData = {
      "image": imageData
    };

    runmodel(postData);
  }
  reader.readAsDataURL(file);
}


function setup() {
  myCanvas = createCanvas(640, 480);
  myCanvas.parent('cam');
  createBtn();

  // Create video images from webcam
  video = createCapture();
  video.size(640, 480);
  video.hide();
}

function draw() {
  translate(width,0); // move to far corner
  scale(-1.0,1.0);
  // Draw videos on the canvas
  image(video, 0, 0);

  
}

// Create a button
function createBtn() {
  button = createButton('go');
  button.parent('cam');
  // When the button is clicked, call image2Txt function
  button.mousePressed(onButtonClicked);
  createElement('br');
}

function onButtonClicked(){
  if (myCanvas && myCanvas.elt) {
    const canvasElt = myCanvas.elt;
    const imageData = canvasElt.toDataURL('image/jpeg', 1.0);
    const postData = {
      "image": imageData
    };
    runmodel(postData);
}}

function runmodel(payload) {
    // Send HTTP Post request to Runway with image data, runway will return the image caption
    httpPost(url, 'json', payload, (output) => {
      if (output)  {
        var myCanvas = document.getElementById('res');
        var ctx = myCanvas.getContext('2d');
        var img = new Image;
        img.onload = function(){
          myCanvas.width=img.width;
          myCanvas.height=img.height;
          ctx.drawImage(img,0,0,img.width,img.height);
        };
        img.src = output['image'];
      }
    })
}
