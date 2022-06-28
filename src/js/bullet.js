class BulletRender {
    constructor() {
        this.parentNode = document.querySelector(".game");
        this.el = document.createElement("div");
        this.el.className = "hero_bullet";
        this.parentNode.appendChild(this.el);
    }
    render(x, y, direction) {
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
class DamageRender {
    constructor() {
        this.el = document.querySelector(".game_app");
    }
    render(damage, positionX, positionY) {
        const textDamageNode = document.createElement('div');
        textDamageNode.className = 'text_damage';
        const textDamage = document.createTextNode(`${damage}`);
        textDamageNode.appendChild(textDamage);
        this.el.appendChild(textDamageNode);
        textDamageNode.style.transform = `translate(${positionX}px,${-positionY}px)`;
        setTimeout(() => textDamageNode.remove(), 500);
    }
}
class Bullet {
    constructor(x, y, direction, attackDamage) {
        this.render = new BulletRender();
        this.damageRender = new DamageRender();
        this.y = y;
        this.speed = 30;
        this.distance = x;
        this.direction = direction;
        this.attackDamage = attackDamage;
        this.render.render(x, y, this.direction);
    }
    moveBullet(crashCallback, monsters) {
        if (this.direction === "left") {
            this.distance -= this.speed;
        }
        else {
            this.distance += this.speed;
        }
        this.render.render(this.distance, this.y, this.direction);
        this.crashBullet(crashCallback, monsters);
    }
    crashBullet(crashCallback, monsters) {
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
            this.renderDamage(crashedMonster);
        }
        if (left > gameProp.screenWidth || right < 0) {
            this.render.remove();
            crashCallback();
        }
    }
    renderDamage(monster) {
        let textPosition = Math.random() * -100;
        let damageX = monster.position().left + textPosition;
        let damageY = monster.position().top;
        this.damageRender.render(this.attackDamage, damageX, damageY);
    }
}
