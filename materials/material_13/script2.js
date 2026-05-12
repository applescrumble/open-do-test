//a÷b=c...d
const a = 125;
const b = 7;
let str = a.toString(); //割られる数を文字列に変換
let sho = 0;
let amari = 0;
let target = 0;
let result = "";

let steps = [];

//描画関数
function putDigit(row, col, value) {
  const div = document.createElement("div");
  div.className = "cell";
  div.textContent = value;
  div.style.gridRow = row;
  div.style.gridColumn = col;
  document.getElementById("hissan-container").appendChild(div);
}

putDigit(2, 1, b);
putDigit(2, 2, ")");

//割られる数を左から1つずつ見ていく
let i = 0;
let flag = 0;

for (let digit of str) {
  let value = Number(digit); //割られる数の１字を文字から数字に

  target = amari * 10 + value; //このステップにおける「割られる数」

  sho = (target / b) | 0; //商

  if (sho !== 0) {
    flag++;
  }

  amari = target % b; //あまり（２桁になる場合がある）

  steps.push({
    //このステップにおける情報
    index: i,
    target: target,
    sho: sho,
    sub: sho * b, //引く数
    amari: amari,
    flag: flag,
  });
  console.log(steps[i]); //デバッグ用
  i++;
}

//ステップごとに描画していく
let k=3;
steps.forEach((step, i) => {
  putDigit(2, 3 + i, str[i]); //割られる数

  if(step.flag>1){
    putDigit(k, 3+i, str[i]);
    k++;
  }

  if (step.flag > 0) {
    putDigit(1, 3 + i, step.sho);
    
    if(step.sho>0){
        let subStr=step.sub.toString();
        let j=0;
        for(let subDigit of subStr){
            let subValue=Number(subDigit);
            putDigit(k, 3+i-subStr.length+1+j, subValue);
            j++;
        }
        k++;//筆算を１行下にする
    }
    putDigit(k, 3+i, step.amari);
    
  
}

});

/*
steps.forEach((step, i) => {

  if (step.index === 0) {
    putDigit(2, 3, str[0]);
  }
  if (step.index > 0) {
    let targetStr = step.target.toString();

    for (let j = 0; j < targetStr.length; j++) {
      putDigit(
        2 + step.index * 2,
        3 + step.index - (targetStr.length - 1) + j,
        targetStr[j],
      );
    }
  }

  putDigit(1, 3 + step.index, step.sho); //商

  if (step.sho > 0) {
    let subStr = step.sub.toString();
    for (let j = 0; j < subStr.length; j++) {
      putDigit(
        3 + step.index * 2,
        3 + step.index - (subStr.length - 1) + j,
        subStr[j],
      ); //引く数
    }
    putDigit(4 + step.index * 2, 3 + step.index, step.amari);
  }
});
*/
