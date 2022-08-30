const sameFunction = (imgUrl, script) => {
    return (`
      <figure class="npc_img">
        <img src="${imgUrl}"/>
      </figure>
      <p>
      ${script}
      </p>
  `);
};
const makeBasicScript = (script) => {
    return (`
    <div class="talk_box">
      ${script}
    </div>
    <div class="npc"></div>
    `);
};
const NpcQuestSet = {
    //TODO: 추후에 각 상황마다 다르게 표현하고 싶다면 sameFunction을 변경함
    BASIC: (imgUrl, script) => makeBasicScript(script),
    START: (imgUrl, script) => sameFunction(imgUrl, script),
    POSSIBLE: (imgUrl, script) => sameFunction(imgUrl, script),
    IMPOSSIBLE: (imgUrl, script) => sameFunction(imgUrl, script),
    CLEAR: (imgUrl, script) => sameFunction(imgUrl, script)
};
const NpcQuestInfoSet = {
    NPC_YELLOW: {
        url: '../../lib/images/npc.png',
        possibleLevel: 5,
        basic: `<p>큰일이야...<br>사람들이 좀비로 변하고 있어..<br><span>대화 Enter</span></p>`,
        start: `마을에 몬스터가 출몰해 주민들을 좀비로 만들고 있어.. 몬스터를 사냥해 주민을 구하고 <span>레벨을 5이상</span>으로 만들어 힘을 증명한다면 좀비왕을 물리칠 수 있도록 내 힘을 빌려줄게!!`,
        possible: `이런 아직 레벨을 달성하지 못했구나..`,
        impossible: `레벨을 달성했구나! 힘을줄게!`,
        clear: `고마워! 퀘스트는 끝이났어`
    },
    NPC_TWO: {
        url: '../../lib/images/npc.png',
        possibleLevel: 7,
        basic: `<p>좀비킹이.... 나타났어<span>대화 Enter</span></p>`,
        start: `좀비킹이 나타났어....<span>레벨을 7이상</span>으로 만들어 힘을 증명한다면 좀비킹을 물리칠 수 있도록 내 힘을 빌려줄게!!`,
        possible: `이런 아직 레벨을 달성하지 못했구나..`,
        impossible: `레벨을 달성했구나! 힘을줄게!`,
        clear: `고마워! 퀘스트는 끝이났어`
    },
};
class Npc {
    constructor(type, startPositionX) {
        this._isCrash = false;
        this._talkOn = false;
        this._talkFirst = true;
        this._questEnd = false;
        this.init = (positionX) => {
            this._element.innerHTML = NpcQuestSet["BASIC" /* NpcQuestType.BASIC */](NpcQuestInfoSet[this._NpcType].url, NpcQuestInfoSet[this._NpcType].basic);
            this._element.style.left = positionX + 'px';
            this._parentNode.appendChild(this._element);
        };
        this.position = () => {
            return {
                left: this._element.getBoundingClientRect().left,
                right: this._element.getBoundingClientRect().right,
                top: gameProp.screenHeight - this._element.getBoundingClientRect().top,
                bottom: gameProp.screenHeight - this._element.getBoundingClientRect().top - this._element.getBoundingClientRect().height
            };
        };
        this.crash = () => {
            const characterPosition = character.position();
            const npcPosition = this.position();
            if (characterPosition.right > npcPosition.left && characterPosition.left < npcPosition.right) {
                this._isCrash = true;
                return;
            }
            this._isCrash = false;
        };
        this.talk = () => {
            if (this._isCrash) {
                if (!this._talkOn) {
                    this._talkOn = true;
                    if (this._talkFirst) {
                        this._talkFirst = false;
                        this.makeQuestScript("START" /* NpcQuestType.START */, NpcQuestInfoSet[this._NpcType].url, NpcQuestInfoSet[this._NpcType].start);
                    }
                    else {
                        if (this._questEnd) {
                            this.makeQuestScript("CLEAR" /* NpcQuestType.CLEAR */, NpcQuestInfoSet[this._NpcType].url, NpcQuestInfoSet[this._NpcType].clear);
                        }
                        else {
                            if (character.currentLevel < NpcQuestInfoSet[this._NpcType].possibleLevel)
                                this.makeQuestScript("IMPOSSIBLE" /* NpcQuestType.IMPOSSIBLE */, NpcQuestInfoSet[this._NpcType].url, NpcQuestInfoSet[this._NpcType].possible);
                            else {
                                this.makeQuestScript("POSSIBLE" /* NpcQuestType.POSSIBLE */, NpcQuestInfoSet[this._NpcType].url, NpcQuestInfoSet[this._NpcType].impossible);
                                this._questEnd = true;
                            }
                        }
                    }
                    this._modalElement.classList.add('active');
                }
                else {
                    this._talkOn = false;
                    this._modalElement.classList.remove('active');
                }
            }
        };
        this.makeQuestScript = (type, url, questScript) => {
            const script = NpcQuestSet[type](url, questScript);
            this.setQuestScript(script);
        };
        this.setQuestScript = (script) => {
            const modalInnerBox = document.querySelector('.quest_modal .inner_box .quest_talk');
            modalInnerBox.innerHTML = script;
        };
        this._parentNode = document.querySelector('.game');
        this._element = document.createElement('div');
        this._element.className = 'npc_box';
        this._modalElement = document.querySelector('.quest_modal');
        this._NpcType = type;
        this.init(startPositionX);
    }
}
