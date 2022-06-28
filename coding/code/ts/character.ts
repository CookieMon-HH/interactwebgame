interface ICharacterDamage {
  attack: number;
  defaultAttack: number;
  // 추후 스킬 추가
}

interface ICharacterHp {
  hpProgress: number;
  currentHp: number;
  defaultHp: number;
}

class Character {
  private _element: HTMLElement;
  private _moveX: number;
  private _speed: number;
  private _direction: CharacterDirection;
  private _damage : ICharacterDamage;
  private _hpInfo: ICharacterHp;

  constructor(element: string) {
    this._element = document.querySelector(element);
    this._moveX = 0;
    this._speed = 12;
    this._direction = CharacterDirection.RIGHT;
    this._damage = {
      attack: 1000,
      defaultAttack : 1000
    }
    this._hpInfo = {
      hpProgress : 0,
      currentHp: 10000,
      defaultHp: 10000
    };
  }
  
  get direction(){
    return this._direction;
  }
  
  get moveX(){
    return this._moveX;
  }

  get damage() {
    return this._damage;
  }
  
  keyMotion = () => {
    if (key.keyDown['left']) {
      this._direction = CharacterDirection.LEFT;
      this._element.classList.add('run');
      this._element.classList.add('flip');
      if(this._moveX <= 0) return;
      this._moveX = this._moveX - this._speed;
    } else if (key.keyDown['right']) {
      this._direction = CharacterDirection.RIGHT;
      this._element.classList.add('run');
      this._element.classList.remove('flip');
      this._moveX = this._moveX + this._speed;
    }
    
    if (key.keyDown['attack']) {
      if (!bulletComProp.launch) {
        this._element.classList.add('attack');
        bulletComProp.arr.push(new Bullet());
        bulletComProp.launch = true;
      }
    }
    
    if (!key.keyDown['left'] && !key.keyDown['right']) {
      this._element.classList.remove('run');
    }
    
    if (!key.keyDown['attack']) {
      this._element.classList.remove('attack');
      bulletComProp.launch = false;
    }
    this._element.parentElement.style.transform = `translateX(${this._moveX}px)`;
  }

  position = () => {
    return {
      left: this._element.getBoundingClientRect().left,
      right: this._element.getBoundingClientRect().right,
      top: gameProp.screenHeight - this._element.getBoundingClientRect().top,
      bottom: gameProp.screenHeight - this._element.getBoundingClientRect().top - this._element.getBoundingClientRect().height
    }
  }

  size = () => {
    return {
      width: this._element.offsetWidth,
      height: this._element.offsetHeight
    }
  }

  updateHp = (monsterDamage : number) => {
    this._hpInfo.currentHp = Math.max(0, this._hpInfo.currentHp - monsterDamage);
    this._hpInfo.hpProgress = this._hpInfo.currentHp / this._hpInfo.defaultHp * 100;

    const hpBox = document.querySelector('.state_box .hp span');
    if(hpBox instanceof HTMLSpanElement)
      hpBox.style.width = `${this._hpInfo.hpProgress}%`
    this.crash();
    if(this._hpInfo.currentHp === 0){
      this.dead();
    }
  }

  crash = () => {
    this._element.classList.add('crash');
    setTimeout(() => {
      this._element.classList.remove('crash');
    },400)
  }

  dead = () => {
    this._element.classList.add('dead');
    endGame();
  }

  hitDamage = () => {
    this._damage.attack = this._damage.defaultAttack -  Math.round(Math.random() * this._damage.defaultAttack * 0.1);
  }
}