class BulletRender {
  parentNode: HTMLDivElement;
  el: HTMLDivElement;

  constructor() {
    this.parentNode = document.querySelector(".game");
    this.el = document.createElement("div");
    this.el.className = "hero_bullet";
    this.parentNode.appendChild(this.el);
  }

  render(x: number, y: number, direction: DirectionType) {
    const rotate = direction === "left" ? "rotate(180deg)" : "";
    this.el.style.transform = `translate(${x}px, ${y}px) ${rotate}`;
  }

  position() {
    return {
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom:
        gameProp.screenHeight -
        this.el.getBoundingClientRect().top -
        this.el.getBoundingClientRect().height,
    };
  }
  remove() {
    this.el.remove();
  }
}

class Bullet {
  render: BulletRender;
  x: number;
  y: number;
  speed: number;
  distance: number;
  direction: DirectionType;

  constructor(x: number, y: number, direction: DirectionType) {
    this.render = new BulletRender();
    this.y = y;
    this.speed = 30;
    this.distance = x;
    this.direction = direction;
    this.render.render(x, y, this.direction);
  }
  moveBullet() {
    if (this.direction === "left") {
      this.distance -= this.speed;
    } else {
      this.distance += this.speed;
    }
    this.render.render(this.distance, this.y, this.direction);
		this.crashBullet();
  }
  crashBullet() {
    const { left, right } = this.render.position();
    if (left > gameProp.screenWidth || right < 0) {
      this.render.remove();
    }
  }
}
