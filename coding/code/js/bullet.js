class Bullet {
    constructor() {
        this.init = () => {
            this._direction = character.direction;
            this._x = this._direction === "RIGHT" /* CharacterDirection.RIGHT */ ? character.moveX + character.size().width / 2 : character.moveX - character.size().width / 2;
            this._y = character.position().bottom - character.size().height / 2;
            this._distance = this._x;
            this._element.style.transform = `translate(${this._x}px, ${this._y}px)`;
            this._parentNode.appendChild(this._element);
        };
        this.moveBullet = () => {
            let setRotate = '';
            if (this._direction === "LEFT" /* CharacterDirection.LEFT */) {
                this._distance -= this._speed;
                setRotate = 'rotate(180deg)';
            }
            else {
                this._distance += this._speed;
            }
            this._element.style.transform = `translate(${this._distance}px, ${this._y}px) ${setRotate}`;
            this.crashBullet();
        };
        this.position = () => {
            return {
                left: this._element.getBoundingClientRect().left,
                right: this._element.getBoundingClientRect().right,
                top: gameProp.screenHeight - this._element.getBoundingClientRect().top,
                bottom: gameProp.screenHeight - this._element.getBoundingClientRect().top - this._element.getBoundingClientRect().height
            };
        };
        this.crashBullet = () => {
            if (this.position().left > gameProp.screenWidth || this.position().right < 0) {
                this._element.remove();
            }
        };
        this._parentNode = document.querySelector('.game');
        this._element = document.createElement('div');
        this._element.className = 'character_bullet';
        this._x = 0;
        this._y = 0;
        this._speed = 5;
        this._distance = 0;
        this._direction = "RIGHT" /* CharacterDirection.RIGHT */;
        this.init();
    }
}
