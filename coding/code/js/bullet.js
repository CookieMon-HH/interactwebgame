class Bullet{
	constructor(){
		this.parentNode = document.querySelector('.game');
		this.el = document.createElement('div');
		this.el.className = 'character_bullet';
		this.x = 0;
		this.y = 0;
		this.speed = 30;
		this.distance = 0;
		this.init();
	}
	init(){
		this.x = character.position().left + character.size().width / 2;
		this.y = character.position().bottom - character.size().height / 2;
		this.distance = this.x;
		this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
		this.parentNode.appendChild(this.el);
	}
	moveBullet(){
		this.distance += this.speed;
		this.el.style.transform = `translate(${this.distance}px, ${this.y}px)`;
	}
}
