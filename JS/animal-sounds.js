// 音频控制器
class SoundController {
    constructor() {
        this.currentSound = null;
        this.currentAnimalType = null;
        this.isPlaying = false;
    }

    async playSound(soundName) {
        console.log('开始播放声音:', soundName);
        
        // 如果点击的是同一个动物，且正在播放，则暂停
        if (this.currentAnimalType === soundName && this.isPlaying && this.currentSound) {
            console.log('暂停当前播放的声音');
            this.currentSound.pause();
            this.isPlaying = false;
            this.updateButtonState(false);
            return;
        }
        
        // 如果点击的是同一个动物，且已暂停，则从头重新播放
        if (this.currentAnimalType === soundName && !this.isPlaying && this.currentSound) {
            console.log('从头重新播放声音');
            this.currentSound.currentTime = 0; // 重置到开头
            try {
                await this.currentSound.play();
                this.isPlaying = true;
                this.updateButtonState(true);
                return;
            } catch (error) {
                console.error('重新播放失败:', error);
            }
        }
        
        // 如果点击的是不同动物，或没有当前音频，则加载新音频
        if (this.currentSound) {
            this.currentSound.pause();
            this.currentSound.currentTime = 0;
        }

        // 使用相对路径
        const audioPath = `./static/audio/animals/${soundName}.mp3`;
        console.log('音频文件路径:', audioPath);
        
        const audio = new Audio(audioPath);
        this.currentSound = audio;
        this.currentAnimalType = soundName;

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
                    this.isPlaying = true;
                    this.updateButtonState(true);

                    // 监听播放结束
                    audio.onended = () => {
                        console.log('音频播放结束');
                        this.isPlaying = false;
                        this.updateButtonState(false);
                        this.currentSound = null;
                        this.currentAnimalType = null;
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

    // 更新按钮状态
    updateButtonState(isPlaying) {
        const btn = document.querySelector('.animal-sound-btn');
        if (btn) {
            if (isPlaying) {
                btn.classList.add('playing');
                btn.innerHTML = '<span class="sound-icon">⏸️</span>暂停播放';
                console.log('按钮样式已更新为播放状态');
            } else {
                btn.classList.remove('playing');
                btn.innerHTML = '<span class="sound-icon">🔊</span>聆听声音';
                console.log('按钮样式已更新为暂停状态');
            }
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