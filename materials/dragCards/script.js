let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
const stockGrid = document.getElementById('stock-grid');
const mainCanvas = document.getElementById('main-canvas');
let currentZIndex = 100;
let isColorMode=false;
let isUpperMode=false;

// 初期化：外周にカードを並べる
function initStock() {
    stockGrid.innerHTML = '';
    // 外周のセル番号を定義（10x6のグリッドの外周）
    const peripheralIndices = getPeripheralIndices(10, 6);
    
    alphabet.forEach((char, i) => {
        const card = createCard(char);
        const pos = peripheralIndices[i];
        if (pos) {
            card.style.gridColumn = pos.col;
            card.style.gridRow = pos.row;
            stockGrid.appendChild(card);
        }
    });
}

function createCard(char) {
    const div = document.createElement('div');
    div.className = `card letter-${char.toLowerCase()}`;
    if(isColorMode)div.classList.add("is-colored");
    div.textContent = isUpperMode ? char.toUpperCase() : char. toLowerCase();
    div.onmousedown = (e) => startDrag(e, div);
    return div;
}

// ドラッグ処理の核心
function startDrag(e, card) {
    let target = card;

    // ストックから触った場合は複製
    if (!card.classList.contains('on-canvas')) {
        const rect = card.getBoundingClientRect();
        target = card.cloneNode(true);
        target.classList.add('on-canvas');
        
        // 複製した瞬間にダブルクリック削除機能を付与
        target.ondblclick = () => target.remove();
        
        // 元の場所と同じ位置に配置
        target.style.left = rect.left + 'px';
        target.style.top = rect.top + 'px';
        document.body.appendChild(target); 

        target.onmousedown=(event)=>startDrag(event, target);
    }

    // 重なり順を一番上にする
    target.style.zIndex = ++currentZIndex;

    // マウス移動時の処理
    
    const shiftX = e.clientX - target.getBoundingClientRect().left;
    const shiftY = e.clientY - target.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        target.style.left = pageX - shiftX + 'px';
        target.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        document.onmouseup = null;
    };
    target.ondragstart=function(){return false};;
}

// 外周の座標を計算するユーティリティ
function getPeripheralIndices(cols, rows) {
    let indices = [];
    for(let c=1; c<=cols; c++) indices.push({col: c, row: 1}); // 上
    for(let r=2; r<=rows; r++) indices.push({col: cols, row: r}); // 右
    for(let c=cols-1; c>=1; c--) indices.push({col: c, row: rows}); // 下
    for(let r=rows-1; r>=2; r--) indices.push({col: 1, row: r}); // 左
    return indices;
}

// ツールバー機能
function toggleCase() {
    isUpperMode=!isUpperMode;
    const cards = document.querySelectorAll('#stock-grid .card');
    cards.forEach(c => {
        //const isUpper = c.textContent === c.textContent.toUpperCase();
        c.textContent = isUpperMode ? c.textContent.toUpperCase() : c.textContent.toLowerCase();
    });
}

function toggleColor() {
    isColorMode=!isColorMode;
    const cards = document.querySelectorAll('#stock-grid .card');
    cards.forEach(c => {
        if(isColorMode)c.classList.add("is-colored");
        else c.classList.toggle('is-colored');
});
}

function shuffleStock() {
    alphabet.sort(() => Math.random() - 0.5);
    initStock();
}
function orderStock(){
    alphabet.sort();
    initStock();
}

function resetCanvas() {
    document.querySelectorAll('.on-canvas').forEach(c => c.remove());
}

initStock();