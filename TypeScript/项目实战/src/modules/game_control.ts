/**
 * @file game_control.ts
 * @usage new Food();
 */

import Food from './food';
import Snake from './snake';
import ScorePanel from './scroe_panel';

export default class GameControl {
  food: Food;
  snake: Snake;
  scorePanel: ScorePanel;
  direction = '';
  isAlive = true;

  constructor() {
    this.food = new Food();
    this.snake = new Snake();
    this.scorePanel = new ScorePanel(10, 10);

    this.init();
  }

  // 游戏初始化
  init() {
    document.addEventListener('keydown', this.keydownHandler.bind(this));
    this.run();
  }

  keydownHandler(evt: KeyboardEvent) {
    this.direction = evt.key;
  }

  run() {
    let X = this.snake.X;
    let Y = this.snake.Y;

    switch (this.direction) {
      case 'ArrowUp':
      case 'Up':
        Y -= 10;
        break;
      case 'ArrowDown':
      case 'Down':
        Y += 10;
        break;
      case 'ArrowLeft':
      case 'Left':
        X -= 10;
        break;
      case 'ArrowRight':
      case 'Right':
        X += 10;
        break;
    }

    this.checkEat(X, Y);

    try {
      this.snake.X = X;
      this.snake.Y = Y;
    } catch (err) {
      this.isAlive = false;
      alert('game over');
    }


    this.isAlive
      && setTimeout(this.run.bind(this), 300 - (this.scorePanel.level - 1) * 30);
  }

  checkEat(X: number, Y: number) {
    if (X === this.food.X && Y === this.food.Y) {
      this.snake.addBody();
      this.food.change();
      this.scorePanel.addScore();
    }
  }
}
