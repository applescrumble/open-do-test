const board = document.getElementById("bingo-board");
const switchBtn = document.getElementById("switch");

const wordData = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  lower: "abcdefghijklmnopqrstuvwxyz".split(""),
};

let currentMode = "upper";//大文字モード

//1. インデックスを用意してシャッフル
let indexes=[...Array(26).keys()];//要素数26の配列を用意し、数字を生成し、配列に入れる
for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }

//2. ビンゴ用の25個を取り出す
const bingoIndexes = indexes.slice(0, 25);
let statusList=new Array(26).fill(false);//どれもまだ選択されていない

// ビンゴのパターンと、それぞれのパターンが出たかどうかを格納する配列を作る
const bingoPatterns = [
  [0,1,2,3,4], // 横
  [5,6,7,8,9], 
  [10,11,12,13,14], 
  [15,16,17,18,19], 
  [20,21,22,23,24], 
  [0,5,10,15,20], // 縦
  [1,6,11,16,21], 
  [2,7,12,17,22],
  [3,8,13,18,23],
  [4,9,14,19,24],
  [0,6,12,18,24], // 斜め
  [4,8,12,16,20],  
];
let bingoAchieved=Array(bingoPatterns.length).fill(false);



// ビンゴ判定
function checkBingo(){
    const cells=document.querySelectorAll(".cell");
    let newBingo=false;

    bingoPatterns.forEach((pattern, index)=>{//patternはbingoPatternの要素、indexはbingoAchievedの番号
      if(!bingoAchieved[index]){//あるパターンのビンゴがまだ出ていなければ
            const isBingo=pattern.every(i=>//.everyは配列のすべての要素が条件を満たすかを判定。
                cells[i].classList.contains("selected")
            );
        if(isBingo){
            bingoAchieved[index]=true;//あるパターンのビンゴが出た、とフラグを立てて
            newBingo=true;//新しくビンゴが出たということにする
            pattern.forEach(i=>cells[i].classList.add("bingo"));//ビンゴになったセルに色をつける
        } 
      }
    });

    return newBingo;//新しくビンゴが出たかどうか
};

function renderBoard() {
  board.innerHTML = "";//htmlをリセット

  bingoIndexes.forEach((alphabetIndex, arrayIndex) => {
    //それぞれのインデックスに対してセルを作る
    const cell = document.createElement("div");
    cell.classList.add("cell");

    if (arrayIndex===12){
      cell.textContent="★";
      cell.classList.add("selected", "free-cell");
      statusList[alphabetIndex]=true;
    }else{
      cell.textContent=wordData[currentMode][alphabetIndex];
      if(statusList[alphabetIndex]){
        cell.classList.add("selected");
      }
    }

    cell.addEventListener("click", ()=>{
      if(arrayIndex===12)return;
      statusList[alphabetIndex]=!statusList[alphabetIndex];
      cell.classList.toggle("selected");

      if (checkBingo()){
        setTimeout(()=>alert("ビンゴ！🎉🎉🎉"), 100);
      }
    });
   
    board.appendChild(cell); //boardの子として追加する
  });
}

switchBtn.addEventListener("click", () => {
  //モードが大文字なら小文字に、小文字なら大文字にする
  currentMode=currentMode==="upper" ? "lower":"upper";
  //モードに合わせてボタンの表記を変える
  switchBtn.textContent=currentMode==="upper" ? "小文字(abc)":"大文字(ABC)";
  renderBoard();
});


renderBoard();







