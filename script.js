import { appList } from './data.js';

const container = document.getElementById('card-container');
let htmlContent = '';

appList.forEach(app => {
    // ここの ${app.title} と ${app.desc} が正確かチェック！
    htmlContent += `
    <article class="card">
        <img src="${app.image}" class="card-img">
        <div class="card-content">
            <h3>${app.title}</h3>
            <p>${app.desc}</p>
            <div class="btn-wrapper">
                <a href="${app.link}" class="btn">アプリを開く</a>
            </div>
        </div>
    </article>
    `;
});

container.innerHTML = htmlContent;

