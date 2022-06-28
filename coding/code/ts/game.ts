const key = {
  keyDown: {},
  keyValue: {
    37: 'left',
    39: 'right',
    88: 'attack'
  }
}

const bulletComProp = {
  launch: false,
  arr: []
}

const allMonsterComProp = {
  arr: []
}

const gameBackground: any = {
  gameBox: document.querySelector('.game')
}

const gameProp = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  gameOver: false
}

const renderGame = () => {
  character.keyMotion();
  setGameBackground();
  bulletComProp.arr.forEach((bullet, i) => {
    bullet.moveBullet();
  });
  
  allMonsterComProp.arr.forEach((monster, i) => {
    monster.move();
  })
  window.requestAnimationFrame(renderGame);
}

const endGame = () => {
  gameProp.gameOver = true;
  key.keyDown['left'] = false;
  key.keyDown['right'] = false;
  key.keyDown['attack'] = false;
  document.querySelector('.game_over').classList.add('active');
}

const setGameBackground = () => {
  let parallaxValue = Math.min(0, (character.moveX - gameProp.screenWidth / 3) * -1);
  gameBackground.gameBox.style.transform = `translateX(${parallaxValue}px)`;
}

const windowEvent = () => {
  window.addEventListener('keydown', e => {
    if(!gameProp.gameOver)
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
  const preLoadImgSrc = ['../../../lib/images/ninja_attack.png', '../../../lib/images/ninja_run.png'];
  preLoadImgSrc.forEach(arr => {
    const img = new Image();
    img.src = arr;
  });
}

let character;
let monster;

const init = () => {
  character = new Character('.character');
	allMonsterComProp.arr[0] = new Monster(500, 5000);
  allMonsterComProp.arr[1] = new Monster(1500, 2000);
  loadImg();
  windowEvent();
  renderGame();
}

window.onload = () => {
  init();
}