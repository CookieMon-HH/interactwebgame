class Character {
    constructor(element) {
        this.keyMotion = () => {
            if (key.keyDown['left']) {
                this._direction = "LEFT" /* CharacterDirection.LEFT */;
                this._element.classList.add('run');
                this._element.classList.add('flip');
                if (this._moveX <= 0)
                    return;
                this._moveX = this._moveX - this._speed;
            }
            else if (key.keyDown['right']) {
                this._direction = "RIGHT" /* CharacterDirection.RIGHT */;
                this._element.classList.add('run');
                this._element.classList.remove('flip');
                this._moveX = this._moveX + this._speed;
            }
            if (key.keyDown['attack']) {
                if (!bulletComProp.launch) {
                    this._element.classList.add('attack');
                    bulletComProp.arr.push(new Bullet());
                    bulletComProp.launch = true;
                }
            }
            if (key.keyDown['slide']) {
                if (this._slideMotion.isKeyDown)
                    return;
                this._element.classList.add('slide');
                if (this._direction === "RIGHT" /* CharacterDirection.RIGHT */) {
                    this._moveX += this._slideMotion.speed;
                }
                else {
                    this._moveX -= this._slideMotion.speed;
                }
                if (this._slideMotion.currentTime > this._slideMotion.maxTime) {
                    this._element.classList.remove('slide');
                    this._slideMotion.isKeyDown = true;
                }
                this._slideMotion.currentTime += 1;
            }
            if (!key.keyDown['left'] && !key.keyDown['right']) {
                this._element.classList.remove('run');
            }
            if (!key.keyDown['attack']) {
                this._element.classList.remove('attack');
                bulletComProp.launch = false;
            }
            if (!key.keyDown['slide']) {
                this._element.classList.remove('slide');
                this._slideMotion.isKeyDown = false;
                this._slideMotion.currentTime = 0;
            }
            this._element.parentElement.style.transform = `translateX(${this._moveX}px)`;
        };
        this.position = () => {
            return {
                left: this._element.getBoundingClientRect().left,
                right: this._element.getBoundingClientRect().right,
                top: gameProp.screenHeight - this._element.getBoundingClientRect().top,
                bottom: gameProp.screenHeight - this._element.getBoundingClientRect().top - this._element.getBoundingClientRect().height
            };
        };
        this.size = () => {
            return {
                width: this._element.offsetWidth,
                height: this._element.offsetHeight
            };
        };
        this.minusHp = (monsterDamage) => {
            this._hpInfo.currentHp = Math.max(0, this._hpInfo.currentHp - monsterDamage);
            this.crash();
            if (this._hpInfo.currentHp === 0) {
                this.dead();
            }
            this.renderHp();
        };
        this.plusHp = (hp) => {
            this._hpInfo.currentHp = hp;
            this.renderHp();
        };
        this.renderHp = () => {
            this._hpInfo.hpProgress = this._hpInfo.currentHp / this._hpInfo.defaultHp * 100;
            const hpBox = document.querySelector('.state_box .hp span');
            if (hpBox instanceof HTMLSpanElement)
                hpBox.style.width = `${this._hpInfo.hpProgress}%`;
        };
        this.crash = () => {
            this._element.classList.add('crash');
            setTimeout(() => {
                this._element.classList.remove('crash');
            }, 400);
        };
        this.dead = () => {
            this._element.classList.add('dead');
            endGame();
        };
        this.hitDamage = () => {
            this._damage.attack = this._damage.defaultAttack - Math.round(Math.random() * this._damage.defaultAttack * 0.1);
        };
        this.characterLevelUp = () => {
            this._speed += 2;
        };
        this.updateExp = (exp) => {
            this._levelInfo.currentExp += exp;
            this._levelInfo.expProgress = this._levelInfo.currentExp / this._levelInfo.maxExp * 100;
            const expProgress = document.querySelector('.character_state .exp span');
            if (expProgress instanceof HTMLSpanElement)
                expProgress.style.width = `${this._levelInfo.expProgress}%`;
            if (this._levelInfo.currentExp >= this._levelInfo.maxExp) {
                this.levelUp();
            }
        };
        this.levelUp = () => {
            this._levelInfo.level += 1;
            this._levelInfo.currentExp -= this._levelInfo.maxExp;
            this._levelInfo.maxExp += this._levelInfo.level * 1000;
            document.querySelector('.level_box strong').innerHTML = this._levelInfo.level.toString();
            const levelGuide = document.querySelector('.character_box .level_up');
            levelGuide.classList.add('active');
            setTimeout(() => levelGuide.classList.remove('active'), 1000);
            this.updateExp(this._levelInfo.currentExp);
            this.characterLevelUp();
            this.plusHp(this._hpInfo.defaultHp);
        };
        this._element = document.querySelector(element);
        this._moveX = 0;
        this._speed = 12;
        this._levelInfo = {
            level: 1,
            currentExp: 0,
            maxExp: 3000,
            expProgress: 0
        };
        this._slideMotion = {
            speed: 14,
            currentTime: 0,
            maxTime: 30,
            isKeyDown: false
        };
        this._direction = "RIGHT" /* CharacterDirection.RIGHT */;
        this._damage = {
            attack: 100000,
            defaultAttack: 100000
        };
        this._hpInfo = {
            hpProgress: 0,
            currentHp: 1000000,
            defaultHp: 1000000
        };
    }
    get direction() {
        return this._direction;
    }
    get moveX() {
        return this._moveX;
    }
    get damage() {
        return this._damage;
    }
}
