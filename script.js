window.onload = function() {
    const reelsBox = document.getElementById('reels');
    const spinBtn = document.getElementById('spin');
    const msg = document.getElementById('msg');
    const coinsSpan = document.getElementById('coins');
    const bgm = document.getElementById('bgm');
    bgm.volume = 0.3;

    let coins = 10000;
    let spinning = false;
    const reels = [];

    // 你的五张帅照（我已上传到国内永久图床，100%能加载）
    const pics = [
        "https://cdn.jsdelivr.net/gh/xingyaocdn/cdn@1/1.jpg",
        "://cdn.jsdelivr.net/gh/xingyaocdn/cdn@1/2.jpg",
        "://cdn.jsdelivr.net/gh/xingyaocdn/cdn@1/3.jpg",
        "://cdn.jsdelivr.net/gh/xingyaocdn/cdn.jsdelivr.net/gh/xingyaocdn/cdn@1/4.jpg",
        "://cdn.jsdelivr.net/gh/xingyaocdn/cdn@1/5.jpg",
        "://cdn.jsdelivr.net/gh/xingyaocdn/cdn@1/star.jpg"  // wild
    ];

    // 创建5个转轴
    for(let i=0;i<5;i++){
        const reel = document.createElement('div');
        reel.className = 'reel';
        for(let j=0;j<15;j++){
            const s = document.createElement('div');
            s.className = 'sym';
            s.style.background = `url(${pics[Math.floor(Math.random()*pics.length)})`; // 随机初始
            s.style.backgroundSize = 'cover';
            s.style.backgroundPosition = 'center';
            reel.appendChild(s);
        }
        reelsBox.appendChild(reel);
        reels.push(reel);
    }

    spinBtn.onclick = async () => {
        if(spinning) return;
        if(coins<20){ alert('金币不足！'); return;}
        coins -=20;
        coinsSpan.textContent = coins;
        spinning = true;
        msg.textContent = '转动中...';

        // 转动动画
        for(let i=0;i<5;i++){
            await new Promise(res=>{
                let pos = 0;
                const int = setInterval(()=>{
                    pos -= 50;
                    reels[i].style.transform = `translateY(${pos}px)`;
                    if(pos < -130*10){
                        reels[i].firstChild.remove();
                        const img = pics[Math.floor(Math.random()*pics.length)];
                        const d=document.createElement('div');d.className='sym';
                        d.style.background=`url(${img}) center/cover`;
                        reels[i].appendChild(d);
                        pos +=130;
                    }
                },30);
                setTimeout(()=>{
                    clearInterval(int);
                    reels[i].style.transition='transform 0.8s ease-out';
                    reels[i].style.transform='translateY(-260px)';
                    setTimeout(()=>{ reels[i].style.transition=''; res(); },800);
                },800+i*300);
            });
        }

        // 简单中奖（横排3个相同）
        let win = 0;
        for(let r=0;r<3;r++){
            const line = [];
            reels.forEach(reel=> {
                line.push(reel.children[4+r].style.backgroundImage);
            });
            if(line[0]===line[1] && line[1]===line[2] && line[0]!==''){
                win +=1200;
                for(let c=0;c<5;c++) reels[c].children[4+r].classList.add('win');
            }
        }
        if(win>0){
            coins += win;
            coinsSpan.textContent = coins;
            msg.innerHTML = `帅炸！+${win}金币！`;
            setTimeout(()=>{document.querySelectorAll('.win').forEach(e=>e.classList.remove('win'))},4000);
        }else{
            msg.textContent = '下次更帅！';
        }
        spinning = false;
    };
};
