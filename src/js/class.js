class Hero {
    constructor(el) {
        this.el = document.querySelector(el);
        this.movex = 0;
        this.speed = 11;
        this.direction = 'right';
    }
    keyMotion() {
        if (key.keyDown['left']) {
            this.direction = 'left';
            this.el.classList.add('run');
            this.el.classList.add('flip');
            this.movex = this.movex <= 0 ? 0 : this.movex - this.speed;
        }
        else if (key.keyDown['right']) {
            this.direction = 'right';
            this.el.classList.add('run');
            this.el.classList.remove('flip');
            this.movex = this.movex + this.speed;
        }
        if (key.keyDown['attack']) {
            if (!bulletComProp.launch) {
                this.el.classList.add('attack');
                bulletComProp.arr.push(new Bullet());
                bulletComProp.launch = true;
            }
        }
        if (!key.keyDown['left'] && !key.keyDown['right']) {
            this.el.classList.remove('run');
        }
        if (!key.keyDown['attack']) {
            this.el.classList.remove('attack');
            bulletComProp.launch = false;
        }
        this.el.parentNode.style.transform = `translateX(${this.movex}px)`;
    }
    position() {
        return {
            left: this.el.getBoundingClientRect().left,
            right: this.el.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
            bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
        };
    }
    size() {
        return {
            width: this.el.offsetWidth,
            height: this.el.offsetHeight
        };
    }
}
class Bullet {
    constructor() {
        this.parentNode = document.querySelector('.game');
        this.el = document.createElement('div');
        this.el.className = 'hero_bullet';
        this.x = 0;
        this.y = 0;
        this.speed = 30;
        this.distance = 0;
        this.bulletDirection = 'right';
        this.init();
    }
    init() {
        this.bulletDirection = hero.direction === 'left' ? 'left' : 'right';
        this.x = this.bulletDirection === 'right' ? hero.movex + hero.size().width / 2 : hero.movex - hero.size().width / 2;
        this.y = hero.position().bottom - hero.size().height / 2;
        this.distance = this.x;
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.parentNode.appendChild(this.el);
    }
    moveBullet() {
        let setRotate = '';
        if (this.bulletDirection === 'left') {
            this.distance -= this.speed;
            setRotate = 'rotate(180deg)';
        }
        else {
            this.distance += this.speed;
        }
        this.el.style.transform = `translate(${this.distance}px, ${this.y}px) ${setRotate}`;
        this.crashBullet();
    }
    position() {
        return {
            left: this.el.getBoundingClientRect().left,
            right: this.el.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
            bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
        };
    }
    crashBullet() {
        if (this.position().left > gameProp.screenWidth || this.position().right < 0) {
            this.el.remove();
        }
    }
}
