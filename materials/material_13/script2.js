//a÷b=c...d
const a = 502;
const b = 5;
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

  sho = Math.floor(target / b); //商

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
let k = 3;
steps.forEach((step, i) => {
  putDigit(2, 3 + i, str[i]); //割られる数

  if (step.flag>1 && step.index > 0) {//ターゲットを新しく描画（あまりと下ろし）
    let targetStr = step.target.toString();
    let m = 0;
    for (let targetDigit of targetStr) {
      let targetValue = Number(targetDigit);//なくても良い
      putDigit(k, 3 + i - targetStr.length + 1 + m, targetValue);
      m++;
    }
    k++; //筆算を１行下にする
  }

  if (step.flag>0) {
    putDigit(1, 3 + i, step.sho);//商を書く（左側の０以外）

    if (step.sho > 0) {//引き算を書く
      let subStr = step.sub.toString();
      let j = 0;
      for (let subDigit of subStr) {
        let subValue = Number(subDigit);//なくても良い
        putDigit(k, 3 + i - subStr.length + 1 + j, subValue);
        j++;
      }
      k++; //筆算を１行下にする
    }
  }
  if(i===str.length-1){
    putDigit(k, 3+i, step.amari);
  }
});

