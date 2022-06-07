class BulletRender {
  parentNode;
  el;

  constructor() {
    this.parentNode = document.querySelector(".game");
    this.el = document.createElement("div");
    this.el.className = "hero_bullet";
    this.parentNode.appendChild(this.el);
  }

  render(x, y) {
    this.el.style.transform = `translate(${x}px, ${y}px)`;
  }
}

class Bullet {
  render;
  constructor(x, y) {
    this.render = new BulletRender();
    this.x = x;
    this.y = y;
    this.speed = 30;
    this.distance = x;
    this.render.render(x, y);
  }
  moveBullet() {
    this.distance += this.speed;
    this.render.render(this.distance, this.y);
  }
}
