function random(a,b){
  if(b == undefined){
    return Math.floor(Math.random() * a);
  }
  else{
    return Math.floor(a + Math.random() * b);
  }
}

function randomData(num){
  var data = [];

  for(var i = 0; i < random(50,100); i++){
    data.push(random(1, num));
  }

  return data.sort(function(a,b){return a - b});
}

function limits(){
  var data = this.data;
  var classLength = Math.ceil(1 + (3.322 * Math.log10(data.length))); //Sturge's formula for finding the total class length
  var classWidth = Math.round((data[data.length - 1] - data[0])/classLength); //class size interval
  var classLimits = []; //stores class ranges

  var lowerLimit = data[0]; //starting lower limit class
  var upperLimit = lowerLimit + classWidth; //starting upper limit class

  for(var i = 0; i < classLength; i++){
    classLimits.push(String(lowerLimit) + '-' + String(upperLimit));
    lowerLimit = upperLimit + 1; //next lower limit in the class
    upperLimit = lowerLimit + classWidth; //upper limit for that class
  }

  return classLimits;
}

function dataFrequency(){
  var frequencies = {}; //stores data frequency tally
  var globalIterator = 0; //global iterator for the second loop

  for(var i = 0; i < this.classes.length; i++){ //loop through the class array
    var range = this.classes[i].match(/\d+/g); //match digits on the string
    var LCL = range[0]; //lower class limit
    var UCL = range[1]; //upper class limit

    frequencies[this.classes[i]] = 0; //initialize frequency value for the current class

    for(var val = globalIterator; val < this.data.length; val++){ //loop through the data array

      if(this.data[val] >= LCL && this.data[val] <= UCL){
        frequencies[this.classes[i]]++; //increment values that are LCL <= or >= UCL
      }
      else{
        globalIterator = val; //set global iterator to the last iteration of the val variable
        break; //break out of the data array
      }
    }

  }

  return frequencies;
}

function FDT(data){
  this.data = data;
  this.classes = limits.call(this);
  this.frequency = dataFrequency.call(this);
}

function createCanvas(width, height){
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.width = width;
  canvas.height = height;

  return canvas;
}

function drawGraph(){
  var canvas = createCanvas(500, 400);
  var ctx = canvas.getContext('2d');
  var height = 300;
  var width = 400;
  var pos = 105;

  var table = new FDT(randomData(100));
  console.log(table);

  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(100, height);
  ctx.lineTo(width, height);
  ctx.stroke();
  ctx.closePath();

  ctx.font = '17px Sans-serif';
  ctx.fillText('Number Range Classes', 130, height + 50);
  ctx.font = '15px Sans-serif';
  ctx.fillText('Frequency', 5, 200);
  for(var classes in table.frequency){
    var barHeight = (table.frequency[classes]/table.data.length) * height;
    var barWidth = width/(table.classes.length * 1.5);


    ctx.fillStyle = 'rgb(80,90,255)';
    ctx.fillRect(pos, height - 5, barWidth, -barHeight);
    ctx.strokeRect(pos, height - 5, barWidth, -barHeight);
    ctx.font = '10px Monospace';
    ctx.strokeText(classes, pos + 3, height + 15);
    pos+=barWidth;
  }
}

drawGraph();
