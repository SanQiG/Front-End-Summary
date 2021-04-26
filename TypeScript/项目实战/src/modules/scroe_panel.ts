/**
 * @file score_panel.ts 定义记分牌类
 * @usage new ScorePanel();
 */

export default class ScorePanel {
  score = 0;
  level = 1;

  scoreEle: HTMLElement;
  levelEle: HTMLElement;

  constructor(public maxLevel: number, public upScoreStep: number) {
    this.scoreEle = <HTMLElement>document.querySelector('#score');
    this.levelEle = <HTMLElement>document.querySelector('#level');
  }

  addScore() {
    this.scoreEle.innerHTML = ++this.score + '';
    if (this.score % this.upScoreStep === 0) this.levelUp();
  }

  levelUp() {
    if (this.level < this.maxLevel) {
      this.levelEle.innerHTML = ++this.level + '';
    }
  }
}
