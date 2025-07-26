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

        // 使用相对路径
        const audio = new Audio(`./static/audio/animals/${soundName}.mp3`);
        this.currentSound = audio;

        try {
            // 添加加载事件监听
            audio.addEventListener('canplaythrough', async () => {
                try {
                    await audio.play();
                    // 添加播放状态样式
                    const btn = document.querySelector('.animal-sound-btn');
                    if (btn) {
                        btn.classList.add('playing');
                    }

                    // 监听播放结束
                    audio.onended = () => {
                        if (btn) {
                            btn.classList.remove('playing');
                        }
                        this.currentSound = null;
                    };
                } catch (playError) {
                    console.error('播放失败:', playError);
                    // 显示用户友好的错误信息
                    alert('音频播放失败，请检查浏览器设置或尝试刷新页面');
                }
            });

            // 添加错误处理
            audio.addEventListener('error', (e) => {
                console.error('音频加载失败:', e);
                alert('音频文件加载失败，请检查网络连接');
            });

        } catch (error) {
            console.error('创建音频实例失败:', error);
            alert('音频初始化失败');
        }
    }
}

// 创建全局音频控制器实例
const soundController = new SoundController();

// 播放动物声音的函数
function playAnimalSound(animalType) {
    console.log('尝试播放声音:', animalType); // 添加调试信息
    soundController.playSound(animalType);
} 