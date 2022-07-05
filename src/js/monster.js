var MonsterType;
(function (MonsterType) {
    MonsterType["PINK"] = "PINK";
    MonsterType["YELLOW"] = "YELLOW";
    MonsterType["GREEN"] = "GREEN";
    MonsterType["PINK_BOSS"] = "PINK_BOSS";
    MonsterType["YELLOW_BOSS"] = "YELLOW_BOSS";
    MonsterType["GREEN_BOSS"] = "GREEN_BOSS";
})(MonsterType || (MonsterType = {}));
const MonsterProps = {
    PINK: {
        name: 'pink_mon',
        hpValue: 200000,
        speed: 4,
        crashDamage: 300,
        score: 3000,
    },
    GREEN: {
        name: 'green_mon',
        hpValue: 44000,
        speed: 4,
        crashDamage: 300,
        score: 1000,
    },
    YELLOW: {
        name: 'yellow_mon',
        hpValue: 84000,
        speed: 4,
        crashDamage: 300,
        score: 2000,
    },
    PINK_BOSS: {
        name: 'pink_mon_boss',
        hpValue: 5200000,
        speed: 3,
        crashDamage: 2000,
        score: 30000,
    },
    GREEN_BOSS: {
        name: 'green_mon_boss',
        hpValue: 800000,
        speed: 4,
        crashDamage: 1000,
        score: 10000,
    },
    YELLOW_BOSS: {
        name: 'yellow_mon_boss',
        hpValue: 1800000,
        speed: 4,
        crashDamage: 2000,
        score: 20000,
    }
};
class MonsterRender {
    constructor(positionX, name) {
        this.parentNode = document.querySelector('.game');
        this.el = document.createElement('div');
        this.el.className = `monster_box ${name}`;
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
    constructor(positionX, monsterType) {
        const monsterProps = MonsterProps[monsterType];
        this.defaultHpValue = monsterProps.hpValue;
        this.hpValue = monsterProps.hpValue;
        this.hpRender = new MonsterHpRender();
        this.hpRender.init();
        this.speed = monsterProps.speed;
        this.crashDamage = monsterProps.crashDamage;
        this.score = monsterProps.score;
        this.render = new MonsterRender(positionX, monsterProps.name);
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
        this.setScore();
    }
    moveMonster(offsetX) {
        this.render.render(this.speed, offsetX);
    }
    crash(hero) {
        const rightDiff = 30;
        const leftDiff = 90;
        const { left: heroLeft, right: heroRight } = hero.position();
        const { left: monsterLeft, right: monsterRight } = this.position();
        if (heroRight - rightDiff > monsterLeft && heroLeft + leftDiff < monsterRight) {
            hero.updateHp(this.crashDamage);
        }
    }
    setScore() {
        stageInfo.totalScore += this.score;
        const el = document.querySelector('.score_box');
        if (el) {
            el.innerText = `${stageInfo.totalScore}`;
        }
    }
}
