function random(a,b){
  if(b == undefined){
    return Math.floor(1 + Math.random() * a);
  }
  else{
    return Math.floor(a + Math.random() * b);
  }
}

function randomData(num){
  var data = [];

  for(var i = 0; i < random(70,100); i++){
    data.push(random(num));
  }

  return data.sort(function(a,b){return a - b});
}

function limits(){
  var data = this.data;
  var classLength = Math.ceil(1 + (3.322 * Math.log10(data.length))); //Sturge's formula for finding the total class length
  var classWidth = Math.round((data[data.length - 1] - data[0])/classLength);
  var classLimits = [];

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

function FDT(data_size){
  this.data = randomData(data_size);
  this.classes = limits.call(this);
  this.frequency = dataFrequency.call(this);
}

FDT.prototype.percentFrequency = function(){
  var percent = {};

  function toPercent(value, total){
    return Math.round((value/total * 100) * 10000)/10000;
  }

  for(var classes in this.frequency){
    percent[classes] = toPercent(this.frequency[classes], this.data.length);
  }

  return percent;
}

var table = new FDT(100);
var total = 0;
var percent = table.percentFrequency();

for(var items in percent){
  total += percent[items];
}

console.log(Math.round(total));
