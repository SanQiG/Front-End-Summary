type myType = {
  name: string,
  age: number
};

const obj: myType = {
  name: 'aaa',
  age: 222
};

interface myInterface {
  name: string;
  age: number;
}

interface myInterface {
  gender: string;
}

const obj2: myInterface = {
  name: '123',
  age: 123,
  gender: '123'
}

interface myinter {
  name: string;

  say(): void;
}

class myClass implements myinter {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  say(): void {
    console.log(this.name);
  }
}


class Person {
  private _name: string;
  private _age: number;

  constructor(name: string, age: number) {
    this._name = name;
    this._age = age;
  }

  get name() {
    return this._name;
  }

  set name(val) {
    this._name = val;
  }

  get age() {
    return this._age;
  }

  set age(val) {
    val > 0 && (this._age = val);
  }
}

// const p1 = new Person('sss', 22);
// console.log(p1.name);
// p1.name = 'qqq';
// console.log(p1.name);

class A {
  protected num: number;

  constructor(num: number) {
    this.num = num;
  }
}

class B extends A {
  test() {
    console.log(this.num);
  }

  get num1(): number {
    return this.num;
  }
}

// const b = new B(1);
// console.log(b.num1); // 报错

class C {
  constructor(public name: string, private age: number) {
  }
}

// const c = new C('xxx', 111);
// console.log('c', c);

function fn<T>(a: T): T {
  return a;
}

console.log(fn(123)); // 不指定泛型，ts 自动判断
console.log(fn<string>('hello')); // 指定泛型

const fn2 = <T, K>(a: T, b: K): T => {
  console.log(b);
  return a;
}

console.log(fn2('hello', 123));
console.log(fn2<string, number>('hello', 123));

interface Inter {
  length: number;
}

function fn3<T extends Inter>(a: T): number {
  return a.length;
}

console.log(fn3('hello'));
console.log(fn3({ length: 37 }));

class MyClass<T> {
  constructor(public name: T) {
  }
}

const mc = new MyClass('sanki');
console.log('mc', mc.name);
