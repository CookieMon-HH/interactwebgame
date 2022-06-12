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

    constructor(el){
        this.el = document.querySelector(el);
        this.rotateangle = 0;
        this.movex = 0;
        this.movey = 0;
        this.speed = 11;
        this.directionstatus = 'up';
        //다른이름(basicfunction)으로 instance로 만들면 안되고 같은 이름으로 만들때만 되네?.. 왜그러지?
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
            this.movex = this.movex < 0 ? 0 : this.movex + this.deltaX;
            this.movey = this.movey > 0 ? 0 : this.movey + this.deltaY;
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

        this.el.style.transform = `rotate(${this.rotateangle}deg)`;
        this.el.parentNode.style.transform = `translate3d(${this.movex}px, ${this.movey}px , 0)`;
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

        this.crashBullet();
    }
    position(){
		return{
			left: this.el.getBoundingClientRect().left,
			right: this.el.getBoundingClientRect().right,
			top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
			bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
		}
	}   
	crashBullet(){
        if(this.position().left > gameProp.screenWidth || this.position().right < 0 || 
        this.position().top > gameProp.screenHeight || this.position().bottom < 0 ){
			this.el.remove();
		}
	}
}