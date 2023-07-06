const { symbol } = require("joi");

const x = "09:15"

const hour = x.substr(0, 2);
const minute = x.substr(-2, 2);

const array1 = [5, 12, 8, 130, 44];
const found = array1.filter(function (value) { return value == 10; })

const arr = ['one', 'two', 'three', 'four'];
const values = ['one'];
const multipleExist = values.every(value => {
  return arr.includes(value);
});

const now = new Date();
const nowConvert = now.getHours() * 60 + now.getMinutes();
function convertTime(time) {
  const hours = parseInt(time.substr(0, 2));
  const minutes = parseInt(time.substr(-2, 2));
  return hours * 60 + minutes;
}

const row = 4;
const col = 8;
const sym = ['A','B','C','D', 'E']
function convertIndex(position) {
  for (i =1; i<= row; i++) {
    if(position <= i*col) {
      return sym[i-1]
    }
  }
}

console.log(x.substr(3);)


