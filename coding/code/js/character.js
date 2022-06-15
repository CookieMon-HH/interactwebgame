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
            if (!key.keyDown['left'] && !key.keyDown['right']) {
                this._element.classList.remove('run');
            }
            if (!key.keyDown['attack']) {
                this._element.classList.remove('attack');
                bulletComProp.launch = false;
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
        this._element = document.querySelector(element);
        this._moveX = 0;
        this._speed = 10;
        this._direction = "RIGHT" /* CharacterDirection.RIGHT */;
    }
    get direction() {
        return this._direction;
    }
    get moveX() {
        return this._moveX;
    }
}
