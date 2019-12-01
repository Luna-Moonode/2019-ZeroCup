const imgdir = {
    'dyht': {
        first: './img/final/dyht/1.png',
        second: './img/final/dyht/2.png',
        third: './img/final/dyht/3.png',
        firstbg: './img/final/dyht/bg1.png',
        secondbg: './img/final/dyht/bg2.png',
        thirdbg: './img/final/dyht/bg3.png',
    },
    'lxh': {
        first: './img/final/lxh/1.png',
        second: './img/final/lxh/2.png',
        third: './img/final/lxh/3.png',
        firstbg: './img/final/lxh/bg1.png',
        secondbg: './img/final/lxh/bg2.png',
        thirdbg: './img/final/lxh/bg3.png',
    },
    'bs': {
        first: './img/final/bs/1.png',
        second: './img/final/bs/2.png',
        third: './img/final/bs/3.png',
        firstbg: './img/final/bs/bg1.png',
        secondbg: './img/final/bs/bg2.png',
        thirdbg: './img/final/bs/bg3.png',
    },
    'dsgl': {
        first: './img/final/dsgl/1.png',
        second: './img/final/dsgl/2.png',
        third: './img/final/dsgl/3.png',
        firstbg: './img/final/dsgl/bg1.png',
        secondbg: './img/final/dsgl/bg2.png',
        thirdbg: './img/final/dsgl/bg3.png',
    },
    'nz': {
        first: './img/final/nz/1.png',
        second: './img/final/nz/2.png',
        third: './img/final/nz/3.png',
        firstbg: './img/final/nz/bg1.png',
        secondbg: './img/final/nz/bg2.png',
        thirdbg: './img/final/nz/bg3.png',
    }

};

let vm_final = new Vue({
    el: '#wrapper',
    data: {
        username: '',
        score: 0,
        rank: 0,
        bgimgsrc: '',
        bgimgsrc_copy: '',
        rightimgsrc_1: {
            'background-image': ''
        },
        rightimgsrc_2: {
            'background-image': ''
        },
        rightimgsrc_3: {
            'background-image': ''
        },
    }
});


vm_final.username = getCookie('username');
vm_final.score = getCookie('score');
vm_final.rank = getCookie('rank');

let current_game = getCookie('current_game'),
    b64imgArr = [];

// res: b64img
let xhr = new XHR();
xhr.get('api/share/', {
    game: current_game
}, () => {
    let res = JSON.parse(xhr.response);
    b64imgArr = res.bgsrc;
    vm_final.bgimgsrc = b64imgArr[0];
    vm_final.rightimgsrc_1['background-image'] = `url(${imgdir[current_game].first})`;
    vm_final.rightimgsrc_2['background-image'] = `url(${imgdir[current_game].second})`;
    vm_final.rightimgsrc_3['background-image'] = `url(${imgdir[current_game].third})`;
    if (vm_final.rank < 10) {
        rank.style.marginRight = '0.3rem';
    }
    if (vm_final.score == 100) {
        scorep.style.fontSize = '1rem';
    }
});


let rank = document.getElementsByClassName('score')[1],
    scorep = document.getElementsByClassName('score')[0],
    innerqrcode = document.getElementById('innerqrcode'),
    bottomp = document.getElementsByClassName('bottomp')[0],
    fatherdiv = document.querySelector('#wrapper .imgarea .right'),
    //
    rightimgdiv = document.querySelector('#wrapper .squarearea'),
    flyer = document.getElementById('flyer'),
    lefttext = document.querySelector('#wrapper .left'),
    righttext = document.querySelector('#wrapper .right'),
    bgimg = document.querySelector('#wrapper .bgimg'),
    imgarea = document.getElementsByClassName('imgarea')[0];
    

// 截图功能
let lock_download = 0;
$(".download").on("click", function () {
    if (lock_download) return;
    lock_download = 1;
    var shareContent = $(".imgarea")[0];
    var width = shareContent.offsetWidth;
    var height = shareContent.offsetHeight;
    var canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    scale = 1;
    var opts = {
        scale: scale,
        canvas: canvas,
        width: width,
        height: height,
        dpi: window.devicePixelRatio,
        allowTaint: true,
        useCORS: true,
    };
    fatherdiv.removeChild(innerqrcode);
    fatherdiv.removeChild(bottomp);
    html2canvas(shareContent, opts).then(function (canvas) {
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        var dataUrl = canvas.toDataURL('image/png', 1.0);
        var newImg = document.createElement("img");
        newImg.src = dataUrl;
        newImg.width = width;
        newImg.height = height;
        const alink = document.createElement("a");
        alink.href = newImg.src;
        alink.download = `${vm_final.username}.png`;
        alink.click();
        fatherdiv.appendChild(bottomp);
        fatherdiv.appendChild(innerqrcode);
        lock_download = 0;
    });
});

// 改变背景图
let lock_fly = 0;
rightimgdiv.addEventListener('click', (e) => {
    let id = parseInt(e.target.id);
    if (lock_fly || e.target === rightimgdiv || b64imgArr[id] === vm_final.bgimgsrc) return;
    lock_fly = 1;
    lock_download = 1;
    bgimg.classList.add('disappear');
    lefttext.classList.add('disappear');
    righttext.classList.add('disappear');
    vm_final.bgimgsrc_copy = b64imgArr[id];
    flyer.classList.add(`bgselect-${id}`);
    flyer.addEventListener('animationend', () => {
        bgimg.classList.remove('disappear');
        lefttext.classList.remove('disappear');
        righttext.classList.remove('disappear');
        bgimg.classList.add('emerge');
        lefttext.classList.add('emerge');
        righttext.classList.add('emerge');
        flyer.classList.remove(`bgselect-${id}`);
        vm_final.bgimgsrc = b64imgArr[id];
        lock_fly = 0;
        lock_download = 0;
    })
});

let lock_rightimgdiv = 0;
rightimgdiv.addEventListener('click', function (e) {
    if (e.target.id === '') return;
    if (lock_rightimgdiv) return;
    e.target.classList.add('click_magnify');
    lock1 = 1;
    setTimeout(() => {
        e.target.classList.remove('click_magnify');
        lock_rightimgdiv = 0;
    }, 250)
});

let restart = document.getElementById('restart'),
    timeline = document.getElementById('timeline');

timeline.onclick = () => {
    setCookie('mode', 'time');
    window.location.href = 'index.html';
};
restart.onclick = () => {
    setCookie('mode', 'game');
    window.location.href = 'index.html';
};

if (current_game === 'bs') {
    imgarea.style.color = '#030303';
}