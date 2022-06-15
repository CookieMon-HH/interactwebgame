const key = {
	keyDown : {},
	keyValue : {
		37: 'left',
		39: 'right',
		88: 'attack'
	}
}

const bulletComProp = {
	launch: false,
	arr: []
}

const gameBackground : any ={
	gameBox: document.querySelector('.game')
}

const gameProp = {
	screenWidth : window.innerWidth,
	screenHeight : window.innerHeight
}

const renderGame = () => {
	hero.keyMotion();
	setGameBackground();

    bulletComProp.arr.forEach((arr, i) => {
		arr.moveBullet();
	});
	window.requestAnimationFrame(renderGame);

}

const setGameBackground = () => {
	let parallaxValue = Math.min(0, (hero.movex-gameProp.screenWidth/3) * -1);

	gameBackground.gameBox.style.transform = `translateX(${parallaxValue}px)`;
}

const windowEvent = () => {
	window.addEventListener('keydown', e => {
		key.keyDown[key.keyValue[e.which]] = true;
		hero.keyMotion();
	});

	window.addEventListener('keyup', e => {
		key.keyDown[key.keyValue[e.which]] = false;
		hero.keyMotion();
	});

	window.addEventListener('resize', e => {
		gameProp.screenWidth = window.innerWidth;
		gameProp.screenHeight = window.innerHeight;
	});
}

//CSS 로드될때 느린상황(깜빡거리는것) 때문에 미리 로드하는 것
const loadImg = () => {
	const preLoadImgSrc = ['../lib/images/ninja_attack.png', '../lib/images/ninja_run.png'];
	preLoadImgSrc.forEach( arr => {
		const img = new Image();
		img.src = arr;
	});
}

let hero;
const init = () => {
	hero = new Hero('.hero');
    loadImg();
	windowEvent();
    renderGame();
}

window.onload = () => {
	init();
}