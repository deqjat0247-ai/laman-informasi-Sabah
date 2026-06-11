
function createMusicButton() {
    
    if (document.getElementById('musicToggle')) {
        return;
    }
    
    
    const musicBtn = document.createElement('button');
    musicBtn.id = 'musicToggle';
    musicBtn.className = 'music-btn';
    musicBtn.innerHTML = '🎵 Hidupkan Muzik Latar';
    
    
    document.body.appendChild(musicBtn);
    
   
    if (!document.querySelector('style#music-btn-styles')) {
        const style = document.createElement('style');
        style.id = 'music-btn-styles';
        style.textContent = `
            .music-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 12px 18px;
                background-color: #2c3e50;
                color: white;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                z-index: 1000;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                font-family: Arial, sans-serif;
            }
            
            .music-btn:hover {
                background-color: #1a252f;
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(0,0,0,0.4);
            }
            
            .music-btn.playing {
                background-color: #27ae60;
            }
            
            .music-btn.playing:hover {
                background-color: #219653;
            }
        `;
        document.head.appendChild(style);
    }
    
    return musicBtn;
}


function initBackgroundMusic() {
   
    let bgMusic = document.getElementById('backgroundMusic');
    
    
    if (!bgMusic) {
        bgMusic = document.createElement('audio');
        bgMusic.id = 'backgroundMusic';
        bgMusic.loop = true;
        bgMusic.volume = 0.3;
        
        
        const source = document.createElement('source');
        source.src = 'audio/background-music.mp3';
        source.type = 'audio/mpeg';
        bgMusic.appendChild(source);
        
        
        bgMusic.style.display = 'none';
        document.body.appendChild(bgMusic);
    }
    
    
    const musicBtn = createMusicButton();
    
    if (!musicBtn) {
        console.error('Gagal mencipta butang audio');
        return;
    }
    
    
    let isMusicPlaying = localStorage.getItem('bgMusicPlaying') === 'true';
    
    
    function playMusic() {
        const playPromise = bgMusic.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Muzik berjaya dimainkan');
                    musicBtn.textContent = '⏸️ Matikan Muzik';
                    musicBtn.classList.add('playing');
                    localStorage.setItem('bgMusicPlaying', 'true');
                })
                .catch(error => {
                    console.error('Gagal memainkan muzik:', error);
                    
                   
                    document.addEventListener('click', function retryOnce() {
                        playMusic();
                        document.removeEventListener('click', retryOnce);
                    }, { once: true });
                });
        }
    }
    
    
    function pauseMusic() {
        bgMusic.pause();
        musicBtn.textContent = '🎵 Hidupkan Muzik';
        musicBtn.classList.remove('playing');
        localStorage.setItem('bgMusicPlaying', 'false');
    }
    
    
    function toggleMusic() {
        console.log('Toggle music - current state:', bgMusic.paused ? 'paused' : 'playing');
        
        if (bgMusic.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    }
    
    
    musicBtn.addEventListener('click', toggleMusic);
    
   
    if (isMusicPlaying) {
        console.log('Meneruskan muzik dari halaman sebelumnya...');
        
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                playMusic();
            }, 500);
        });
    }
    
    
    function handleFirstUserInteraction() {
        if (!localStorage.getItem('userInteracted')) {
            console.log('Interaksi pertama pengguna dikesan');
            localStorage.setItem('userInteracted', 'true');
            
            
            if (isMusicPlaying && bgMusic.paused) {
                playMusic();
            }
        }
    }
    
    
    document.addEventListener('click', handleFirstUserInteraction);
    document.addEventListener('keydown', handleFirstUserInteraction);
    document.addEventListener('touchstart', handleFirstUserInteraction);
    
    
    console.log('Audio system initialized:', {
        hasAudio: !!bgMusic,
        hasButton: !!musicBtn,
        shouldPlay: isMusicPlaying,
        currentState: bgMusic.paused ? 'paused' : 'playing'
    });
}


document.addEventListener('DOMContentLoaded', initBackgroundMusic);


window.addEventListener('load', initBackgroundMusic);


if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initBackgroundMusic();
}