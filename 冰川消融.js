document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const content = document.getElementById('content');
    const subtitleText = document.getElementById('subtitleText');
    const crisisShowcase = document.getElementById('crisisShowcase');
    const iceScrollSections = document.getElementById('iceScrollSections');
    const snowfallContainer = document.getElementById('snowfall-container');
    const titleElement = document.querySelector('#content .title');
    const backToIndex = document.getElementById('backToIndex');

    const originalTitleText = titleElement.innerText;
    const subtitleChars = "每一片冰川的消融，都在诉说着极地生态的脆弱，每一个生命的挣扎，都在呼唤着人类的觉醒".split('');
    const crisisData = [
        {img:'./static/images/冰川断裂.jpg', text:'冰川正在以惊人的速度消失，极地生态系统岌岌可危'},
        {img:'./static/images/浮冰上的北极熊.jpg', text:'北极熊失去家园，饥饿难耐'},
        {img:'./static/images/浮冰上的企鹅.jpg', text:'企鹅繁殖地被海水吞噬'},
        {img:'./static/images/浮冰上的海豹.jpg', text:'海豹的家园正在消失'},
        {img:'./static/images/冰面裂缝延伸.jpg', text:'冰面裂缝不断蔓延，危机加剧'}
    ];

    const playAnimation = (element, animation, duration) => new Promise(resolve => {
        element.classList.add(animation);
        setTimeout(resolve, duration);
    });

    const typeWriter = (element, text, interval) => new Promise(resolve => {
        element.innerHTML = '';
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text[i];
                i++;
            } else {
                clearInterval(typing);
                resolve();
            }
        }, interval);
    });

    const showCrisisImages = () => new Promise(resolve => {
        crisisShowcase.style.display = 'flex';
        let idx = 0;
        const showNext = () => {
            if(idx >= crisisData.length) {
                setTimeout(() => {
                    crisisShowcase.style.display = 'none';
                    resolve();
                }, 1000);
                return;
            }
            crisisShowcase.innerHTML = `<div class="crisis-group"><img src="${crisisData[idx].img}" alt="${crisisData[idx].text}"><div class="crisis-text">${crisisData[idx].text}</div></div>`;
            setTimeout(() => document.querySelector('.crisis-group')?.classList.add('show'), 50);
            idx++;
            setTimeout(() => {
                document.querySelector('.crisis-group')?.classList.remove('show');
                setTimeout(showNext, 300);
            }, 2000);
        }
        showNext();
    });
    
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.innerHTML = '❄';
        snowflake.classList.add('snowflake');
        const size = Math.random() * 20 + 10;
        snowflake.style.fontSize = `${size}px`;
        snowflake.style.left = `${Math.random() * 100}vw`;
        const duration = Math.random() * 5 + 8;
        snowflake.style.animationDuration = `${duration}s`;
        const delay = Math.random() * 5;
        snowflake.style.animationDelay = `${delay}s`;
        snowfallContainer.appendChild(snowflake);
        snowflake.addEventListener('animationend', () => snowflake.remove());
    }

    async function startIntroSequence() {
        content.classList.add('show');

        titleElement.innerHTML = originalTitleText.split('').map(char => `<span class="title-char">${char}</span>`).join('');
        const titleChars = document.querySelectorAll('.title-char');
        for (let i = 0; i < titleChars.length; i++) {
            await playAnimation(titleChars[i], 'animate', 80);
        }
        await new Promise(res => setTimeout(res, 800));

        await typeWriter(subtitleText, subtitleChars.join(''), 120);
        
        // 隐藏标题和副标题，为图片展示做准备
        content.style.opacity = '0';
        await new Promise(res => setTimeout(res, 500)); // 等待淡出

        await showCrisisImages();

        startBtn.style.display = 'block';
        setTimeout(() => startBtn.classList.add('show'), 100);
    }

    startBtn.addEventListener('click', () => {
        startBtn.classList.remove('show');
        setTimeout(() => {
            startBtn.style.display = 'none';
            document.body.classList.remove('lock-scroll');
            iceScrollSections.style.display = 'block';
            iceScrollSections.classList.add('show');
            setInterval(createSnowflake, 300);
        }, 500);
    });
    
    if (backToIndex) {
        const backObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.location.href = 'index.html';
                }
            });
        }, { threshold: 0.7 });
        backObserver.observe(backToIndex);
    }

    startIntroSequence();
}); 