//a÷b=c...d
const a=86;
const b=7;
let str=a.toString();
let sho=0;
let amari=0;
let target=0;
let result="";

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

    putDigit(2, 3+i, digit);
    putDigit(1, 3+i, sho);

    strSho=sho.toString();
    let j=0;
    for(let digit2 of strSho){
        putDigit(3+i*2, 3+i+j, digit2*b);
    }

    //putDigit(3+i*2, 3+i, sho*b);
    putDigit(4+i*2, 3+i, digit-sho*b);



    console.log(`注目中の数字: ${digit}, 計算対象: ${target}, 商: ${sho}, 余り: ${amari}`);
    
    i++;
}

console.log(result+" あまり"+amari);