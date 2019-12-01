let vm_header = new Vue({
    el: '#header',
    data: {
        nav0: true,
        nav1: false,
        nav2: false,
        mode: 0,
    },
    methods: {
        mouseenterli(e) {
            this.nav0 = false;
            this.nav1 = false;
            this.nav2 = false;
            this['nav' + e.target.id.match(/\d+/)[0]] = true;
        },
        mouseleaveli(e) {
            switch (this.mode) {
                case 0:
                    this.nav0 = true;
                    this.nav1 = false;
                    this.nav2 = false;
                    break;
                case 1:
                    this.nav0 = false;
                    this.nav1 = true;
                    this.nav2 = false;
                    break;
                case 2:
                    this.nav0 = false;
                    this.nav1 = false;
                    this.nav2 = true;
                    break;
            }
        }
    }
});

let header = document.getElementById('header'),  // header
    bgm_dyht = document.getElementById('bgm-dyht'),  // audio
    arrow = document.getElementById('arrow'),  // arrow
    line = document.querySelector('#axis .line'),  // timeline-body
    circles = document.getElementsByClassName('circle'),  // timeline-circle
    list = document.getElementById('list'),
    play = 1,  // audio trigger
    // count_guomanList = 0,
    lock_header = 0,
    lock_guomanList = 0,
    vh = document.documentElement.clientHeight;  // viewport height


function changeHeaderMode(to) {
    switch (to) {
        case 0:
            vm_header.nav0 = true;
            vm_header.nav1 = false;
            vm_header.nav2 = false;
            vm_header.mode = 0;
            break;
        case 1:
            vm_header.nav0 = false;
            vm_header.nav1 = true;
            vm_header.nav2 = false;
            vm_header.mode = 1;
            break;
        case 2:
            vm_header.nav0 = false;
            vm_header.nav1 = false;
            vm_header.nav2 = true;
            vm_header.mode = 2;
            break;
    }
}

function stopPlayingBgm(bgm) {
    play = 1;
    bgm.pause()
}

function arrowAppear() {
    arrow.style.display = 'block';
}

function arrowDisappear() {
    arrow.style.display = 'none';
}

function navClickHandler(e) {
    if (e.target.id !== 'list' && e.target.id !== 'header' && e.target.id !== '') {
        e.target.classList.add('click_magnify');
        setTimeout(() => {
            e.target.classList.remove('click_magnify');
        }, 250);
    }
    if (lock_header) return;
    switch (e.target.id) {
        case 'header-li-0':
            list.classList.remove('disappear');
            list.classList.add('emerge');
            arrowAppear();
            if (vm_header.mode === 2) removeGame();
            lock_guomanList = 0;
            changeHeaderMode(0);
            scrollToTop();
            break;
        case 'header-li-1':
            arrowAppear();
            if (vm_header.mode === 2) removeGame();
            lock_guomanList = 1;
            timeClickHandler();
            break;
        case 'header-li-2':
            list.classList.remove('emerge');
            list.classList.add('disappear');
            e.target.classList.add('click_magnify');
            setTimeout(() => {
                e.target.classList.remove('click_magnify');
            }, 250);
            if (vm_header.mode === 2) return;
            gameClickHandler();
            break;
    }
}

function timeClickHandler() {
    if (play) {
        setTimeout(() => {
            bgm_dyht.play();
        }, 100);
        play = 0;
    }
    changeHeaderMode(1);
    let count = 0;
    let scrollY = window.scrollY;
    let scrollInterval = setInterval(() => {
        if (count >= 100) {
            clearInterval(scrollInterval)
        }
        count += 1;
        window.scrollTo(0, scrollY + (vh - scrollY) * count / 100)
    }, 1)
}

function gameClickHandler() {
    lock_header = 1;
    lock_guomanList = 1;
    arrowDisappear();
    changeHeaderMode(2);
    triggerGame();
}

function bottomStartGameHandler() {
    lock_header = 1;
    lock_guomanList = 1;
    arrowDisappear();
    gameClickHandler();
}

let lock_windowScroll = 0;
window.onscroll = () => {
    if (lock_windowScroll) return;
    let scr = window.scrollY;
    switch (true) {
        case (0 <= scr && scr < 0.05):
            stopPlayingBgm(bgm_dyht);
            if (vm_header.mode !== 2) changeHeaderMode(0);
            document.body.classList.add('overflow_hidden');
            break;
        case (scr < vh * 0.1):
            document.body.classList.remove('overflow_hidden');
            stopPlayingBgm(bgm_dyht);
            break;
        case (vh * 0.2 < scr && scr < vh * 0.6):
            document.body.className = '';
            break;
        case (vh * 0.8 < scr && scr < vh * 1.6):
            document.body.className = 'bg-lxh';
            break;
        case (vh * 1.8 < scr && scr < vh * 2.6):
            document.body.className = 'bg-nz';
            break;
        case (vh * 2.8 < scr && scr < vh * 3.6):
            document.body.className = 'bg-bs';
            break;
        case (vh * 3.8 < scr && scr < vh * 4.6):
            document.body.className = 'bg-dyht';
            break;
        case (vh * 4.8 < scr && scr < vh * 5.9):
            document.body.className = 'bg-dsgl';
            break;
        case (vh * 6 < scr):
            document.body.className = 'bg-bottom';
            break;
    }
};

function scrollToTop() {
    lock_windowScroll = 1;
    let count = 0,
        scrollY = window.scrollY,
        scrollInterval = setInterval(() => {
            if (count >= 100) {
                clearInterval(scrollInterval);
                lock_windowScroll = 0;
                if (vm_header.mode === 0) {
                    document.body.className = 'overflow_hidden';
                } else if (vm_header.mode === 2) {
                    document.body.className = 'bg-game';
                    document.body.classList.add('overflow_hidden');
                }
            }
            count += 1;
            window.scrollTo(0, scrollY  - scrollY * count / 100)
        }, 1)
}

function scrollToLxh() {
    let count = 0,
        scrollY = window.scrollY,
        scrollInterval = setInterval(() => {
        if (count >= 100) {
            clearInterval(scrollInterval)
        }
        count += 1;
        window.scrollTo(0, scrollY + (vh - scrollY) * count / 100)
    }, 1);
}

function scrollToNz() {
    let count = 0,
        scrollY = window.scrollY,
        scrollInterval = setInterval(() => {
            if (count >= 100) {
                clearInterval(scrollInterval)
            }
            count += 1;
            window.scrollTo(0, scrollY + (vh * 2.4 - scrollY) * count / 100)
        }, 1);
}

function scrollToBs() {
    let count = 0,
        scrollY = window.scrollY,
        scrollInterval = setInterval(() => {
            if (count >= 100) {
                clearInterval(scrollInterval)
            }
            count += 1;
            window.scrollTo(0, scrollY + (vh * 3.5 - scrollY) * count / 100)
        }, 1);
}

function scrollToDyht() {
    let count = 0,
        scrollY = window.scrollY,
        scrollInterval = setInterval(() => {
            if (count >= 100) {
                clearInterval(scrollInterval)
            }
            count += 1;
            window.scrollTo(0, scrollY + (vh * 4.5 - scrollY) * count / 100)
        }, 1);
}

function scrollToDsgl() {
    let count = 0,
        scrollY = window.scrollY,
        scrollInterval = setInterval(() => {
            if (count >= 100) {
                clearInterval(scrollInterval)
            }
            count += 1;
            window.scrollTo(0, scrollY + (vh * 5.27 - scrollY) * count / 100)
        }, 1);
}

window.onload = () => {
    let mode = getCookie('mode');
    switch (mode) {
        case '':
            break;
        case 'time':
            timeClickHandler();
            delCookie('mode');
            break;
        case 'game':
            gameClickHandler();
            delCookie('mode');
            break;
    }
};

header.onclick = navClickHandler;
arrow.onclick = timeClickHandler;
line.onclick = scrollToLxh;
for (let i = 0; i < circles.length; i++) {
    circles[i].onclick = scrollToLxh;
}
