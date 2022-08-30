class NpcRender {
  parentNode: HTMLDivElement;
  el: HTMLDivElement;
  modal: HTMLDivElement;
  questEnd: boolean;
  questStart: boolean;

  constructor() {
    this.parentNode = document.querySelector(".game");
    this.el = document.createElement("div");
    this.el.className = "npc_box";
    this.modal = document.querySelector(".quest_modal");
    this.questEnd = false;
    this.questStart = false;

    this.init();
  }

  init() {
    let npcTalk = "";
    npcTalk += '<div class="talk_box">';
    npcTalk +=
      "<p>큰일이야..<br>사람들이 좀비로 변하고 있어..<br><span>대화 Enter</span></p>";
    npcTalk += "</div>";
    npcTalk += '<div class="npc"></div>';

    this.el.innerHTML = npcTalk;
    this.el.style.left = '600px';
    this.parentNode.appendChild(this.el);
  }

  crash() {
    this.el.classList.add("crash");
    setTimeout(() => {
      this.el.classList.remove("crash");
    }, 400);
  }
  position() {
    const { left, right, top, height } = this.el.getBoundingClientRect();
    return {
      left,
      right,
      top: gameProp.screenHeight - top,
      bottom: gameProp.screenHeight - top - height,
    };
  }

  talkOn() {
    this.modal.classList.add("active");
    this.quest();
  }

  talkOff() {
    this.modal.classList.remove("active");
  }

  quest() {
    const message = {
      start: '마을에 몬스터가 출몰해 주민들을 좀비로 만들고 있어.. 몬스터를 사냥해 주민을 구하고 <span>레벨을 5이상</span>으로 만들어 힘을 증명한다면 좀비왕을 물리칠 수 있도록 내 힘을 빌려줄게!!',
      ing : '이런 아직 레벨을 달성하지 못했구나..',
			suc : '레벨을 달성했구나! 힘을줄게!',
			end : '고마워! 행운을 빌어!'
    }

		let messageState = '';
		
    if(!this.questStart){
			messageState = message.start;
			this.questStart = true;
		}else if(this.questStart && !this.questEnd && hero.level < 5){
			messageState = message.ing;
		}else if(this.questStart && !this.questEnd && hero.level >= 5){
			messageState = message.suc;
			this.questEnd = true;
			hero.heroUpgrade(50000);
		}else if(this.questStart && this.questEnd){
			messageState = message.end;
		}

    let text = '<figure class="npc_img">';
    text += '<img src="../assets/images/npc.png">';
    text += "</figure>";
    text += "<p>";
    text += messageState;
    text += "</p>";
    const modalInner = document.querySelector('.quest_modal .inner_box .quest_talk');
    modalInner.innerHTML = text;
  }
}

class NpcRender2 {
  parentNode: HTMLDivElement;
  el: HTMLDivElement;
  modal: HTMLDivElement;
  questEnd: boolean;
  questStart: boolean;

  constructor() {
    this.parentNode = document.querySelector(".game");
    this.el = document.createElement("div");
    this.el.className = "npc_box";
    this.modal = document.querySelector(".quest_modal");
    this.questEnd = false;
    this.questStart = false;

    this.init();
  }

  init() {
    let npcTalk = "";
    npcTalk += '<div class="talk_box">';
    npcTalk += '<p>곧 좀비왕이 부활하려고해..<br><span>대화 Enter</span></p>';
    npcTalk += "</div>";
    npcTalk += '<div class="npc"></div>';

    this.el.innerHTML = npcTalk;
    this.el.style.left = '8500px';
    this.parentNode.appendChild(this.el);
  }

  crash() {
    this.el.classList.add("crash");
    setTimeout(() => {
      this.el.classList.remove("crash");
    }, 400);
  }
  position() {
    const { left, right, top, height } = this.el.getBoundingClientRect();
    return {
      left,
      right,
      top: gameProp.screenHeight - top,
      bottom: gameProp.screenHeight - top - height,
    };
  }

  talkOn() {
    this.modal.classList.add("active");
    this.quest();
  }

  talkOff() {
    this.modal.classList.remove("active");
  }

  quest() {
    const message = {
			start : `마을에 몬스터가 출몰해 주민들을 좀비로 만들고 있어.. 몬스터를 사냥해 주민을 구하고 <span>레벨을 7이상</span>으로 만들어 힘을 증명한다면 좀비왕을 물리칠 수 있도록 내 힘을 빌려줄게!!`,
			ing : '이런 아직 레벨을 달성하지 못했구나..',
			suc : '레벨을 달성했구나! 힘을줄게!',
			end : '고마워! 행운을 빌어!'
    }

		let messageState = '';
		
    if(!this.questStart){
			messageState = message.start;
			this.questStart = true;
		}else if(this.questStart && !this.questEnd && hero.level < 7){
			messageState = message.ing;
		}else if(this.questStart && !this.questEnd && hero.level >= 7){
			messageState = message.suc;
			this.questEnd = true;
			hero.heroUpgrade(70000);
		}else if(this.questStart && this.questEnd){
			messageState = message.end;
		}

    let text = '<figure class="npc_img">';
    text += '<img src="../assets/images/npc.png">';
    text += "</figure>";
    text += "<p>";
    text += messageState;
    text += "</p>";
    const modalInner = document.querySelector('.quest_modal .inner_box .quest_talk');
    modalInner.innerHTML = text;
  }
}

class Npc {
  render: NpcRender;
  hero: Hero;
  npcCrash: boolean;
  talkOn: boolean;

  constructor(npcRender: NpcRender, hero: Hero) {
    this.render = npcRender;
    this.hero = hero;
    this.npcCrash = false;
    this.talkOn = false;
    this.render.init();
  }

  crash() {
    const { right: heroRight, left: heroLeft } = this.hero.position();
    const { right, left } = this.position();
    if (heroRight > left && heroLeft < right) {
      this.npcCrash = true;
    } else {
      this.npcCrash = false;
    }
    this.render.crash();
  }

  position() {
    return this.render.position();
  }

  talk() {
    if (!this.talkOn && this.npcCrash) {
      this.talkOn = true;
      this.render.talkOn();
    } else if (this.talkOn) {
      this.talkOn = false;
      this.render.talkOff();
    }
  }
}
