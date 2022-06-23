class Monster {
    constructor() {
        this.position = () => {
            return {
                left: this._element.getBoundingClientRect().left,
                right: this._element.getBoundingClientRect().right,
                top: gameProp.screenHeight - this._element.getBoundingClientRect().top,
                bottom: gameProp.screenHeight - this._element.getBoundingClientRect().top - this._element.getBoundingClientRect().height
            };
        };
        this._parentNode = document.querySelector('.game');
        this._element = document.createElement('div');
        this._element.className = 'monster_box';
        this._elementChild = document.createElement('div');
        this._elementChild.className = 'monster';
        this.init();
    }
    init() {
        this._element.appendChild(this._elementChild);
        this._parentNode.appendChild(this._element);
    }
}
