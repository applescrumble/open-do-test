//a÷b=c...d
const a=86;
const b=7;
let str=a.toString();
let sho=0;
let amari=0;
let target=0;
let result="";

let steps=[];

function putDigit(row, col, value){
    const div=document.createElement('div');
    div.className='cell';
    div.textContent=value;

    div.style.gridRow=row;
    div.style.gridColumn=col;

    document.getElementById('hissan-container').appendChild(div);
}


putDigit(2,1,b);
putDigit(2,2,")");

let i=0;
for(let digit of str){

    let value=Number(digit);

    target=amari*10+value;

    sho=target/b|0;
    
    amari=target%b;

    if(sho===0&&result===""){
        result="";
    }else{
        result+=sho.toString();
    }

    //console.log(`注目中の数字: ${digit}, 計算対象: ${target}, 商: ${sho}, 余り: ${amari}`);
    
    steps.push({
        index: i,
        target: target,
        sho: sho,
        sub: sho*b,
        amari: target%b
    });
console.log(steps[i]);
    i++;
}

console.log(result+" あまり"+amari);

steps.forEach((step, i)=> {
    putDigit(2, 3+i, str[i]);//割られる数

    if(step.index>0){
        putDigit(2+step.index*2, 3+step.index, str[step.index]);//割られる数を下ろしてくる
    }

    if(step.sho>0||result!==""){
        putDigit(1, 3+step.index, step.sho);//商
        
        let subStr=step.sub.toString();
        for(let j=0; j<subStr.length; j++){
            putDigit(3+step.index*2, 3+step.index-(subStr.length-1)+j,subStr[j]);//引く数
            
        }
        putDigit(4+step.index*2, 3+step.index, step.amari);
    };
    
});