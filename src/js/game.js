const key = {
    keyDown: {},
    keyValue: {
        37: "left",
        39: "right",
        88: "attack",
        67: "slide",
        13: "enter",
    },
};
const allMonsterComProp = {
    arr: [],
};
const gameBackground = {
    gameBox: document.querySelector(".game"),
};
const stageInfo = {
    stage: new Stage(),
    totalScore: 0,
    callPosition: [1000, 5000, 9000],
};
const gameProp = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    gameOver: false,
};
const renderGame = () => {
    hero.keyMotion(key);
    setGameBackground();
    npcOne.crash();
    hero.bullets.forEach((bullet) => {
        bullet.moveBullet(() => {
            const crashedBullet = hero.bullets.findIndex((target) => target === bullet);
            hero.bullets.splice(crashedBullet, 1);
        }, allMonsterComProp.arr);
    });
    allMonsterComProp.arr.forEach((monster) => {
        monster.moveMonster(hero.moveX - hero.position().left);
        monster.crash(hero);
    });
    stageInfo.stage.clearCheck();
    window.requestAnimationFrame(renderGame);
};
const endGame = () => {
    gameProp.gameOver = true;
    key.keyDown.left = false;
    key.keyDown.right = false;
    key.keyDown.attack = false;
    document.querySelector(".game_over").classList.add("active");
};
const setGameBackground = () => {
    let parallaxValue = Math.min(0, (hero.moveX - gameProp.screenWidth / 3) * -1);
    if (!(gameBackground.gameBox instanceof HTMLElement))
        return;
    gameBackground.gameBox.style.transform = `translateX(${parallaxValue}px)`;
};
const windowEvent = () => {
    window.addEventListener("keydown", (e) => {
        if (gameProp.gameOver)
            return;
        key.keyDown[key.keyValue[e.which]] = true;
        if (key.keyDown.enter) {
            npcOne.talk();
        }
    });
    window.addEventListener("keyup", (e) => {
        if (gameProp.gameOver)
            return;
        key.keyDown[key.keyValue[e.which]] = false;
    });
    window.addEventListener("resize", (e) => {
        gameProp.screenWidth = window.innerWidth;
        gameProp.screenHeight = window.innerHeight;
    });
};
const loadImg = () => {
    const preLoadImgSrc = [
        "/assets/images/ninja_attack.png",
        "/assets/images/ninja_run.png",
    ];
    preLoadImgSrc.forEach((arr) => {
        const img = new Image();
        img.src = arr;
    });
};
let hero;
let npcOne;
const init = () => {
    hero = new Hero(new HeroRender(".hero"));
    hero.addDeadEvent(endGame);
    npcOne = new Npc(new NpcRender(), hero);
    stageInfo.stage.start(allMonsterComProp.arr, hero);
    loadImg();
    windowEvent();
    renderGame();
};
window.onload = () => {
    init();
};
