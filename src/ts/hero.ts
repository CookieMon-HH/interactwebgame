class HeroRender {
  el: HTMLDivElement;
  levelEl: HTMLDivElement;
  levelUpEl: HTMLDivElement;
  constructor(elClassName: string) {
    this.el = document.querySelector(elClassName);
    this.levelEl = document.querySelector('.level_box strong');
    this.levelUpEl = document.querySelector('.hero_box .level_up');
  }
  left() {
    this.el.classList.add("run");
    this.el.classList.add("flip");
  }
  right() {
    this.el.classList.add("run");
    this.el.classList.remove("flip");
  }
  moveEnd() {
    this.el.classList.remove("run");
  }
  attack() {
    this.el.classList.add("attack");
  }
  slide() {
    this.el.classList.add("slide");
  }
  slideEnd() {
    this.el.classList.remove("slide");
  }
  attackEnd() {
    this.el.classList.remove("attack");
  }
  crash() {
    this.el.classList.add("crash");
    setTimeout(() => {
      this.el.classList.remove("crash");
    }, 400);
  }
  dead() {
    this.el.classList.add("dead");
  }
  render(movex: number) {
    if(!(this.el.parentNode instanceof HTMLElement)) return;
    this.el.parentNode.style.transform = `translateX(${movex}px)`;
  }
  position() {
    const { left, right, top, height } = this.el.getBoundingClientRect();
    return {
      left,
      right,
      top: gameProp.screenHeight - top,
      bottom: gameProp.screenHeight - top - height,
    };
  }
  size() {
    return {
      width: this.el.offsetWidth,
      height: this.el.offsetHeight,
    };
  }
  levelUp(level: number) {
    this.levelEl.innerText = `${level}`;
		this.levelUpEl.classList.add('active');

		setTimeout(() => this.levelUpEl.classList.remove('active'), 1000);
  }
}
class HeroInfoRender {
  el: HTMLDivElement;
  expEl: HTMLDivElement;

  constructor() {
    this.el = document.querySelector('.state_box .hp span');
    this.expEl = document.querySelector('.hero_state .exp span');
  }
  render(hpProgress: number) {
    this.el.style.width = `${hpProgress}%`;
  }
  updateExp(expProgress: number) {
		this.expEl.style.width = `${expProgress}%`;
  }
}

interface IBulletComProp {
  launch: boolean;
  arr: Bullet[];
}

type DirectionType = 'left' | 'right';

class Hero {
  render: HeroRender;
  heroInfoRender: HeroInfoRender;
  moveX: number;
  speed: number;
  bulletComProp: IBulletComProp;
  direction: DirectionType;
  attackDamage: number;
  hpProgress: number;
  hpValue: number;
  defaultHpValue: number;
  deadEventCallback?: Function;
  slideSpeed: number;
  slideTime: number;
  slideMaxTime: number;
  level: number;
  exp: number;
  maxExp: number;
  expProgress: number;

  constructor(render: HeroRender) {
    this.render = render;
    this.heroInfoRender = new HeroInfoRender();
    this.moveX = 0;
    this.speed = 11;
    this.direction = 'right';
    this.attackDamage = 10000;
    this.bulletComProp = {
      launch: false,
      arr: [],
    };
    this.hpProgress = 0;
    this.hpValue = 100000;
    this.defaultHpValue = this.hpValue;
    this.slideSpeed = 14;
    this.slideTime = 0;
    this.slideMaxTime = 30;
		this.level = 1;
		this.exp = 0;
		this.maxExp = 3000;
		this.expProgress = 0;
  }
  keyMotion(key: IKey) {
    const { keyDown } = key;
    if (keyDown.left) {
      this.render.left();
      this.left();
    } else if (keyDown.right) {
      this.render.right();
      this.right();
    }

    if (keyDown.attack) {
      if (!this.bulletComProp.launch) {
        this.render.attack();
        this.attack();
      }
    }

    if(keyDown.slide) {
      this.render.slide();
      this.slide();
    }

    if (!keyDown.left && !keyDown.right) {
      this.render.moveEnd();
    }

    if (!keyDown.attack) {
      this.render.attackEnd();
      this.attackEnd();
    }

    if(!keyDown.slide) {
      this.render.slideEnd();
      this.slideEnd();
    }

    this.render.render(this.moveX);
  }

  left() {
    this.direction = 'left';
    this.moveX = this.moveX <= 0 ? 0 : this.moveX - this.speed;
  }
  right() {
    this.direction = 'right';
    this.moveX = this.moveX + this.speed;
  }
  attack() {
    const { bottom } = this.render.position();
    const { width, height } = this.render.size();
    const x = this.direction === 'right' ? this.moveX + width / 2 : this.moveX - width / 2;
    const y = bottom - height / 2;

    const hitDamage = this.attackDamage - Math.round(Math.random() * this.attackDamage * 0.1);
    this.bulletComProp.arr.push(new Bullet(x, y, this.direction, hitDamage));

    this.bulletComProp.launch = true;
  }
  attackEnd() {
    this.bulletComProp.launch = false;
  }
  slide() {
    if(this.isSlideDown()) {
      this.render.slideEnd();
    } else {
      this.slideTime++;
      if(this.direction === 'right') {
        this.moveX = this.moveX + this.slideSpeed;
      } else {
        this.moveX = this.moveX - this.slideSpeed;
      }
    }
  }
  slideEnd() {
    this.slideTime = 0;
  }
  position() {
    return this.render.position();
  }

  updateHp(damage: number) {
    this.hpValue = Math.max(this.hpValue - damage, 0);
    this.hpProgress = (this.hpValue / this.defaultHpValue) * 100;
    this.heroInfoRender.render(this.hpProgress);
    this.crash();
    if(this.hpValue === 0) {
      this.dead();
    }
  }

  crash() {
    this.render.crash();
  }

  dead() {
    this.render.dead();
    this.deadEventCallback && this.deadEventCallback();
  }

  addDeadEvent = (callback: Function) => {
    this.deadEventCallback = callback;
  }

  get bullets() {
    return this.bulletComProp.arr;
  }

  heroUpgrade(upDamage?: number) {
    let damage = upDamage ?? 5000;
    this.attackDamage += damage;
  }

  isSlideDown() {
    return this.slideMaxTime < this.slideTime;
  }
  updateExp(exp: number) {
		this.exp += exp;
		this.expProgress = this.exp / this.maxExp * 100;
    this.heroInfoRender.updateExp(this.expProgress);

		if(this.exp >= this.maxExp){
			this.levelUp();
		}
  }

	levelUp(){
		this.level += 1;
		this.exp = 0;
		this.maxExp = this.maxExp + this.level * 1000;
    this.render.levelUp(this.level);
		this.updateExp(this.exp);
		this.heroUpgrade();
    this.updateHp(-(this.defaultHpValue - this.hpValue));
	}
}
