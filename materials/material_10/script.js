//状態を管理する変数
let currentMode="";
let questionCount=0;
let correctCount=0;
let wrongAnswers=[];
let quizSet=[];
let isFirstTry=true;
let selectedBs=[];

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

function goToCustomConfig() {
  // 選んでいた数字を一度リセットしたい場合はここで空にする
  selectedBs = [];
  
  // 全ボタンのスタイルを元に戻す（もしクラスで管理しているならクラスを外す）
  const btns = document.querySelectorAll('.num-btn');
  btns.forEach(btn => btn.classList.remove('selected'));

  // カスタム設定画面を表示
  showScreen('screen-custom');
}

function toggleNumber(num){
    const index=selectedBs.indexOf(num);
    const btn=document.querySelectorAll('.num-btn')[num-1];//対応するボタン

    if(index===-1){
        selectedBs.push(num);
        btn.classList.add('selected');
        btn.style.backgroundColor="#ff4500";
    }else{
        selectedBs.splice(index, 1);
        btn.classList.remove('selected');
        btn.style.backgroundColor="";
    }
}

function startCustomQuiz(){
    if(selectedBs.length===0){
        alert("数字をひとつ以上えらんでね！");
        return;
    }
    currentMode='custom';
    questionCount=1;
    correctCount=0;
    wrongAnswers=[];

    createQuizSet('custom');
    displayQuestion();
    showScreen('screen-quiz');
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
    const textToStore = currentQ.questionText + "(答え：" + currentQ.answer + ")";
    
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

function generateQuestion(mode){
    
    let B;

    if(mode==='custom'){
        const randomIndex=Math.floor(Math.random()*selectedBs.length);
        B=selectedBs[randomIndex];
    }else{
        let minB, maxB;
        if(mode==='easy'){minB=1; maxB=3;}
        else if(mode==='normal'){minB=4; maxB=6;}
        else{minB=7;maxB=9;}
    B=Math.floor(Math.random()*(maxB-minB+1))+minB;
}

    const C=Math.floor(Math.random()*10);
    const A=B*C;

    let wrongChoice;
    do{
        wrongChoice=Math.floor(Math.random()*10);
    }while(wrongChoice===C);

    const choices=[C, wrongChoice].sort(()=>Math.random()-0.5);

    return{
        questionText: `${A} ÷ ${B} = ?`,
        answer: C,
        choices: choices
    };
}


function createQuizSet(mode){
    quizSet=[];
    while(quizSet.length<10){
        const newQ=generateQuestion(mode);
        const isDuplicate=quizSet.some(q=>q.questionText===newQ.questionText);
        if(!isDuplicate){
            quizSet.push(newQ);
        }
    }
}

function displayQuestion(){
    isFirstTry=true;

    document.getElementById('feedback').innerText="";

    if(questionCount>10) return;

    const currentQ=quizSet[questionCount-1];

    if(currentQ){
    document.getElementById('question-number').innerText=`だい ${questionCount} もん`
    document.getElementById('question-text').innerText=currentQ.questionText;

    document.getElementById('choice1').innerText=currentQ.choices[0];
    document.getElementById('choice2').innerText=currentQ.choices[1];
    }

    const progress=(questionCount/10)*100;
    document.getElementById('progress').style.width=progress+"%";
    //document.getElementById('feedback').innerText="";
}

