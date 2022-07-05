var degtorad = (deg) => {
    let rad: number = 0.5*Math.PI - (Math.PI/180*deg);
    //+y출발 시계 방향의 deg를 +x출발 반시계방향의 rad로 변환
    return rad
}

class Tank {
    el: any ;
    rotateangle: number;
    movex: number;
    movey: number;
    speed: number;
    directionstatus: string;
    deltaX: number;
    deltaY: number;
    tankMaxRangeX: number;
    tankMaxRangeY: number;
    attackDamage:number;
    hpProgress: number;
    hpValue: number; 
    defaultHpValue: number; 
    realDamage: number; 

    constructor(el){
        this.el = document.querySelector(el);
        this.rotateangle = 0;
        this.movex = gameProp.fieldMaxRangeX/2;
        this.movey = gameProp.fieldMaxRangeY/2 * -1;
        this.speed = 11;
        this.directionstatus = 'up';
        //다른이름(basicfunction)으로 instance로 만들면 안되고 같은 이름으로 만들때만 되네?.. 왜그러지?
        this.attackDamage = 1000;
        this.hpProgress = 0;
		this.hpValue = 100000;
		this.defaultHpValue = this.hpValue;
		this.realDamage = 0;
    }
    // constructor 다시 공부해보자

    checkdirection(){ 
        let keydir: string[] = ['up','left','down','right'];
        let directionlist: string[] = ['up','up_left','left','left_down','down','down_right','right','right_up'];
        let direction: string = 'notmoving';
        
        for (let i=0; i< keydir.length; i++) {
            if (key.keyDown[keydir[i]]){
                //[참고]==true/false로 하면 undefined인 경우 인식을 못하는데 이렇게 하면 undefined도 인식하여 진행할 수 있음
                if(key.keyDown[ (i<=2) ? keydir[i+1] : keydir[0] ]){
                    direction = directionlist[i*2+1];
                    this.directionstatus = direction;
                    return direction
                }else if (!key.keyDown[(i<=2) ? keydir[i+1] : keydir[0]]){
                    if (i==0 && key.keyDown[keydir[keydir.length-1]]) {
                        direction = direction = directionlist[directionlist.length-1];
                        this.directionstatus = direction;
                        return direction
                    }else {
                        direction = directionlist[i*2];
                        this.directionstatus = direction;
                        return direction
                    }
                }
            }
        }
        return direction
    }

    keyMotion(){                
        //탱크 이동 동작
        if(this.checkdirection() != 'notmoving'){
            this.el.classList.add('move');
            // Element.classList.add/remove/toggle를 통해 명시된 class를 추가/제거/onoff할 수 있다. 
            this.rotateangle = rotateanglelist[this.checkdirection()];
            
            this.deltaX = this.speed * Math.cos(degtorad(this.rotateangle));
            this.deltaY = -1 * this.speed * Math.sin(degtorad(this.rotateangle));
            this.tankMaxRangeX = gameProp.fieldMaxRangeX - this.el.offsetWidth;
            this.tankMaxRangeY = gameProp.fieldMaxRangeY - this.el.offsetHeight;

            this.movex = Math.min(this.tankMaxRangeX, Math.max(0,this.movex + this.deltaX))
            this.movey = Math.max(-1*this.tankMaxRangeY,Math.min(0,this.movey + this.deltaY))
            //범위에 따른 분기를 두지 않고 max,min으로 한번 더 감싸서 최대/최소 값 지정
            
        }else {
            this.el.classList.remove('move');
        }

        //attack
        if(key.keyDown['attack']){
            if(!bulletComProp.launch){
                this.el.classList.add('attack');
                bulletComProp.arr.push(new Bullet);

                bulletComProp.launch = true;
            }   
        }
        
        if(!key.keyDown['attack']){
            this.el.classList.remove('attack');
            bulletComProp.launch = false;
        }   

        if(!gameProp.gameOver){
            this.el.style.transform = `rotate(${this.rotateangle}deg)`;
            this.el.parentNode.style.transform = `translate3d(${this.movex}px, ${this.movey}px , 0)`;
        }
    }
    position(){
        return {
            left: this.el.getBoundingClientRect().left,
            right: this.el.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
            bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
        }
    }
    size(){
        return {
            width: this.el.offsetWidth,
            height: this.el.offsetHeight
        }
    }
    updateHp(monsterDamage){
        const tankHpBox = document.querySelector('.state_box .hp span') as HTMLElement 
		this.hpValue = Math.max(0, this.hpValue - monsterDamage);
		this.hpProgress = this.hpValue / this.defaultHpValue * 100
		tankHpBox.style.width = this.hpProgress + '%';
		this.crash();
		if(this.hpValue === 0){
			this.dead();
		}
	}
    crash(){
		this.el.classList.add('crash');
		setTimeout(() => this.el.classList.remove('crash'), 400);
	}
    dead(){
		tank.el.classList.add('dead');
		endGame();
	}
    hitDamage(){
		this.realDamage = this.attackDamage - Math.round(Math.random() * this.attackDamage * 0.1);
	}
    tankUpgrade(){
		this.speed += 1.3;
		this.attackDamage += 1500;
	}
}

class Bullet {
    parentNode;
    el;
    x: number;
    y: number;
    speed: number;
    distancex: number;
    distancey: number;
    rotateangle: number;
    
    constructor(){
		this.parentNode = document.querySelector('.game');
		this.el = document.createElement('div');
		this.el.className = 'tank_bullet';
        
        // this.bl = document.createElement('div');
        // this.bl.className = 'tank_bullet';
		
        this.x = 0;
		this.y = 0;
		this.speed = 30;
		this.distancex = 0;
        this.distancey = 0;
        this.rotateangle = rotateanglelist[tank.directionstatus] ;
        this.init();
    }
    init(){
        this.x = tank.movex + tank.size().width * 0.42 ;
        this.y = tank.movey - tank.size().width * 0.38 ;
        //taransform으로 위치를 잡기때문에 y좌표는 바텀 기준으로 값을 빼줘야 함 (transform y는 bottom부터 아래로 내려가면 +)
        this.distancex = this.x;
        this.distancey = this.y;
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
        //각도 조절
        // this.bl.style.transform = `rotate(${this.rotateangle}deg)`;
        //별도로 div 하나 더 생성할 필요 없이 transform 할 때 rotate를 뒤에 입력해주면 됨
        
        this.parentNode.appendChild(this.el);
        //.game에 자식으로 생성해줘야 함
        // this.el.appendChild(this.bl);
    }
    moveBullet(){
        
        this.distancex += this.speed * Math.cos(degtorad(this.rotateangle));
        this.distancey -= this.speed * Math.sin(degtorad(this.rotateangle));

        this.el.style.transform = `translate3d(${this.distancex}px, ${this.distancey}px, 0) rotate(${this.rotateangle}deg)`;

        this.removeOutboundBullet();
    }
    position(){
		return{
			left: this.el.getBoundingClientRect().left,
			right: this.el.getBoundingClientRect().right,
			top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
			bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
		}
	}   
    removeOutboundBullet(){
        if(this.position().left > gameProp.screenWidth || this.position().right < 0 || 
        this.position().top > gameProp.screenHeight || this.position().bottom < 0 ){
			this.el.remove();
        }
    }
    removeBullet(){
        this.el.remove();
    }
}

class Monster {
    parentNode;
    el;
    elChildren;
    hpNode;
    hpValue: number;
    defaultHpValue: number;
    hpInner;
    progress: number;
    moveX: number;
    moveY: number;
    speed: number;
    crashDamage: number;
    textDamageNode;
    textDamage;
    score: number;
    
    constructor(property, moveX,moveY){
        this.parentNode = document.querySelector('.game');
        this.el = document.createElement('div');
        this.el.className = 'monster_box '+property.name;
        this.elChildren = document.createElement('div');
        this.elChildren.className = 'monster';
        this.hpNode = document.createElement('div');
        this.hpNode.className = 'hp';
        this.hpValue = property.hpValue;
        this.defaultHpValue = property.hpValue;
        this.hpInner = document.createElement('span');
        this.progress = 0;
        this.moveX = moveX;
        this.moveY = moveY;
        this.speed = property.speed;
        this.crashDamage = property.crashDamage;
        this.score = property.score;
        
        this.init();
    }
    init(){
        this.hpNode.appendChild(this.hpInner);
        this.el.appendChild(this.hpNode);
        this.el.appendChild(this.elChildren);
        this.parentNode.appendChild(this.el);
    }
    position(){
        return {
            left: this.el.getBoundingClientRect().left,
            right: this.el.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
            bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
        }
    }
    updateHp(index){
        this.hpValue = Math.max(0, this.hpValue - tank.realDamage);
        this.progress = this.hpValue / this.defaultHpValue * 100;
        this.el.children[0].children[0].style.width = this.progress + '%';

        if(this.hpValue ===0){
            this.dead(index);
        }
    }
    dead(index){
        this.el.classList.add('remove');
        setTimeout(()=> this.el.remove(),200);
        allMonsterComProp.arr.splice(index,1);
        gameevent.setScore(this.score);
    }
    moveMonster(){
        if(this.moveX > tank.movex){
            this.moveX -= this.speed;
            this.elChildren.classList.remove('flip');
        }else{
            this.moveX += this.speed;
            this.elChildren.classList.add('flip');
        }
        if(this.moveY > tank.movey){
            this.moveY -= this.speed;
        }else{
            this.moveY += this.speed;
        }

        this.el.style.transform = `translate3d(${this.moveX}px,${this.moveY}px,0)`
    }
    damageView(){
		this.parentNode = document.querySelector('.game_app');
		this.textDamageNode = document.createElement('div');
		this.textDamageNode.className = 'text_damage';
		this.textDamage = document.createTextNode(tank.realDamage);
		this.textDamageNode.appendChild(this.textDamage);
		this.parentNode.appendChild(this.textDamageNode);
		let textPosition = Math.random() * -100;
		let damagex = this.position().left + textPosition;
		let damagey = this.position().top;

		this.textDamageNode.style.transform = `translate(${damagex}px,${-damagey}px)`
		setTimeout(() => this.textDamageNode.remove(), 500);
	}
}

class gameEvent {
    constructor(){
    }
    init(){
    }

    rectOvlerapChecker(mainElem,targetElem,right_tol,left_tol,top_tol,bottom_tol){
        if(mainElem.position().left < targetElem.position().right - right_tol 
            && mainElem.position().right > targetElem.position().left + left_tol 
            && mainElem.position().top > targetElem.position().bottom + bottom_tol  
            && mainElem.position().bottom < targetElem.position().top - top_tol){
                return true
            }else {
                return false
            }
    }
    eventGenerater(){
        this.bulletcrash();
        this.monstercrash();
    }
    //bullet -> monster crash
	bulletcrash(){
        for(let j = 0; j < allMonsterComProp.arr.length; j++){
            for(let i =0; i < bulletComProp.arr.length; i++){
                if(this.rectOvlerapChecker(bulletComProp.arr[i],allMonsterComProp.arr[j],0,0,0,0)){
                    tank.hitDamage();
                    bulletComProp.arr[i].removeBullet();
                    bulletComProp.arr.splice(i,1);
                    allMonsterComProp.arr[j].damageView();
                    allMonsterComProp.arr[j].updateHp(j);
                    break;
                    //bulletcomProp에서 splice하므로 for 문을 다시 돌리기 위해 break
                }
            }
        }
	}

    //monster -> tank crash 
    monstercrash(){
        for(let j = 0; j < allMonsterComProp.arr.length; j++){
            if(this.rectOvlerapChecker(allMonsterComProp.arr[j],tank,30,30,30,30)){
                tank.updateHp(allMonsterComProp.arr[j].crashDamage);
            }
        }
    }

    setScore(score){ 
		stageInfo.totalScore += score;
        const scorebox = document.querySelector('.score_box') as HTMLElement
		scorebox.innerText = String(stageInfo.totalScore);
	}
}

class Stage {
    level: number;
    isStart: boolean;
    isGenEnd: boolean;
    parentNode;
    textBox;
    textNode;
    count: number;

	constructor(){
		this.level = 0;
		this.isStart = false;
        this.isGenEnd = false;
        this.count = 0 ;
		this.stageStart();
	}
	stageStart(){
		setTimeout( () => {
			this.isStart = true;
			this.stageGuide(`START LEVEL${this.level+1}`);
			this.callMonster();
		}, 2000);
	}
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
        var genMonster = setInterval(()=> {
            this.count = this.count+1;
            if(this.count===4){
                allMonsterComProp.arr.push(new Monster(stageInfo.monster[this.level].bossMon,1500,-1500));
                clearInterval(genMonster);
                this.isGenEnd = true;
                this.count = 0;
            }else {
                console.log('else')
                allMonsterComProp.arr.push(new Monster(stageInfo.monster[this.level].defaultMon,2000,-2000));
                allMonsterComProp.arr.push(new Monster(stageInfo.monster[this.level].defaultMon,1000,-1000));
                allMonsterComProp.arr.push(new Monster(stageInfo.monster[this.level].defaultMon,2000,-1000));
                allMonsterComProp.arr.push(new Monster(stageInfo.monster[this.level].defaultMon,1000,-2000));
            }
        },3000)

	}
	clearCheck(){
        //몬스터가 모두 나왔을 때 0이면 clear
		if(allMonsterComProp.arr.length === 0 && this.isStart && this.isGenEnd){
			this.isStart = false;
            this.isGenEnd = false;
			this.level++;

			if(this.level < stageInfo.monster.length){
				this.stageGuide('CLEAR!!');
				this.stageStart();
				tank.tankUpgrade();
			}else {
				this.stageGuide('ALL CLEAR!!');
			}
		}
	}
}