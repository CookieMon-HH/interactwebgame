
interface IKeyDown {
	left?: boolean;
	right?: boolean;
	attack?: boolean;
}

type KeyWhichType = 'left' | 'right' | 'attack';
interface IKeyValue {
	[key: number]: KeyWhichType;
}
interface IKey {
	keyDown: IKeyDown;
	keyValue: IKeyValue;
}

const key: IKey = {
	keyDown : {},
	keyValue : {
		37: 'left',
		39: 'right',
		88: 'attack'
	}
}

const gameBackground ={
	gameBox: document.querySelector('.game')
}

const gameProp = {
	screenWidth : window.innerWidth,
	screenHeight : window.innerHeight
}

const renderGame = () => {
	hero.keyMotion(key);
	setGameBackground();

	hero.bullets.forEach((bullet) => {
		bullet.moveBullet();
	});
	window.requestAnimationFrame(renderGame);
}

const setGameBackground = () => {
	let parallaxValue = Math.min(0, (hero.movex-gameProp.screenWidth/3) * -1);
	if(!(gameBackground.gameBox instanceof HTMLElement)) return;
	gameBackground.gameBox.style.transform = `translateX(${parallaxValue}px)`;
}

const windowEvent = () => {
	window.addEventListener('keydown', e => {
		key.keyDown[key.keyValue[e.which]] = true;
	});

	window.addEventListener('keyup', e => {
		key.keyDown[key.keyValue[e.which]] = false;
	});

	window.addEventListener('resize', e => {
		gameProp.screenWidth = window.innerWidth;
		gameProp.screenHeight = window.innerHeight;
	});
}

const loadImg = () => {
	const preLoadImgSrc = ['/assets/images/ninja_attack.png', '/assets/images/ninja_run.png'];
	preLoadImgSrc.forEach( arr => {
		const img = new Image();
		img.src = arr;
	});
}

let hero: Hero;

const init = () => {
	hero = new Hero(new HeroRender('.hero'));
	loadImg();
	windowEvent();
	renderGame();
}

window.onload = () => {
	init();
}






