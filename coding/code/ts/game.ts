const key = {
    keyDown : {
        left : false,
        right : false,
        up : false,
        down : false,
        attack : false
    },
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

const allMonsterComProp = {
    arr: []
}

const bulletComProp = {
    launch: false ,
    arr: []
}

const gameProp = {
    screenWidth : window.innerWidth,
    screenHeight : window.innerHeight,
    fieldMaxRangeX : 3000,
    fieldMaxRangeY : 3000,
    //여기서 document.queryselector로 불러와서 세팅해주고 싶은데 HTMLElement로 정의해주고 style로 불러와야되서 어떻게 해야할 지 모르겠다... 
    gameOver : false
}

const gameBackground ={
	gameBox: document.querySelector('.game') as HTMLElement | null
}

const stageInfo = {
	stage: [],
	totalScore: 0,
	monster: [
		{defaultMon: greenMon, bossMon: greenMonBoss},
		{defaultMon: yellowMon, bossMon: yellowMonBoss},
		{defaultMon: pinkMon, bossMon: pinkMonBoss}
	]
}

const renderGame = () => {
    tank.keyMotion();
    setGameBackground();

    bulletComProp.arr.forEach((arr,i) => {
        arr.moveBullet();
    })
    allMonsterComProp.arr.forEach((arr, i) => {
		arr.moveMonster();
	});
    gameevent.eventGenerater();
    //함수들 선언한 class 이렇게 쓰는게 맞나?..
    if(stageInfo.stage.length != 0 ){
        stageInfo.stage[0].clearCheck();
    }
    window.requestAnimationFrame(renderGame);
    // requestAnimationFrame 은 리페인트 이전에 실행할 콜백함수를 받아 다음 리페인트가 진행되기 전에 애니메이션을 업데이트하는 함수를 호출하게 하도록 함, 보통 1호 60회 지원
    // 이는 재귀함수를 통해 계속 반복할 수 있도록 하여 사용할 수 있다.
}

const endGame = () => {
	gameProp.gameOver = true;
	key.keyDown.left = false;
	key.keyDown.right = false;
    key.keyDown.up = false;
    key.keyDown.down = false;
    key.keyDown.attack = false;
    setTimeout(() => document.querySelector('.game_over').classList.add('active'), 800);
}

const setGameBackground = () => {
	let parallaxX = Math.max((gameProp.fieldMaxRangeX - gameProp.screenWidth) * -1,Math.min(0, (tank.movex-gameProp.screenWidth/3) * -1));
    let parallaxY = Math.min((gameProp.fieldMaxRangeY - gameProp.screenHeight),Math.max(0, (tank.movey+gameProp.screenHeight/3) * -1));
    //최대범위를 주기 위해 Max / Min으로 한번 더 감싸줌

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
let gameevent;

const init = () => {
    tank = new Tank('.tank');
    // [참고] 생성자 함수 호출시에는 instance가 곧 this가 된다. 
    gameevent = new gameEvent;
    stageInfo.stage.push(new Stage());
    
    loadImg();
    widowEvent();
    renderGame();
}

window.onload = () => {
    init();
}
