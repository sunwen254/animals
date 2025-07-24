document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.overlap-card');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentIndex = 0;
    const totalCards = cards.length;
    // 添加自动轮播定时器（初始化为null）
    let autoplayTimer = null;

    // 更新卡片状态
    function updateCards() {
        cards.forEach(card => {
            card.classList.remove('active', 'left', 'right', 'far-left', 'far-right');
        });

        const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
        const nextIndex = (currentIndex + 1) % totalCards;
        const farPrevIndex = (currentIndex - 2 + totalCards) % totalCards;
        const farNextIndex = (currentIndex + 2) % totalCards;

        cards[currentIndex].classList.add('active');
        cards[prevIndex].classList.add('left');
        cards[nextIndex].classList.add('right');

        if (totalCards > 3) {
            cards[farPrevIndex].classList.add('far-left');
            cards[farNextIndex].classList.add('far-right');
        }
    }

    // 下一张（用于自动轮播）
    function nextCard() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCards();
    }

    // 启动自动轮播（每5秒切换一次）
    function startAutoplay() {
        // 清除已有定时器，避免重复
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = setInterval(nextCard, 2000); // 5000ms = 5秒
    }

    // 上一张
    prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCards();
        startAutoplay(); // 手动切换后重启自动轮播
    });

    // 下一张
    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCards();
        startAutoplay(); // 手动切换后重启自动轮播
    });

    // 点击左右卡片切换
    cards.forEach(card => {
        card.addEventListener('click', function() {
            if (this.classList.contains('left')) {
                prevBtn.click();
            } else if (this.classList.contains('right')) {
                nextBtn.click();
            }
        });
    });

    // 鼠标悬停时暂停自动轮播
    const carousel = document.querySelector('.overlap-carousel');
    carousel.addEventListener('mouseenter', () => {
        if (autoplayTimer) clearInterval(autoplayTimer);
    });

    // 鼠标离开时恢复自动轮播
    carousel.addEventListener('mouseleave', startAutoplay);

    // 初始化：启动自动轮播
    updateCards();
    startAutoplay();
});