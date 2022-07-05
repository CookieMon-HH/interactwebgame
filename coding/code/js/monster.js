class Monster {
    constructor(monsterInfo) {
        this.init = (positionX) => {
            this._hpNode.appendChild(this._hpInner);
            this._element.appendChild(this._hpNode);
            this._element.appendChild(this._elementChild);
            this._parentNode.appendChild(this._element);
            this._element.style.left = `${positionX}px`;
        };
        this.position = () => {
            return {
                left: this._element.getBoundingClientRect().left,
                right: this._element.getBoundingClientRect().right,
                top: gameProp.screenHeight - this._element.getBoundingClientRect().top,
                bottom: gameProp.screenHeight - this._element.getBoundingClientRect().top - this._element.getBoundingClientRect().height
            };
        };
        this.updateHp = (currentIdx) => {
            this._monsterInfo.hp.current = Math.max(this._monsterInfo.hp.current - character.damage.attack, 0);
            this._hpProgressValue = this._monsterInfo.hp.current / this._monsterInfo.hp.max * 100;
            const temp = this._element.children[0].children[0];
            if (temp instanceof HTMLSpanElement)
                temp.style.width = `${this._hpProgressValue}%`;
            if (this._monsterInfo.hp.current === 0) {
                this.dead(currentIdx);
            }
        };
        this.setScore = () => {
            stageInfo.totalScore += this._monsterInfo.score;
            const tempElem = document.querySelector('.score_box');
            tempElem.innerText = stageInfo.totalScore.toString();
        };
        this.dead = (currentIdx) => {
            this._element.classList.add('remove');
            setTimeout(() => {
                this._element.remove();
            }, 200);
            allMonsterComProp.arr.splice(currentIdx, 1);
            this.setScore();
        };
        this.move = () => {
            const calcValue = this._monsterInfo.moveX + this._monsterInfo.initPositionX +
                this._element.offsetWidth + character.position().left - character.moveX;
            if (calcValue <= 0) {
                this._monsterInfo.moveX =
                    character.moveX - this._monsterInfo.initPositionX + gameProp.screenWidth - character.position().left;
            }
            else {
                this._monsterInfo.moveX -= this._monsterInfo.speed;
            }
            this._element.style.transform = `translateX(${this._monsterInfo.moveX}px)`;
            this.crash();
        };
        this.crash = () => {
            const rightDiff = 30;
            const leftDiff = 90;
            if (character.position().right - rightDiff > this.position().left && character.position().left + leftDiff < this.position().right) {
                character.updateHp(this._monsterInfo.crashDamage);
            }
        };
        this._monsterInfo = monsterInfo;
        this._parentNode = document.querySelector('.game');
        this._element = document.createElement('div');
        this._element.className = 'monster_box ' + this._monsterInfo.className;
        this._elementChild = document.createElement('div');
        this._elementChild.className = 'monster';
        this._hpNode = document.createElement('div');
        this._hpNode.className = 'hp';
        this._hpProgressValue = 0;
        this._hpInner = document.createElement('span');
        this.init(this._monsterInfo.initPositionX);
    }
}
