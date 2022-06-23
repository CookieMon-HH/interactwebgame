interface ICurrentMaxInfo {
  max: number;
  current: number;
}

interface IMonsterInfo {
  hp: ICurrentMaxInfo;
  speed: number;
  moveX: number;
  initPositionX: number;
}

class Monster {
  private _parentNode: HTMLDivElement;
  private _element: HTMLDivElement;
  private _elementChild: HTMLDivElement;
  private _hpNode: HTMLDivElement;
  private _hpInner: HTMLSpanElement;
  private _monsterInfo: IMonsterInfo;
  private _hpProgressValue: number;

  constructor(positionX: number, maxHp: number) {
    this._parentNode = document.querySelector('.game');
    this._element = document.createElement('div');
    this._element.className = 'monster_box';
    this._elementChild = document.createElement('div');
    this._elementChild.className = 'monster';
    this._hpNode = document.createElement('div');
    this._hpNode.className = 'hp';
    this._monsterInfo = {
      hp: {
        max: maxHp,
        current: maxHp,
      },
      speed: 10,
      moveX: 0,
      initPositionX: positionX
    };
    this._hpProgressValue = 0;
    this._hpInner = document.createElement('span');
    this.init(positionX);
  }

  init = (positionX: number) => {
    this._hpNode.appendChild(this._hpInner);
    this._element.appendChild(this._hpNode);
    this._element.appendChild(this._elementChild);
    this._parentNode.appendChild(this._element);

    this._element.style.left = `${positionX}px`;
  }

  position = () => {
    return {
      left: this._element.getBoundingClientRect().left,
      right: this._element.getBoundingClientRect().right,
      top: gameProp.screenHeight - this._element.getBoundingClientRect().top,
      bottom: gameProp.screenHeight - this._element.getBoundingClientRect().top - this._element.getBoundingClientRect().height
    }
  }

  updateHp = (currentIdx: number) => {
    this._monsterInfo.hp.current = Math.max(this._monsterInfo.hp.current - character.damage.attack, 0);
    this._hpProgressValue = this._monsterInfo.hp.current / this._monsterInfo.hp.max * 100;

    const temp = this._element.children[0].children[0];
    if (temp instanceof HTMLSpanElement)
      temp.style.width = `${this._hpProgressValue}%`
    if (this._monsterInfo.hp.current === 0) {
      this.dead(currentIdx);
    }

  }

  dead = (currentIdx: number) => {
    this._element.classList.add('remove');
    setTimeout(() => {
      this._element.remove();
    }, 200);
    allMonsterComProp.arr.splice(currentIdx, 1);
  }

  move = () => {
    const calcValue = this._monsterInfo.moveX + this._monsterInfo.initPositionX +
      this._element.offsetWidth + character.position().left - character.moveX
    if (calcValue <= 0) {
      this._monsterInfo.moveX =
        character.moveX - this._monsterInfo.initPositionX + gameProp.screenWidth - character.position().left;
    } else {
      this._monsterInfo.moveX -= this._monsterInfo.speed;
    }
    this._element.style.transform = `translateX(${this._monsterInfo.moveX}px)`
  }
}