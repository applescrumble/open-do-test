const board = document.getElementById("card-board");
const wordData = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  lower: "abcdefghijklmnopqrstuvwxyz".split(""),
};

const switchBtn = document.getElementById("switch");
const shuffleBtn = document.getElementById("shuffle");
const orderBtn=document.getElementById("order");

let currentMode = "upper";//大文字モード

let indexes=[...Array(26).keys()];//要素数26の配列を用意し、数字を生成し、配列に入れる
let statusList=new Array(26).fill(false);//どれもまだ選択されていない


function renderBoard() {
  board.innerHTML = "";//htmlをリセット

  indexes.forEach((alphabetIndex, arrayindex) => {
    //それぞれのインデックスに対してセルを作る
    const cell = document.createElement("div");
    cell.classList.add("cell");
    //モード、インデックスに対応した文字を書く
    cell.textContent = wordData[currentMode][alphabetIndex];
    //ステータスがTなら選択済み
    if(statusList[alphabetIndex]){
      cell.classList.add("selected");
    }
    //セルをクリックしたらステータスが切り替わる
    cell.addEventListener("click", () => {
      
      statusList[alphabetIndex]=!statusList[alphabetIndex];
      cell.classList.toggle("selected");//あれば消す、無ければ足す
    });

    board.appendChild(cell); //boardの子として追加する
  });
}
function shuffleLetters() {
  //配列インデックスの順番をシャッフル
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
};
function orderLetters(){
  for (let i=0; i<indexes.length; i++){
    indexes[i]=i;
  }
};


switchBtn.addEventListener("click", () => {
  //モードが大文字なら小文字に、小文字なら大文字にする
  currentMode=currentMode==="upper" ? "lower":"upper";
  //モードに合わせてボタンの表記を変える
  switchBtn.textContent=currentMode==="upper" ? "小文字(abc)":"大文字(ABC)";
  //orderBtn.textContent=currentMode==="upper" ? "じゅんばん(ABC)":"じゅんばん(abc)";
  renderBoard();
});

shuffleBtn.addEventListener("click", () => {
  //インデックスをシャッフルする
  shuffleLetters();
  //セルを復活させる
  statusList=new Array(26).fill(false);
  renderBoard();
});

orderBtn.addEventListener("click", ()=>{
  orderLetters();
  renderBoard();
})

//shuffleLetters();
renderBoard();
