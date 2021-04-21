import { hi } from './m1';

const sum = (a: number, b: number): number => {
  return a + b;
};

const obj = { name: 'sanki', age: 0 };
console.log('obj', obj);
obj.age = 24;
console.log('obj', obj);

console.log('sum', sum(1, 3));
console.log('hi', hi);

Promise.resolve(1).then(res => console.log('res', res));

let fn = (a: number, b: number): number => a + b;
fn(123, 456);
fn(77, 22);
