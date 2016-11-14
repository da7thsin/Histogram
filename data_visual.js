//Helper function that returns a random number:
//if the second parameter is not given, chooses a number from 0 to the given number.
//else, chooses from the first parameter number to the second one.
function random(a,b){
  if(b == undefined){
    return Math.floor(Math.random() * a);
  }
  else{
    return Math.floor(a + Math.random() * b);
  }
}

//Creates a canvas on the HTML document with the given Width and Height.
function createCanvas(x, y){
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.width = x;
  canvas.height = y;

  return canvas;
}

//Frequency Distribution Table Constructor
function FDT(data_size){

  //Data Property: an array filled with random numbers from 1 to the given Data Size
  //the array length is at random from 70 to 100
  this.data = (function(size){
    var numbers = [];

    for(var i = 0; i < random(70,100); i++){
      numbers.push(random(1, size));
    }
    return numbers.sort(function(a,b){return a - b});
  })(data_size);


  //Classes Property: Holds an array of number class limits or ranges
  this.classes = (function(data){
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
  })(this.data);


  //Frequency Property: Counts the frequency of the numbers in the data property
  //to the appropriate class range
  this.frequency = (function(classes,data){
      var frequencies = {}; //stores data frequency tally
      var globalIterator = 0; //global iterator for the second loop

      for(var i = 0; i < classes.length; i++){ //loop through the class array
        var range = classes[i].match(/\d+/g); //match digits on the string
        var LCL = range[0]; //lower class limit
        var UCL = range[1]; //upper class limit

        frequencies[classes[i]] = 0; //initialize frequency value for the current class

        for(var val = globalIterator; val < data.length; val++){ //loop through the data array
          if(data[val] >= LCL && data[val] <= UCL){
            frequencies[classes[i]]++; //increment values that are LCL <= or >= UCL
          }
          else{
            globalIterator = val; //set global iterator to the last iteration of the val variable
            break; //break out of the data array and go over the next class range
          }
        }

      }

    return frequencies;
  })(this.classes, this.data);


  //Draw Histogram Method: draws a histogram of the data
  this.drawHistogram = function(){
      var canvas = createCanvas(500, 400);
      var ctx = canvas.getContext('2d');
      var height = 300; //vertical line location
      var width = 400; //horizontal line location
      var pos = 105; //draw position

      ctx.beginPath();
      ctx.moveTo(100, 100); //move drawing origin
      ctx.lineTo(100, height); //draw vertical-axis
      ctx.lineTo(width, height); //draw horizontal-axis
      ctx.stroke(); //draw lines
      ctx.closePath();

      ctx.font = '17px Sans-serif';
      ctx.fillText('Number Range Classes', 130, height + 20);
      ctx.font = '15px Sans-serif';
      ctx.fillText('Frequency', 5, 200);

      for(var classes in this.frequency){
        var barHeight = (this.frequency[classes]/this.data.length) * height;
        var barWidth = width/(this.classes.length * 1.5);


        ctx.fillStyle = 'rgb(80,90,255)';
        ctx.fillRect(pos, height - 5, barWidth, -barHeight); //draw rectangle
        ctx.strokeRect(pos, height - 5, barWidth, -barHeight); //draw outline
        ctx.font = '9px Monospace';
        ctx.strokeText(classes, pos + 3, (height - barHeight) - 7);
        pos+=barWidth; //move rectangle's position
      }

  }

}

var table = new FDT(100);

table.drawHistogram();
