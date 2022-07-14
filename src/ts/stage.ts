class Stage {
    level;
    isStart;
    parentNode;
    textBox;
    textNode;
    

	constructor(){
		this.level = 0;
		this.isStart = false;
		//this.stageStart();
	}
	// stageStart(){
	// 	setTimeout( () => {
	// 		this.isStart = true;
	// 		this.stageGuide(`START LEVEL${this.level+1}`);
	// 		this.callMonster();
	// 	}, 2000);
	// }
	stageGuide(text){
		this.parentNode = document.querySelector('.game_app');
		this.textBox = document.createElement('div');
		this.textBox.className = 'stage_box';
		this.textNode = document.createTextNode(text);
		this.textBox.appendChild(this.textNode);
		this.parentNode.appendChild(this.textBox);

		setTimeout(() => this.textBox.remove(), 1500);
	}
	callMonster(){
		for(let i=0; i <=10; i++){

			if(i === 10){
				allMonsterComProp.arr[i] = new Monster(stageInfo.monster[this.level].bossMon, hero.movex + gameProp.screenWidth + 600 * i);
			}else{
				allMonsterComProp.arr[i] = new Monster(stageInfo.monster[this.level].defaultMon, hero.movex + gameProp.screenWidth + 700 * i);
			}

		}
	}
	clearCheck(){
		stageInfo.callPosition.forEach( arr => {
			if(hero.movex >= arr && allMonsterComProp.arr.length === 0){
				this.stageGuide('곧 몬스터가 몰려옵니다!');
				stageInfo.callPosition.shift();

				setTimeout(() => {
					this.callMonster();
					this.level++;
				}, 1000);
			}
		});
		// if(allMonsterComProp.arr.length === 0 && this.isStart){
		// 	this.isStart = false;
		// 	this.level++;

		// 	if(this.level < stageInfo.monster.length){
		// 		this.stageGuide('CLEAR!!');
		// 		this.stageStart();
		// 		hero.heroUpgrade();
		// 	}else {
		// 		this.stageGuide('ALL CLEAR!!');
		// 	}
		// }
	}
}
