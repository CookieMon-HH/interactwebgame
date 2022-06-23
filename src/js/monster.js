class MonsterRender {
    constructor(positionX) {
        this.parentNode = document.querySelector('.game');
        this.el = document.createElement('div');
        this.el.className = 'monster_box';
        this.elChildren = document.createElement('div');
        this.elChildren.className = 'monster';
        this.positionX = positionX;
        this.moveX = 0;
    }
    init(monsterHpRender) {
        this.el.appendChild(monsterHpRender.hpNode);
        this.el.appendChild(this.elChildren);
        this.parentNode.appendChild(this.el);
        this.el.style.left = `${this.positionX}px`;
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
    dead() {
        this.el.ontransitionend = this.el.remove;
        this.el.classList.add('remove');
    }
    render(speed, offsetX) {
        if (this.positionX + this.moveX + this.el.offsetWidth - offsetX <= 0) {
            this.moveX = offsetX - this.positionX + gameProp.screenWidth;
        }
        else {
            this.moveX -= speed;
        }
        this.el.style.transform = `translateX(${this.moveX}px)`;
    }
}
class MonsterHpRender {
    constructor() {
        this.hpNode = document.createElement('div');
        this.hpNode.className = 'hp';
        this.hpInner = document.createElement('span');
    }
    init() {
        this.hpNode.appendChild(this.hpInner);
    }
    updateHp(hpRate) {
        this.hpInner.style.transform = `scaleX(${hpRate}%)`;
    }
}
class Monster {
    constructor(positionX, hp) {
        this.defaultHpValue = hp;
        this.hpValue = hp;
        this.hpRender = new MonsterHpRender();
        this.hpRender.init();
        this.speed = 3;
        this.render = new MonsterRender(positionX);
        this.render.init(this.hpRender);
    }
    get hpRate() {
        return (this.hpValue / this.defaultHpValue) * 100;
    }
    position() {
        return this.render.position();
    }
    updateHp(attackDamage, deadCallback) {
        this.hpValue = Math.max(this.hpValue - attackDamage, 0);
        this.hpRender.updateHp(this.hpRate);
        if (this.hpValue === 0) {
            this.dead(deadCallback);
        }
    }
    dead(deadCallback) {
        this.render.dead();
        deadCallback();
    }
    moveMonster(offsetX) {
        this.render.render(this.speed, offsetX);
    }
}
