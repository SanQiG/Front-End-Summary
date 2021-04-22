abstract class Animal {
  name: string;

  constructor(name: string, age?: number) {
    this.name = name;
  }

  abstract say(): void;
}

class Dog extends Animal {
  age: number;

  constructor(name: string, age: number) {
    super(name);
    this.age = age;
  }

  say() {
    // super.say();
    console.log(`${this.name} - ${this.age} 汪汪汪`);
  }

  run() {
    console.log(`${this.name} - ${this.age} running`);
  }
}

class Cat extends Animal {
  say() {
    console.log(`${this.name} 喵喵喵`);
  }
}

const d1 = new Dog('?', 11);
const d2 = new Cat('!');
// const a1 = new Animal('.');

d1.say();
d1.run();
d2.say();
