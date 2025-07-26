// 音频控制器
class SoundController {
    constructor() {
        this.currentSound = null;
    }

    async playSound(soundName) {
        // 如果有正在播放的声音，停止它
        if (this.currentSound) {
            this.currentSound.pause();
            this.currentSound.currentTime = 0;
        }

        // 创建新的音频实例
        const audio = new Audio(`/static/audio/animals/${soundName}.mp3`);
        this.currentSound = audio;

        try {
            await audio.play();
            // 添加播放状态样式
            const btn = document.querySelector('.animal-sound-btn');
            btn.classList.add('playing');

            // 监听播放结束
            audio.onended = () => {
                btn.classList.remove('playing');
                this.currentSound = null;
            };
        } catch (error) {
            console.error('播放声音失败:', error);
        }
    }
}

// 创建全局音频控制器实例
const soundController = new SoundController();

// 播放动物声音的函数
function playAnimalSound(animalType) {
    soundController.playSound(animalType);
} 