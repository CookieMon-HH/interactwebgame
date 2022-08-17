enum  MonsterType {
    PINK = 'PINK',
    YELLOW = 'YELLOW',
    GREEN = 'GREEN',
    PINK_BOSS = 'PINK_BOSS',
    YELLOW_BOSS = 'YELLOW_BOSS',
    GREEN_BOSS = 'GREEN_BOSS',
}

interface IMonsterProps {
    name: string;
    hpValue: number;
    speed: number;
    crashDamage: number;
    score: number;
    exp: number;
}

const MonsterProps: Record<MonsterType, IMonsterProps> = {
    PINK: {
        name: 'pink_mon',
        hpValue: 200000,
        speed: 4,
        crashDamage: 300,
        score: 3000,
        exp: 3000,
    },
    GREEN: {
        name: 'green_mon',
        hpValue: 44000,
        speed: 4,
        crashDamage: 300,
        score: 1000,
        exp: 1000,
    },
    YELLOW: {
        name: 'yellow_mon',
        hpValue: 84000,
        speed: 4,
        crashDamage: 300,
        score: 2000,
        exp: 2000,
    },
    PINK_BOSS: {
        name: 'pink_mon_boss',
        hpValue: 5200000,
        speed: 3,
        crashDamage: 2000,
        score: 30000,
        exp: 30000,
    },
    GREEN_BOSS: {
        name: 'green_mon_boss',
        hpValue: 800000,
        speed: 4,
        crashDamage: 1000,
        score: 10000,
        exp: 10000,
    },
    YELLOW_BOSS: {
        name: 'yellow_mon_boss',
        hpValue: 1800000,
        speed: 4,
        crashDamage: 2000,
        score: 20000,
        exp: 20000,
    }
}

class MonsterRender {
    parentNode: HTMLElement;
    el: HTMLElement;
    elChildren: HTMLElement;
    positionX: number;
    moveX: number;

    constructor(positionX: number, name: string) {
        this.parentNode = document.querySelector('.game');
        this.el = document.createElement('div');
        this.el.className = `monster_box ${name}`;
        this.elChildren = document.createElement('div');
        this.elChildren.className = 'monster';
        this.positionX = positionX;
        this.moveX = 0;
    }

    init(monsterHpRender: MonsterHpRender) {
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
    render(speed: number, offsetX: number) {
        if (this.positionX + this.moveX + this.el.offsetWidth - offsetX <= 0) {
            this.moveX = offsetX - this.positionX + gameProp.screenWidth;
        } else {
            this.moveX -= speed;
        }
        this.el.style.transform = `translateX(${this.moveX}px)`;
    }
}

class MonsterHpRender {
    hpNode: HTMLElement;
    hpInner: HTMLElement;

    constructor() {
        this.hpNode = document.createElement('div');
        this.hpNode.className = 'hp';
        this.hpInner = document.createElement('span');
    }

    init() {
        this.hpNode.appendChild(this.hpInner);
    }

    updateHp(hpRate: number) {
        this.hpInner.style.transform = `scaleX(${hpRate}%)`;
    }
}

class Monster {
    render: MonsterRender;
    hpRender: MonsterHpRender;
    defaultHpValue: number;
    hpValue: number;
    speed: number;
    crashDamage: number;
    score: number;
    exp: number;

    constructor(positionX: number, monsterType: MonsterType) {
        const monsterProps = MonsterProps[monsterType];
        this.defaultHpValue = monsterProps.hpValue;
        this.hpValue = monsterProps.hpValue;
        this.hpRender = new MonsterHpRender();
        this.hpRender.init();
        this.speed = monsterProps.speed;
        this.crashDamage = monsterProps.crashDamage;
        this.score = monsterProps.score;
        this.exp = monsterProps.exp;

        this.render = new MonsterRender(positionX, monsterProps.name);
        this.render.init(this.hpRender);
    }

    get hpRate() {
        return (this.hpValue / this.defaultHpValue) * 100;
    }

    position() {
        return this.render.position();
    }

    updateHp(attackDamage: number, deadCallback: Function) {
        this.hpValue = Math.max(this.hpValue - attackDamage, 0);
        this.hpRender.updateHp(this.hpRate);
        if (this.hpValue === 0) {
            this.dead(deadCallback);
        }
    }
    dead(deadCallback: Function) {
        this.render.dead();
        deadCallback();
        this.setScore();
        this.setExp();
    }
    moveMonster(offsetX: number) {
        this.render.render(this.speed, offsetX);
    }
    crash(hero: Hero) {
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
        const el = document.querySelector<HTMLDivElement>('.score_box');
        if(el) {
            el.innerText = `${stageInfo.totalScore}`;
        }
    }
    setExp() {
        hero.updateExp(this.exp);
    }
}