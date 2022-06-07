class HeroRender {
  el;
  constructor(el) {
    this.el = document.querySelector(el);
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
  render(movex) {
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

class Hero {
  render;
  movex;
  speed;
  bulletComProp;
  constructor(render) {
    this.render = render;
    this.movex = 0;
    this.speed = 16;
    this.bulletComProp = {
      launch: false,
      arr: [],
    };
  }
  keyMotion(key) {
    if (key.keyDown["left"]) {
      this.render.left();
      this.left();
    } else if (key.keyDown["right"]) {
      this.render.right();
      this.right();
    }

    if (key.keyDown["attack"]) {
      if (!this.bulletComProp.launch) {
        this.render.attack();
        this.attack();
      }
    }

    if (!key.keyDown["left"] && !key.keyDown["right"]) {
      this.render.moveEnd();
    }

    if (!key.keyDown["attack"]) {
      this.render.attackEnd();
      this.attackEnd();
    }

    this.render.render(this.movex);
  }

  left() {
    this.movex = this.movex - this.speed;
  }
  right() {
    this.movex = this.movex + this.speed;
  }
  attack() {
    const { left, bottom } = this.render.position();
    const { width, height } = this.render.size();
    const x = left + width / 2;
    const y = bottom - height / 2;

    this.bulletComProp.arr.push(new Bullet(x, y));

    this.bulletComProp.launch = true;
  }
  attackEnd() {
    this.bulletComProp.launch = false;
  }

  get bullets() {
    return this.bulletComProp.arr;
  }
}
