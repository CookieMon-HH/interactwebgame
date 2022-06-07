
const key = {
	keyDown : {},
	keyValue : {
		37: 'left',
		39: 'right',
		88: 'attack'
	}
}

const gameProp = {
	screenWidth : window.innerWidth,
	screenHeight : window.innerHeight
}

const renderGame = () => {
	hero.keyMotion(key);

	hero.bullets.forEach((bullet) => {
		bullet.moveBullet();
	});
	window.requestAnimationFrame(renderGame);
}

const windowEvent = () => {
	window.addEventListener('keydown', e => {
		key.keyDown[key.keyValue[e.which]] = true;
	});

	window.addEventListener('keyup', e => {
		key.keyDown[key.keyValue[e.which]] = false;
	});
}

const loadImg = () => {
	const preLoadImgSrc = ['/assets/images/ninja_attack.png', '/assets/images/ninja_run.png'];
	preLoadImgSrc.forEach( arr => {
		const img = new Image();
		img.src = arr;
	});
}

let hero;
const init = () => {
	hero = new Hero(new HeroRender('.hero'));
	loadImg();
	windowEvent();
	renderGame();
}

window.onload = () => {
	init();
}






