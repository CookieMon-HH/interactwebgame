class Stage {
  private _parentNode: Element;
  private _isStart: boolean;
  private _level : number;

  constructor() {
    this._level = 1;
    this._isStart = false;
    this.stageStart();
  }

  stageStart = () => {
    setTimeout(() => {
      this._isStart = true;
      this.stageGuide(`START LEVEL${this._level}`);
      this.callMonster();
    }, 2000);
  }

  stageGuide = (text: string) => {
    this._parentNode  = document.querySelector('.game_app');
    const textBox = document.createElement('div');
    textBox.className = 'stage_box';
    const textNode = document.createTextNode(text);
    textBox.appendChild(textNode);
    this._parentNode.appendChild(textBox);

    setTimeout(() => textBox.remove(), 1500);
  }

  callMonster = () => {
    allMonsterComProp.arr.push(new Monster(stageInfo.monster[this._level -1].defaultMonster(character.moveX)));
    allMonsterComProp.arr.push(new Monster(stageInfo.monster[this._level -1].bossMonster(character.moveX)));
  }

  clearStage = () => {
    stageInfo.callPosition.forEach((value) => {
      if(character.moveX >= value && allMonsterComProp.arr.length === 0){
        this.stageGuide('곧 몬스터가 몰려옵니다.')
        stageInfo.callPosition.shift();
        setTimeout(() => {
          this.callMonster();
          this._level++;
        }, 1000)

      }
    })
    if(allMonsterComProp.arr.length === 0 && this._isStart) {
      this._isStart = false;
      this._level++;
      if(this._level > stageInfo.monster.length) {
        this.stageGuide('ALL CLEAR!!!');
        return;
      }
      this.stageGuide('CLEAR!!!');
      this.stageStart();
      character.characterLevelUp();
    }
  }
}