class HeroRender {
  el: HTMLDivElement;
  constructor(elClassName: string) {
    this.el = document.querySelector(elClassName);
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
}
class HeroInfoRender {
  el: HTMLDivElement;
  constructor() {
    this.el = document.querySelector('.state_box .hp span');
  }
  render(hpProgress: number) {
    this.el.style.width = `${hpProgress}%`;
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

  constructor(render: HeroRender) {
    this.render = render;
    this.heroInfoRender = new HeroInfoRender();
    this.moveX = 0;
    this.speed = 11;
    this.direction = 'right';
    this.attackDamage = 1000;
    this.bulletComProp = {
      launch: false,
      arr: [],
    };
    this.hpProgress = 0;
    this.hpValue = 10000;
    this.defaultHpValue = this.hpValue;
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

    if (!keyDown.left && !keyDown.right) {
      this.render.moveEnd();
    }

    if (!keyDown.attack) {
      this.render.attackEnd();
      this.attackEnd();
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
}
