//状態を管理する変数
let currentMode="";
let questionCount=0;
let correctCount=0;
let wrongAnswers=[];
let quizSet=[];
let isFirstTry=true;
let selectedBs=[];

const numInput=document.getElementById('numInput');
const ansBtn=document.getElementById('andBtn');
const deefback=document.getElementById('feedback');
const targetNumbers = [
    4253, 4250, 4050, 425, 7425, 7400, 87002, 39500, 16009503
];

//画面を切り替える共通関数
function showScreen(screenId){
    //すべての画面を一度隠す
    document.getElementById('screen-start').style.display='none';
    document.getElementById('screen-custom').style.display='none';
    document.getElementById('screen-quiz').style.display='none';
    document.getElementById('screen-result').style.display='none';

    //指定された画面だけ表示する
    document.getElementById(screenId).style.display='block';
}




//各イベントごとの処理
function startQuiz(mode){
    currentMode=mode;
    questionCount=1;
    correctCount=0;
    wrongAnswers=[];

    //クイズ画面へ切り替え
    createQuizSet(mode);
    displayQuestion();
    showScreen('screen-quiz');
}

function checkAnswer(choiceIndex){
    
    const currentQ=quizSet[questionCount-1];
    const selectedAnswer=currentQ.choices[choiceIndex];

    if(selectedAnswer===currentQ.answer){
        document.getElementById('feedback').innerText="せいかい！";
        if(isFirstTry){
            correctCount++;
        }
        document.getElementById('choice1').disabled = true;
        document.getElementById('choice2').disabled = true;
        setTimeout(()=>{
            document.getElementById('choice1').disabled = false;
            document.getElementById('choice2').disabled = false;
        if(questionCount<10){
            questionCount++;
            displayQuestion();
        }else{
            showResult();
        }
        }, 1000);
    }else{
        isFirstTry = false;
    document.getElementById('feedback').innerText = "ざんねん！もう一回考えてみてね。";
    
    // 1. まず、保存したい「完成した文字」を作る
    const textToStore = currentQ.questionText + "（答え：" + currentQ.answer + "）";
    
    // 2. その「完成した文字」がリストにあるかチェックする
    if (!wrongAnswers.includes(textToStore)) {
        wrongAnswers.push(textToStore);
    }
    }
}

function showResult(){
    document.getElementById('result-score').innerText=`10もん中 ${correctCount}もん　せいかい！`
    
    const resultImg=document.getElementById('result-image');
    if (correctCount === 10) {
        resultImg.src = 'score_10.png'; // 満点の画像
    } else if (correctCount >= 7) {
        resultImg.src = 'score_good.png'; // 7-9点の画像
    } else {
        resultImg.src = 'score_fight.png'; // 6点以下の画像
    }

    const listContainer=document.getElementById('wrong-answers-list');
    listContainer.innerHTML="";

    if(wrongAnswers.length===0){
        listContainer.innerHTML="<p>ぜんぶ　いっかいで　せいかい！<br>すごすぎる！</p>";
    }else{
        const ul=document.createElement('ul');
        wrongAnswers.forEach(item=>{
            const li=document.createElement('li');
            li.innerText=item;
            ul.appendChild(li);
        });
        listContainer.appendChild(ul);
    }
    showScreen('screen-result');
}

function backToStart(){
    selectedBs=[];
    const btns=document.querySelectorAll('.num-btn');
    btns.forEach(btn=>btn.style.backgroundColor="");
    showScreen('screen-start');
}

function generateQuestion(){
    
}


function createQuizSet() {
    quizSet = [];
    
    // リスト（targetNumbers）をシャッフルする
    const shuffled = [...targetNumbers].sort(() => Math.random() - 0.5);
    
    // シャッフルしたリストの先頭から10問取り出す
    for (let i = 0; i < 10; i++) {
        // もしリストが10個より少ない場合に備えてエラー防止
        if (shuffled[i] !== undefined) {
            const num = shuffled[i];
            quizSet.push({
                questionText: japaneseNumeral.number2kanji(num),
                answer: num
            });
        }
    }
}

function startQuiz(mode){
    questionCount=1;
    correctCount=0;
    wrongAnswers=[];
    createQuizSet();
    showScreen('screen-quiz');
    displayQuestion();
}

function displayQuestion() {
    isFirstTry = true;
    feedback.innerText = "";
    numInput.value = ""; // 入力欄を空にする
    numInput.focus();    // すぐ入力できるようにする

    const currentQ = quizSet[questionCount - 1];
    document.getElementById('question-number').innerText = `だい ${questionCount} もん`;
    document.getElementById('question-text').innerText = currentQ.questionText;

    const progress = (questionCount / 10) * 100;
    document.getElementById('progress').style.width = progress + "%";
}

// 4. 回答チェック
ansBtn.addEventListener('click', () => {
    const userAnswer = parseInt(numInput.value);
    const currentQ = quizSet[questionCount - 1];

    if (isNaN(userAnswer)) return; // 何も入っていない時は無視

    if (userAnswer === currentQ.answer) {
        feedback.innerText = "せいかい！";
        feedback.style.color = "blue";
        if (isFirstTry) correctCount++;

        setTimeout(() => {
            if (questionCount < 10) {
                questionCount++;
                displayQuestion();
            } else {
                showResult();
            }
        }, 1000);
    } else {
        isFirstTry = false;
        feedback.innerText = "ざんねん！ちがうみたい。";
        feedback.style.color = "red";
        
        const errorMsg = `${currentQ.questionText} （せいかい：${currentQ.answer}）`;
        if (!wrongAnswers.includes(errorMsg)) {
            wrongAnswers.push(errorMsg);
        }
    }
});

// 5. 結果と画面切り替え
function showResult() {
    document.getElementById('result-score').innerText = `10もん中 ${correctCount}もん せいかい！`;
    const listContainer = document.getElementById('wrong-answers-list');
    listContainer.innerHTML = "";

    if (wrongAnswers.length === 0) {
        listContainer.innerHTML = "<p>全問正解！すごい！</p>";
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

function showScreen(screenId) {
    document.getElementById('screen-start').style.display = 'none';
    document.getElementById('screen-quiz').style.display = 'none';
    document.getElementById('screen-result').style.display = 'none';
    document.getElementById(screenId).style.display = 'block';
}

function backToStart() {
    showScreen('screen-start');
}
