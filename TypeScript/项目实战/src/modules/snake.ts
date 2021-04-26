/**
 * @file snake.ts 定义蛇类
 * @usage new Snake();
 */

 export default class Snake {
  container: HTMLElement;
  head: HTMLElement;
  bodies: HTMLCollection;

  constructor() {
    this.container = <HTMLElement>document.querySelector('#snake');
    this.head = <HTMLElement>this.container.querySelector('div');
    this.bodies = <HTMLCollection>this.container.getElementsByTagName('div');
  }

  get X() {
    return this.head.offsetLeft;
  }

  get Y() {
    return this.head.offsetTop;
  }

  set X(val) {
    if (this.X === val) return;
    if (val < 0 || val > 340) {
      throw new Error('hit wall!!');
    }
    if (this.bodies[1] && (<HTMLElement>this.bodies[1]).offsetLeft === val) {

    }
    this.movebody();
    this.head.style.left = `${val}px`;
  }

  set Y(val) {
    if (this.Y === val) return;
    if (val < 0 || val > 340) {
      throw new Error('hit wall!!');
    }
    if (this.bodies[1] && (<HTMLElement>this.bodies[1]).offsetTop === val) {
      return;
    }
    this.movebody();
    this.head.style.top = `${val}px`;
  }

  addBody() {
    this.container.insertAdjacentHTML('beforeend', '<div></div>');
  }

  movebody() {
    for (let i = this.bodies.length - 1; i > 0; --i) {
      const ele = <HTMLElement>this.bodies[i - 1];
      const ele2 = <HTMLElement>this.bodies[i];
      const X = ele.offsetLeft;
      const Y = ele.offsetTop;
      ele2.style.left = `${X}px`;
      ele2.style.top = `${Y}px`;
    }
  }
}
