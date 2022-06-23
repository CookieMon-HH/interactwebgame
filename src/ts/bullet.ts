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
    const { left, right, top, height } = this.el.getBoundingClientRect();
    return {
      left: left,
      right: right,
      top: gameProp.screenHeight - top,
      bottom: gameProp.screenHeight - top - height,
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
  attackDamage: number;

  constructor(x: number, y: number, direction: DirectionType, attackDamage: number) {
    this.render = new BulletRender();
    this.y = y;
    this.speed = 30;
    this.distance = x;
    this.direction = direction;
    this.attackDamage = attackDamage;
    this.render.render(x, y, this.direction);
  }
  moveBullet(crashCallback: Function, monsters: Monster[]) {
    if (this.direction === "left") {
      this.distance -= this.speed;
    } else {
      this.distance += this.speed;
    }
    this.render.render(this.distance, this.y, this.direction);
    this.crashBullet(crashCallback, monsters);
  }
  crashBullet(crashCallback: Function, monsters: Monster[]) {
    const { left, right } = this.render.position();
    const crashedMonsterIndex = monsters.findIndex((monster) => {
      const { left: monsterLeft, right: monsterRight } = monster.position();
      return left > monsterLeft && right < monsterRight;
    });
    const crashedMonster = monsters[crashedMonsterIndex];
    if (crashedMonster) {
      this.render.remove();
      crashCallback();
      crashedMonster.updateHp(this.attackDamage, () => {
        monsters.splice(crashedMonsterIndex, 1);
      });
    }

    if (left > gameProp.screenWidth || right < 0) {
      this.render.remove();
      crashCallback();
    }
  }
}
