canvas = document.querySelector('#mainCanvas');
c = canvas.getContext('2d');
canvas.onclick = new Function('kwang();');
fusioning = 0;

cScreenArr = [];
surberArr = [[], []];

function drawScreen() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = '#000';
  for (var i = 0; i < cScreenArr.length; i++) {
    c.fillRect(
      cScreenArr[i][0]*canvas.width, cScreenArr[i][1]*canvas.height,
      cScreenArr[i][2]*canvas.width, cScreenArr[i][2]*canvas.height
    );
  }
}
function spearedSub(num) {
  for (var i = 0; i < cScreenArr.length; i++) {
    cScreenArr[i][0] += Math.sin(cScreenArr[i][3]*Math.PI*180)/10000*num;
    cScreenArr[i][1] -= Math.cos(cScreenArr[i][3]*Math.PI*180)/10000*num;
  }
}
function kwang() {
  if (!fusioning) {
    fusioning = 1;
    setTimeout( function () {
      fusioning = 0;
    }, 1000);
  } else {
    var per = [6, 1]
    for (var i = 0; i < surberArr[1].length; i++) {
      cScreenArr[i][0] = (cScreenArr[i][0]*per[0]+surberArr[1][i][0]*per[1])/(per[0]+per[1]);
      cScreenArr[i][1] = (cScreenArr[i][1]*per[0]+surberArr[1][i][1]*per[1])/(per[0]+per[1]);
    }
    if (cScreenArr.length > surberArr[1].length) {
      cScreenArr.splice(surberArr[1].length, cScreenArr.length-surberArr[1].length);
    }
  }
}

setInterval( function () {
  canvas.width = Math.min(innerHeight, innerWidth);
  canvas.height = Math.min(innerHeight, innerWidth);
  if (!fusioning) {
    spearedSub(1);
  } else {
    kwang();
  }
  drawScreen();
}, 50);

img = new Image();
img.crossOrigin = "";
function getImageLightness(imageSrc,pos,callback) {
    img.src = imageSrc;
    img.style.display = "none";
    document.body.appendChild(img);
    img.onload = function() {
      // create canvas
      var canvas2 = document.createElement("canvas");
      canvas2.width = this.width;
      canvas2.height = this.height;
      canvas2.style.display = "none";
      var ctx = canvas.getContext("2d");
      ctx.drawImage(this,0,0);
      var imageData = ctx.getImageData(0,0,canvas2.width,canvas2.height);
      var data = imageData.data;
      console.log(data);
      blackArr = [];
      tStr = '';
      for(var x = 0; x < data.length; x+=8) {
        if (x%4096 < 4096) {
          if (data[x] < 230 || data[x+1] < 230 || data[x+2] < 230) {
            surberArr[pos].push([x%512/512, Math.floor(x/512)/128]);
            tStr += 1;
          } else {
            tStr += 0;
          }
        }
        if (x%512 == 0) {
          tStr += '\n';
          console.log(x);
        }
      }
      callback(tStr);
    }
}
//https://i.imgur.com/rqorOZK.png
//https://i.imgur.com/6AMBm5H.png
getImageLightness("https://i.imgur.com/rqorOZK.png",0,function(tStr){
  console.log(tStr);
  for (var i = 0; i < surberArr[0].length; i++) {
    console.log(surberArr);
    cScreenArr.push([]);
    cScreenArr[i].push(surberArr[0][i][0]);
    cScreenArr[i].push(surberArr[0][i][1]);
    cScreenArr[i].push(Math.random()*0.005+0.01);
    cScreenArr[i].push(Math.random()*360);
  }
  spearedSub(20);
  getImageLightness("https://i.imgur.com/6AMBm5H.png",1,function(tStr){
    console.log(tStr);
  });
});
