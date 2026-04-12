//状態を管理する変数
let currentMode="";
let questionCount=0;
let correctCount=0;
let wrongAnswers=[];
let quizSet=[];
let isFirstTry=true;

//画面を切り替える共通関数
function showScreen(screenId){
    //すべての画面を一度隠す
    document.getElementById('screen-start').style.display='none';
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
        setTimeout(()=>{
        if(questionCount<10){
            questionCount++;
            displayQuestion();
        }else{
            showResult();
        }
        }, 1000);
    }else{
        isFirstTry=false;
        document.getElementById('feedback').innerText="ざんねん！もう一回考えてみてね。";
        if(!wrongAnswers.includes(currentQ.questionText)){
            wrongAnswers.push(currentQ.questionText+"(答え：" + currentQ.answer + ")");
        }
    }
}

function showResult(){
    document.getElementById('result-score').innerText=`10もん中 ${correctCount}もん　せいかい！`
    
    const listContainer=document.getElementById('wrong-answers-list');
    listContainer.innerHTML="";

    if(wrongAnswers.length===0){
        listContainer.innerHTML="<p>ぜんぶ　いっかいで　せいかい！すごすぎる！</p>";
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
    showScreen('screen-start');
}

function generateQuestion(mode){
    let minB, maxB;

    if(mode==='easy'){
        minB=1;
        maxB=3;
    }else if(mode==='normal'){
        minB=4;
        maxB=6;
    }else{
        minB=7;
        maxB=9;
    }

    const B=Math.floor(Math.random()*(maxB-minB+1))+minB;
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

    if(questionCount>10) return;

    const currentQ=quizSet[questionCount-1];

    if(currentQ){
    document.getElementById('question-number').innerText=`だい　${questionCount}もん`
    document.getElementById('question-text').innerText=currentQ.questionText;

    document.getElementById('choice1').innerText=currentQ.choices[0];
    document.getElementById('choice2').innerText=currentQ.choices[1];
    }
    //document.getElementById('feedback').innerText="";
}