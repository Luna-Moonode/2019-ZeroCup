$(document).ready(function () {
	let $wrapper = $(".guoman-wrapper"),
		$guomanList = $("#list"),
		$body = $("body"),
		$recommendCard = $(".guoman-wrapper .recommend-list li"),
		$recommendCardImg = $(".guoman-wrapper .recommend-list li img"),
		$describe = $(".guoman-wrapper .describe"),
		$recommendList = $(".recommend-list");
	//设置recommendList的宽度
	$recommendList.width( 3.09*($recommendCard.length) + "rem" );
	// $recommendCardImg
	//国漫列表 点击事件
	let count = 0;
	$guomanList.click(function(){
		if (lock_guomanList) return;
		if (count % 2 === 0) {
			arrowDisappear();
			lock_header = 1;
		} else {
			arrowAppear();
			lock_header = 0;
		}
		count ++;
		$wrapper.toggleClass("on");
		$body.toggleClass("bg-blur");
	});
	//为"推荐"模块添加hover
	for(let i=0; i<$recommendCard.length; i++){
		$recommendCard.eq(i).hover(function(){
			$recommendCardImg.eq(i).toggleClass("blurify");
			$describe.eq(i).css("opacity",1);
		},function(){
			$recommendCardImg.eq(i).toggleClass("blurify");
			$describe.eq(i).css("opacity",0);
		});
	}
	
	//为"全部"模块添加hover
	let $allCard = $(".guoman-wrapper .all-list li");
	let $allCardImg = $(".guoman-wrapper .all-list li img");
	for(let i=0; i<$allCard.length; i++){
		$allCard.eq(i).hover(function(){
			$allCardImg.eq(i).toggleClass("blurify");
			$describe.eq(i+$recommendCard.length).css("opacity",1);
		},function(){
			$allCardImg.eq(i).toggleClass("blurify");
			$describe.eq(i+$recommendCard.length).css("opacity",0);
		});
	}
	
	let $allList = $(".all-list");
	let windowWidth = $(window).width(); //浏览器当前窗口可视区域宽度
	$allList.width( 3.09*($allCard.length) + "rem" );
	
	let allListInterval;
	let allListLeftRefresh;
	let positionX;
	$(".all-list").mousemove(function(e){
		e = e || window.event;
		positionX=e.clientX; //获取当前鼠标的X坐标
	});
	$('.all-list').hover(function(e) {
		e = e || window.event;
		let allListLeft;
		allListInterval =  setInterval(function(){
					 allListLeft = $(".all-list").offset().left;
					 if( (positionX/windowWidth) > 0.9){
						 allListLeft = allListLeft - 1;
					 }
					 else if( (positionX/windowWidth) < 0.1){
						 allListLeft = allListLeft + 1;
					 }
					 $(".all-list").css("left", allListLeft + "px");
		}, 10);
	 },function(){
		 clearInterval(allListInterval);
		 allListInterval = null;
	 });
});
