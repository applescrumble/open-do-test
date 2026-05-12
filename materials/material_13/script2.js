//a÷b=c...d

const a=125;
const b=5;
let str=a.toString();
let sho=0;
let amari=0;
let target=0;
let result="";

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
    
    console.log(`注目中の数字: ${digit}, 計算対象: ${target}, 商: ${sho}, 余り: ${amari}`);
}
console.log(result+" あまり"+amari);
