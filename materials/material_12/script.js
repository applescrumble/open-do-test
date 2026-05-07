// --- 状態を管理する変数 ---
let questionCount = 0;
let correctCount = 0;
let wrongAnswers = [];
let quizSet = [];
let isFirstTry = true;

// --- 要素の取得 ---
const numInput = document.getElementById('numInput');
const ansBtn = document.getElementById('ansBtn');
const feedback = document.getElementById('feedback');

// --- 出題したい数字のリスト ---
const targetNumbers = [
    4253, 4250, 4050, 425, 7425, 7400, 87002, 39500, 16009503, 190325000,
    237000000, 420021000, 700302090, 3500000000, 260000000, 4809000300,
    2070092345, 3410000400, 86000531019
];


function numberToKanji(num) {
    if (num === 0) return "〇";
    const units = ["", "十", "百", "千"];
    const bigUnits = ["", "万", "億", "兆"];
    const kanjiNums = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

    let res = "";
    let unitCount = 0;

    // 4桁ずつ区切って処理する（日本の数字の数え方）
    while (num > 0) {
        let part = num % 10000;
        let partRes = "";
        for (let i = 0; i < 4; i++) {
            let digit = part % 10;
            if (digit !== 0) {
                // 10, 100, 1000 の時、「一十」ではなく「十」とするための処理
                let s = (i > 0 && digit === 1) ? "" : kanjiNums[digit];
                partRes = s + units[i] + partRes;
            }
            part = Math.floor(part / 10);
        }
        if (partRes !== "") {
            res = partRes + bigUnits[unitCount] + res;
        }
        num = Math.floor(num / 10000);
        unitCount++;
    }
    return res;
}

numInput.addEventListener('input', (e) => {
    // 1. いったんスペースをすべて消して数字だけにする
    let value = e.target.value.replace(/\s+/g, '');

    // 2. 右から4桁ごとにスペースを入れる
    // 正規表現を使って、後ろから4桁のまとまりを見つけてスペースを差し込む
    let formattedValue = value.replace(/(\d)(?=(\d{4})+$)/g, '$1 ');

    // 3. 入力欄に反映させる
    e.target.value = formattedValue;
});

// --- 画面切り替え ---
function showScreen(screenId) {
    const screens = ['screen-start', 'screen-quiz', 'screen-result'];
    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'block';
}

// --- クイズセット作成 ---
function createQuizSet() {
    quizSet = [];
    const shuffled = [...targetNumbers].sort(() => Math.random() - 0.5);
    const maxQuestions = Math.min(shuffled.length, 5);
    
    for (let i = 0; i < maxQuestions; i++) {
        const num = shuffled[i];
        quizSet.push({
            questionText: numberToKanji(num), // 自作関数を使用！
            answer: num
        });
    }
}

// --- クイズ開始 ---
function startQuiz(mode) {
    questionCount = 1;
    correctCount = 0;
    wrongAnswers = [];
    createQuizSet();
    showScreen('screen-quiz');
    displayQuestion();
}

// --- 問題表示 ---
function displayQuestion() {
    isFirstTry = true;
    feedback.innerText = "";
    numInput.value = ""; 
    numInput.focus();

    const currentQ = quizSet[questionCount - 1];
    document.getElementById('question-number').innerText = `だい ${questionCount} もん`;
    document.getElementById('question-text').innerText = currentQ.questionText;

    const progress = (questionCount / quizSet.length) * 100;
    document.getElementById('progress').style.width = progress + "%";
}

// --- 回答チェック ---
ansBtn.addEventListener('click', () => {
    const userAnswer = parseInt(numInput.value.replace(/\s+/g, ''), 10);
    const currentQ = quizSet[questionCount - 1];

    if (isNaN(userAnswer)) {
        feedback.innerText = "数字をいれてね！";
        return;
    }

    if (userAnswer === currentQ.answer) {
        feedback.innerText = "せいかい！";
        //feedback.style.color = "blue";
        if (isFirstTry) correctCount++;

        setTimeout(() => {
            if (questionCount < quizSet.length) {
                questionCount++;
                displayQuestion();
            } else {
                showResult();
            }
        }, 1000);
    } else {
        isFirstTry = false;
        feedback.innerText = "ざんねん！もう一回考えてみてね。";
        //feedback.style.color = "red";
        
        const textToStore = `${currentQ.questionText}（答え：${currentQ.answer}）`;
        if (!wrongAnswers.includes(textToStore)) {
            wrongAnswers.push(textToStore);
        }
    }
});

// --- 結果表示 ---
function showResult() {
    document.getElementById('result-score').innerText = `${quizSet.length}もん中 ${correctCount}もん せいかい！`;
    const resultImg = document.getElementById('result-image');
    const scoreRate = correctCount / quizSet.length;
    
    if (correctCount === 5) {
        resultImg.src = 'level3.webp';
        document.getElementById('result-comment').innerText = `今日の売れ行き：やったー！大繁盛！`;
    } else if (correctCount >= 3) {
        resultImg.src = 'level2.webp';
        document.getElementById('result-comment').innerText = `今日の売れ行き：いい感じ！`;
    } else {
        resultImg.src = 'level1.webp';
        document.getElementById('result-comment').innerText = `今日の売れ行き：全然売れなかった…`;
    }
    // 画像がない場合でもエラーにならないように配慮
    if (scoreRate === 1) {
        resultImg.alt = "満点！おめでとう！";
    }

    const listContainer = document.getElementById('wrong-answers-list');
    listContainer.innerHTML = "";

    if (wrongAnswers.length === 0) {
        listContainer.innerHTML = "<p>ぜんぶ いっかいで せいかい！<br>すごすぎる！</p>";
    } else {
        const ul = document.createElement('ul');
        wrongAnswers.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item;
            ul.appendChild(li);
        });
        listContainer.appendChild(ul);
    }
    showScreen('screen-result');
}


function backToStart() {
    showScreen('screen-start');
}

// 入力欄でキーが押された時の処理
numInput.addEventListener('keydown', (e) => {
    // 押されたキーが "Enter" だった場合
    if (e.key === 'Enter') {
        // 回答ボタンを代わりにクリックしたことにする
        ansBtn.click();
    }
});

dummyInput.addEventListener('input', (e) => {
    // 1. いったんスペースをすべて消して数字だけにする
    let value = e.target.value.replace(/\s+/g, '');

    // 2. 右から4桁ごとにスペースを入れる
    // 正規表現を使って、後ろから4桁のまとまりを見つけてスペースを差し込む
    let formattedValue = value.replace(/(\d)(?=(\d{4})+$)/g, '$1 ');

    // 3. 入力欄に反映させる
    e.target.value = formattedValue;

    if(value==16009503){
        document.getElementById('dummyFeedback').innerText="正解！"
    }
    
});

