//雖然require兩次，但對象為同一個檔案，console.log只會跑一次
const Person2 = require('./Person2');   
const {Person, f2} = require('./Person2');

const p1 = new Person2.Person('David', 25);

console.log(p1.toString());
console.log(Person2.f2(9));