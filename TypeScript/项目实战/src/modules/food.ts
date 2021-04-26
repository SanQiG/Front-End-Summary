/**
 * @file food.ts 定义食物类
 * @usage new Food();
 */

export default class Food {
  // 定义一个属性表示食物所对应的元素
  element: HTMLElement;

  constructor() {
    this.element = <HTMLElement>document.querySelector('#food');
  }

  // 获取食物 x 轴坐标的方法
  get X() {
    return this.element.offsetLeft;
  }

  // 获取食物 y 轴坐标的方法
  get Y() {
    return this.element.offsetTop;
  }

  // 修改食物的位置
  change() {
    let left = Math.round(Math.random() * 29) * 10;
    let top = Math.round(Math.random() * 29) * 10;
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }
}
