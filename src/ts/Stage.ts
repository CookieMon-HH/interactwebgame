const StageMonsterInfoList = [
    {
        defaultMon: MonsterType.GREEN,
        bossMon: MonsterType.GREEN_BOSS
    }, {
        defaultMon: MonsterType.YELLOW,
        bossMon: MonsterType.YELLOW_BOSS
    }, {
        defaultMon: MonsterType.PINK,
        bossMon: MonsterType.PINK_BOSS
    },
];

class StageRender {
    parentNode: HTMLDivElement;
    textBox: HTMLDivElement;
    textNode: Text;

    constructor() {
        this.parentNode = document.querySelector('.game_app');
    }

    render(text: string) {
        this.textBox = document.createElement('div');
        this.textBox.className = 'stage_box';
        this.textNode = document.createTextNode(text);
        this.textBox.appendChild(this.textNode);
        this.parentNode.appendChild(this.textBox);

        setTimeout(() => {
            this.textBox.remove();
        }, 1500);
    }
}

class Stage {
    level: number;
    stageRender: StageRender;
    monsterArrPointer: Monster[] = [];
    isStart: boolean;
    hero: Hero;

    constructor() {
        this.level = 0;
        this.stageRender = new StageRender();
    }

    start(_monsterArrPointer: Monster[], hero: Hero) {
        this.monsterArrPointer = _monsterArrPointer;
        this.hero = hero;
        // this.stageStart();
    }

    // stageStart() {
    //     setTimeout(() => {
    //         this.isStart = true;
    //         this.stageGuide();
    //         this.callMonster();
    //     }, 2000);
    // }

    stageGuide() {
        this.stageRender.render(`START LEVEL${this.level + 1}`);
    }

    callMonster() {
        for (let i = 0; i <= 3; i++) {
            let monster;
            let positionX;
            if (i === 10) {
                monster = StageMonsterInfoList[this.level].bossMon;
                positionX = this.hero.moveX + gameProp.screenWidth + 600 * i;
            } else {
                monster = StageMonsterInfoList[this.level].defaultMon;
                positionX = this.hero.moveX + gameProp.screenWidth + 700 * i;
            }
            this.monsterArrPointer[i] = new Monster(positionX, monster);
        }
    }

    clearCheck() {
		stageInfo.callPosition.forEach( arr => {
			if(this.hero.moveX >= arr && allMonsterComProp.arr.length === 0){
                this.stageRender.render('곧 몬스터가 몰려옵니다!');
				stageInfo.callPosition.shift();

				setTimeout(() => {
					this.callMonster();
					this.level++;
				}, 1000);
			}
		});
        // if (this.monsterArrPointer.length === 0 && this.isStart) {
        //     this.isStart = false;
        //     this.level++;
        //     if (this.level < StageMonsterInfoList.length) {
        //         this.stageRender.render('CLEAR');
        //         this.hero.heroUpgrade();
        //         this.stageStart();
        //     } else {
        //         this.stageRender.render('ALL CLEAR');
        //     }
        // }
    }
}