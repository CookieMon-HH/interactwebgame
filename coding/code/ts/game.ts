const key = {
  keyDown: {},
  keyValue: {
    13: 'enter',
    37: 'left',
    39: 'right',
    67: 'slide',
    88: 'attack',
  }
}
let character;
let monster;
let npcOne;
let npcTwo;

const pinkMonster = (heroMoveX: number, isBoss: boolean = false): IMonsterInfo => {
  if (isBoss) {
    return {
      hp: {
        max: 3000,
        current: 3000,
      },
      speed: 14,
      moveX: 0,
      initPositionX: gameProp.screenWidth + 500,
      crashDamage: 100,
      className: 'pink_mon_boss',
      score: 4000,
      exp: 1000
    }
  }
  return {
    hp: {
      max: 20000,
      current: 20000,
    },
    speed: 8,
    moveX: 0,
    initPositionX: gameProp.screenWidth + 700,
    crashDamage: 300,
    className: 'pink_mon',
    score: 1000,
    exp: 100
  }
}

const yellowMonster = (heroMoveX: number, isBoss: boolean = false): IMonsterInfo => {
  if (isBoss) {
    return {
      hp: {
        max: 150000,
        current: 150000,
      },
      speed: 4,
      moveX: 0,
      initPositionX: gameProp.screenWidth + 200,
      crashDamage: 2000,
      className: 'yellow_mon_boss',
      score: 5000,
      exp: 2000
    }
  }
  return {
    hp: {
      max: 15000,
      current: 15000,
    },
    speed: 6,
    moveX: 0,
    initPositionX: gameProp.screenWidth + 900,
    crashDamage: 200,
    className: 'yellow_mon',
    score: 2000,
    exp: 200
  }
}

const greenMonster = (heroMoveX: number, isBoss: boolean = false): IMonsterInfo => {
  if (isBoss) {
    return {
      hp: {
        max: 100000,
        current: 100000,
      },
      speed: 6,
      moveX: 0,
      initPositionX: gameProp.screenWidth + 400,
      crashDamage: 1000,
      className: 'green_mon_boss',
      score: 6000,
      exp: 3000
    }
  }
  return {
    hp: {
      max: 10000,
      current: 10000,
    },
    speed: 10,
    moveX: 0,
    initPositionX: gameProp.screenWidth + 1200,
    crashDamage: 100,
    className: 'green_mon',
    score: 3000,
    exp: 300
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

const stageInfo: { totalScore: number, stage: Stage[], monster: { defaultMonster: (moveX: number) => IMonsterInfo, bossMonster: (moveX: number) => IMonsterInfo }[], callPosition: number[] } = {
  totalScore: 0,
  stage: [],
  monster: [
    {
      defaultMonster: (moveX: number) => greenMonster(moveX || 0),
      bossMonster: (moveX: number) => greenMonster(moveX || 0, true)
    },
    {
      defaultMonster: (moveX: number) => yellowMonster(moveX || 0),
      bossMonster: (moveX: number) => yellowMonster(moveX || 0, true)
    },
    {
      defaultMonster: (moveX: number) => pinkMonster(moveX || 0),
      bossMonster: (moveX: number) => pinkMonster(moveX || 0, true)
    }
  ],
  callPosition: [1000, 2000, 3000]
}

const gameProp = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  gameOver: false
}

const renderGame = () => {
  character.keyMotion();
  setGameBackground();
  npcOne.crash();
  npcTwo.crash();
  bulletComProp.arr.forEach((bullet, i) => {
    bullet.moveBullet();
  });

  allMonsterComProp.arr.forEach((monster, i) => {
    monster.move();
  })

  stageInfo.stage[0].clearStage();
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
    if (!gameProp.gameOver)
      key.keyDown[key.keyValue[e.which]] = true;
    if(key.keyDown['enter']){
      npcOne.talk();
      npcTwo.talk();
    }
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

const init = () => {
  character = new Character('.character');
  stageInfo.stage.push(new Stage());
  npcOne = new Npc(NpcType.NPC_YELLOW, 600);
  npcTwo = new Npc(NpcType.NPC_TWO, 1200);
  loadImg();
  windowEvent();
  renderGame();
}

window.onload = () => {
  init();
}