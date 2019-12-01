// TODO：此接口未入文档！
$(document).ready(function () {
	//动态更新输入框和下划线长度
	let $input = $("#wrapper .input"),
	 	$underline = $("#wrapper .underline"),
		refreshLength;

	let regZhongWen = new RegExp("[\u4E00-\u9FA5]+"),
		regNumAndLetter = new RegExp("^[0-9a-zA-Z]+$"),
		regPie = new RegExp("[']"); //匹配一撇那个符号   '
	let nameEffective = 0;
	$input.focus(function () {
		let nameNum;
		let nameVal;
		let wordCount = 0;
		nameEffective = 0;
		let effectiveFlag = 1;
		let pieFlag = 0; //判断是否出现一撇   '
		//创建一个定时器,用于实时更新长度和状态
		refreshLength = setInterval(function () {
			nameNum = $input.val().length;
			nameVal = $input.val();
			effectiveFlag = 1; //每次判断name前将effectiveFlag置一
			nameEffective = 0; //每次判断name前将nameEffective置零
			wordCount = 0; //每次统计应增加的长度前将wordCount置零
			pieFlag = 0;
			//判断每个字符,并统计应增加的长度
			for (let i = 0; i < nameNum; i++) {
				if (regZhongWen.test(nameVal[i])) {
					wordCount += 2;
				} else if (regNumAndLetter.test(nameVal[i])) {
					wordCount++;
				} else if (regPie.test(nameVal[i])) {
					pieFlag = 1;
				} else {
					effectiveFlag = 0;
				}
			}

			//动态更新输入框与下划线的长度
			if (wordCount <= 7) {
				$input.css({
					"width": 2.15 + "rem",
					"left": 1.83 + "rem"
				});
				$underline.css({
					"width": 2.62 + "rem",
					"left": 1.60 + "rem"
				});
			} else if (wordCount > 7 && wordCount <= 30) {
				let inputLength = 2.15 + 0.288 * (wordCount - 5);
				let underlineLength = inputLength + 0.47;
				$input.css({
					"width": inputLength + "rem",
					"left": 1.83 - 0.144 * (wordCount - 7) + "rem"
				});
				$underline.css({
					"width": underlineLength + "rem",
					"left": 1.60 - 0.144 * (wordCount - 7) + "rem"
				});
			}
			//当字符数大于1,且没有错误时姓名有效
			if (effectiveFlag == 1 && nameNum > 0) {
				nameEffective = 1;
			}
			if (nameEffective != 1 && nameNum != 0) {
				$input.css("color", "red");
			} else {
				$input.css("color", "rgba(237,223,229,1)");
			}
		}, 200);
	});
	$input.blur(function () {
		clearInterval(refreshLength);
		refreshLength = null;
	});

	let score = getCookie('score');

	//get
	let $button = $("#wrapper .button");
	$button.click(function () {
		if (nameEffective != 1) {
			$("#wrapper .prompt").css("opacity", 1);
		} else if (nameEffective == 1) {
			$("#wrapper .prompt").css("opacity", 0);
			let name = $input.val(),
				postStr = `{"username": "${name}", "score": ${score}}`,
				postJSON = $.parseJSON(postStr);
			setCookie('username', name);
			$.post("http://127.0.0.1:8000/api/rank/", postJSON, function (data, textStatus, jqXHR) {
				window.location.href = 'share.html';
				setCookie('rank', data.rank)
			});
		}
	});
});