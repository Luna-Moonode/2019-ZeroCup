let vm_rank = new Vue({
    el: '#wrapper',
    data: {
        rankArr: [],
    },
});

let dataCount = 0; // 数据的条数
let getRankData = () => {
        let xhr = new XHR();
        xhr.get('api/rank/', {
            // 'username': username
        }, () => {
            let res = JSON.parse(xhr.response);
            vm_rank.rankArr = res;
            dataCount = res.length;
        }, () => {
            //    TODO：调用失败后的提示
        })
};
getRankData();

let line = document.getElementById('line');
let textArea = document.getElementById('textArea');


textArea.onscroll = () => {
    line.style.marginTop = 6.4 / (dataCount - 6) * textArea.scrollTop / 100 + 'rem';
//    TODO:这条语句有bug, 在改变视窗宽高之后, 并不能实现滚动条从上到下完全拉到底, 而是有一定的空隙,如何设计更好的计算方式呢？
//
};
function move(e) {
    end = e.y;
    line.style.marginTop = (end - start) / 100 + 'rem';
    textArea.scrollTop = line.style.marginTop * (dataCount - 6) / 6.4 * 100;
}
line.onmousedown = (e) => {
    start = e.y;
    line.addEventListener('mousemove', move);
    line.onmouseup = () => {
        line.removeEventListener('mousemove', move)
    };
    line.onmouseleave = () => {
        line.removeEventListener('mousemove', move)
    };
};
// TODO:我虽然设置了滚动条hover的动画, 但是并没有给他加上拖拽移动的功能，需要你来实现喽
