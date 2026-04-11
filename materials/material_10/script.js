//状態を管理する変数
let currentMode="";
let questionCount=0;
let correctCount=0;
let wrongAnswers=[];

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
    showScreen('screen-quiz');
}

function checkAnswer(choiceIndex){
    const isCorrect=true;

    if(isCorrect){
        alert("せいかい！");
        questionCount++;
        if(questionCount>10){
            showResult();
        }else{
            //次の問題へ
        }
    }else{
        alert("ざんねん！もう一回考えてみてね。");
        //間違えた問題を記録する処理など
    }
}

function showResult(){
    document.getElementById('result-score').innerText=`10もん中 ${correctCount}もん　せいかい！`
    showScreen('screen-result');
}

function backToStart(){
    showScreen('screen-start');
}