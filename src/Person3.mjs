//mjs=> ES Modules

class Person{

  constructor(name='noname', age=0){
    this.name = name;
    this.age = age;
  }
toString(){
  const {name , age}= this;
  return JSON.stringify({name,age});
}
}

export const f2 = a=>a*a;
const f3 = a=>a*a*a;

console.log(`這是在Person2裡`);
export default Person;   //預設匯出的東西，default 只能有一個
export {f3};
