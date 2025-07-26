// 音频控制器
class SoundController {
    constructor() {
        this.currentSound = null;
    }

    async playSound(soundName) {
        console.log('开始播放声音:', soundName);
        
        // 如果有正在播放的声音，停止它
        if (this.currentSound) {
            this.currentSound.pause();
            this.currentSound.currentTime = 0;
        }

        // 使用相对路径
        const audioPath = `./static/audio/animals/${soundName}.mp3`;
        console.log('音频文件路径:', audioPath);
        
        const audio = new Audio(audioPath);
        this.currentSound = audio;

        // 添加加载进度监听
        audio.addEventListener('loadstart', () => {
            console.log('开始加载音频文件');
        });

        audio.addEventListener('progress', () => {
            console.log('音频加载进度中...');
        });

        audio.addEventListener('canplay', () => {
            console.log('音频可以开始播放');
        });

        try {
            // 添加加载事件监听
            audio.addEventListener('canplaythrough', async () => {
                console.log('音频完全加载完成，开始播放');
                try {
                    await audio.play();
                    console.log('音频播放成功');
                    
                    // 添加播放状态样式
                    const btn = document.querySelector('.animal-sound-btn');
                    if (btn) {
                        btn.classList.add('playing');
                        console.log('按钮样式已更新为播放状态');
                    }

                    // 监听播放结束
                    audio.onended = () => {
                        console.log('音频播放结束');
                        if (btn) {
                            btn.classList.remove('playing');
                        }
                        this.currentSound = null;
                    };
                } catch (playError) {
                    console.error('播放失败:', playError);
                    console.error('错误详情:', {
                        name: playError.name,
                        message: playError.message,
                        code: playError.code
                    });
                    
                    // 显示用户友好的错误信息
                    let errorMsg = '音频播放失败';
                    if (playError.name === 'NotAllowedError') {
                        errorMsg = '浏览器阻止了音频播放，请检查浏览器设置';
                    } else if (playError.name === 'NotSupportedError') {
                        errorMsg = '音频格式不支持';
                    }
                    alert(errorMsg);
                }
            });

            // 添加错误处理
            audio.addEventListener('error', (e) => {
                console.error('音频加载失败:', e);
                console.error('错误代码:', audio.error?.code);
                console.error('错误信息:', audio.error?.message);
                
                let errorMsg = '音频文件加载失败';
                if (audio.error?.code === 4) {
                    errorMsg = '音频文件格式不支持';
                } else if (audio.error?.code === 2) {
                    errorMsg = '网络错误，请检查网络连接';
                } else if (audio.error?.code === 3) {
                    errorMsg = '音频文件解码失败';
                }
                alert(errorMsg);
            });

            // 添加超时处理
            const timeout = setTimeout(() => {
                console.error('音频加载超时');
                alert('音频文件加载超时，请检查网络连接或刷新页面');
            }, 10000); // 10秒超时

            audio.addEventListener('canplaythrough', () => {
                clearTimeout(timeout);
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
    console.log('=== 开始播放动物声音 ===');
    console.log('动物类型:', animalType);
    console.log('当前页面URL:', window.location.href);
    console.log('用户代理:', navigator.userAgent);
    
    // 检查浏览器是否支持音频
    if (!window.Audio) {
        console.error('浏览器不支持Audio API');
        alert('您的浏览器不支持音频播放');
        return;
    }
    
    soundController.playSound(animalType);
} 