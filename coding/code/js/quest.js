//modal은 형태가 퀘스트마다 바뀌지 않을것 같으니 따로 관리
var fillQuestModal = (message) => {
    let text = '';
    text += '<figure class="npc_img">';
    text += '<img src="../../lib/images/npc.png">';
    text += '</figure>';
    text += '<p>';
    text += message;
    text += '</p>';
    const modalInner = document.querySelector('.quest_modal .inner_box .quest_talk');
    modalInner.innerHTML = text;
};
//quest : 조건, 메세지만 관리
//class로 만들고 상속해서 써볼까? 
const levelQuestOne = {
    idleMessage: '<p>큰일이야..<br>사람들이 좀비로 변하고 있어..<br><span>대화 Enter</span></p>',
    message: {
        start: '마을에 몬스터가 출몰해 주민들을 좀비로 만들고 있어.. 몬스터를 사냥해 주민을 구하고 <span>레벨을 5이상</span>으로 만들어 힘을 증명한다면 좀비왕을 물리칠 수 있도록 내 힘을 빌려줄게!!',
        ing: '이런 아직 레벨을 달성하지 못했구나..',
        suc: '레벨을 달성했구나! 힘을줄게!',
        end: '고마워! 행운을 빌어!'
    },
    questState: {
        state: "start",
        questStart: false,
        questEnd: false,
        questClearCondition: false
    },
    questClearConditionChecker: () => {
        if (tank.level >= 5) {
            return true;
        }
        else {
            return false;
        }
    },
    questPresent: () => {
        tank.tankUpgrade(5000);
    }
};
const levelQuestTwo = {
    idleMessage: '<p>곧 좀비왕이 부활하려고해..<br><span>대화 Enter</span></p>',
    message: {
        start: `마을에 몬스터가 출몰해 주민들을 좀비로 만들고 있어.. 몬스터를 사냥해 주민을 구하고 <span>레벨을 7이상</span>으로 만들어 힘을 증명한다면 좀비왕을 물리칠 수 있도록 내 힘을 빌려줄게!!`,
        ing: '이런 아직 레벨을 달성하지 못했구나..',
        suc: '레벨을 달성했구나! 힘을줄게!',
        end: '고마워! 행운을 빌어!'
    },
    questState: {
        state: "start",
        questStart: false,
        questEnd: false,
        questClearCondition: false
    },
    questClearConditionChecker: () => {
        if (tank.level >= 7) {
            return true;
        }
        else {
            return false;
        }
    },
    questStateChecker: () => {
        if (!levelQuestOne.questState.questStart) {
            levelQuestOne.questState.state = "start";
        }
        else if (levelQuestOne.questState.questStart && !levelQuestOne.questState.questEnd && !levelQuestOne.questState.questClearCondition) {
            levelQuestOne.questState.state = "ing";
        }
        else if (levelQuestOne.questState.questStart && !levelQuestOne.questState.questEnd && levelQuestOne.questState.questClearCondition) {
            levelQuestOne.questState.state = "suc";
        }
        else if (levelQuestOne.questState.questStart && levelQuestOne.questState.questEnd) {
            levelQuestOne.questState.state = "end";
        }
    },
    questPresent: () => {
        tank.tankUpgrade(10000);
    }
};
