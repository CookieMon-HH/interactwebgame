class Bullet{
	private _parentNode : Element;
	private _element : HTMLDivElement;
	private _x: number;
	private _y: number;
	private _speed: number;
	private _distance: number;
	private _direction : CharacterDirection;
	
	constructor(){
		this._parentNode = document.querySelector('.game');
		this._element = document.createElement('div');
		this._element.className = 'character_bullet';
		this._x = 0;
		this._y = 0;
		this._speed = 20;
		this._distance = 0;
		this._direction = CharacterDirection.RIGHT;
		this.init();
	}
	
	init = () =>{
		this._direction = character.direction;
		this._x = this._direction === CharacterDirection.RIGHT? character.moveX + character.size().width / 2 : character.moveX - character.size().width / 2;
		this._y = character.position().bottom - character.size().height / 2;
		this._distance = this._x;
		this._element.style.transform = `translate(${this._x}px, ${this._y}px)`;
		this._parentNode.appendChild(this._element);
	}
	
	moveBullet = () => {
		let setRotate = '';
		if(this._direction === CharacterDirection.LEFT){
			this._distance -= this._speed;
			setRotate = 'rotate(180deg)';
		}else {
			this._distance += this._speed;
		}
		this._element.style.transform = `translate(${this._distance}px, ${this._y}px) ${setRotate}`;
		this.crashBullet();
	}
	
	position = () => {
		return {
			left: this._element.getBoundingClientRect().left,
			right: this._element.getBoundingClientRect().right,
			top: gameProp.screenHeight - this._element.getBoundingClientRect().top,
			bottom: gameProp.screenHeight - this._element.getBoundingClientRect().top - this._element.getBoundingClientRect().height
		}
	}

	crashBullet = () => {
		allMonsterComProp.arr.forEach((monster, index) => {
			if (this.position().right > monster.position().left && this.position().right < monster.position().right) {
				bulletComProp.arr.forEach((value, index) => {
					if (value === this) {
						character.hitDamage();
						bulletComProp.arr.splice(index, 1);
						this._element.remove();
						this.damageView(monster);
						monster.updateHp(index);
					}
				})
			}
		})

		if(this.position().left > gameProp.screenWidth || this.position().right < 0){
			bulletComProp.arr.forEach((value, index) => {
				if(value === this){
					bulletComProp.arr.splice(index, 1);
					this._element.remove();
				}
			})
		}
	}

	damageView = (monster : Monster) => {
		this._parentNode = document.querySelector('.game_app');

		const textDamageNode : HTMLDivElement = document.createElement('div');
		textDamageNode.className = 'text_damage';
		const textDamage : Text = document.createTextNode(character.damage.attack);

		const textPosition = Math.random() * -100;
		const damageX = monster.position().left + textPosition;
		const damageY = monster.position().top;

		textDamageNode.style.transform = `translate(${damageX}px, ${-damageY}px)`

		textDamageNode.appendChild(textDamage);
		this._parentNode.appendChild(textDamageNode);

		setTimeout(() => {
			textDamageNode.remove();
		}, 500)
	}
}
