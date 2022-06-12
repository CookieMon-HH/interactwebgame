const key = {
    keyDown : {},
    keyValue : {
        37 : 'left',
        38 : 'up',
        39 : 'right',
        40 : 'down',
        88 : 'attack'
    }
}

const rotateanglelist = {
    'up' : 0,
    'up_left' : 315,
    'left': 270,
    'left_down': 225,
    'down' : 180,
    'down_right' : 135,
    'right': 90,
    'right_up' : 45
}

const bulletComProp = {
    launch: false ,
    arr: []
}

const gameProp = {
    screenWidth : window.innerWidth,
    screenHeight : window.innerHeight
}

const gameBackground ={
	gameBox: document.querySelector('.game') as HTMLElement | null
}

const renderGame = () => {
    tank.keyMotion();
    setGameBackground();

    bulletComProp.arr.forEach((arr,i) => {
        arr.moveBullet();
    })
    window.requestAnimationFrame(renderGame);
    // requestAnimationFrame 은 리페인트 이전에 실행할 콜백함수를 받아 다음 리페인트가 진행되기 전에 애니메이션을 업데이트하는 함수를 호출하게 하도록 함, 보통 1호 60회 지원
    // 이는 재귀함수를 통해 계속 반복할 수 있도록 하여 사용할 수 있다.
}

const setGameBackground = () => {
	let parallaxX = Math.min(0, (tank.movex-gameProp.screenWidth/3) * -1);
    let parallaxY = Math.max(0, (tank.movey+gameProp.screenWidth/4) * -1 );

	gameBackground.gameBox.style.transform = `translate3d(${parallaxX}px,${parallaxY}px,0)`;
}

const widowEvent = () => {
    window.addEventListener('keydown', e => {
        // console.log('키다운' + e.which);
        key.keyDown[key.keyValue[e.which]] = true;
        // console.log(key.keyDown);
    })
    window.addEventListener('keyup', e => {
        key.keyDown[key.keyValue[e.which]] = false;
        // console.log(key.keyDown);
    })
    window.addEventListener('resize', e => {
		gameProp.screenWidth = window.innerWidth;
		gameProp.screenHeight = window.innerHeight;
        // console.log(gameProp.screenWidth);
	});
}

const loadImg = ()=> {
    const preLoadImgSrc = ['../../lib/images/tank_move.png','../../lib/images/tank_attack.png'];
    preLoadImgSrc.forEach(arr => {
        const img = new Image();
        img.src = arr;
    })
}

let tank;
const init = () => {
    tank = new Tank('.tank');
    // [참고] 생성자 함수 호출시에는 instance가 곧 this가 된다. 
    loadImg();
    widowEvent();
    renderGame();
}

window.onload = () => {
    init();
}