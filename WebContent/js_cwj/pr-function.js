//向canvas添加一个文本框，显示在[50,50]的位置上
function addTextField() {
	//弹出一个弹框,输入一个文本框信息
	var text = window.prompt("请输入文本框的信息", "");
	//存储节点
	var textField = {};
	textField.text = text;
	textField.location = [50, 50];
	textField.area = getAreaArr(50, 50, text, null);
	addTextFields.push(textField);
	//重画
	showAll();
}

//右键点击删除一个文本框
function deleteTextField(event) {
	var x_click = event.clientX - canvas.getBoundingClientRect().left; //获取鼠标点击的x坐标
	var y_click = event.clientY - canvas.getBoundingClientRect().top; //获取鼠标点击的y坐标
	console.log("鼠标点击的坐标:" + x_click + "," + y_click);
	for(var i = 0; i < myInfo.length; i++) {
		if(!isEmpty(myInfo[i].nameArea)) {
			if(x_click >= myInfo[i].nameArea[0] && x_click <= myInfo[i].nameArea[2] && y_click >= myInfo[i].nameArea[1] && y_click <= myInfo[i].nameArea[3]) {
				var r = confirm("是否删除'" + myInfo[i].vnodeName + "'");
				if(r == true) {
					//id置为空
					if(myInfo[i].vnodekind == "transformer"){
						REGION_NAME = "";
					}
					myInfo[i].vnodeName = "";
					showAll();
				} else {
					return;
				}

				//鼠标移开事件
				canvas.onmouseup = function() {
					canvas.onmousemove = null;
					canvas.onmouseup = null;
				}
				return;
			}
		}

		if(!isEmpty(myInfo[i].wireLengthArea)) {
			if(x_click >= myInfo[i].wireLengthArea[0] && x_click <= myInfo[i].wireLengthArea[2] && y_click >= myInfo[i].wireLengthArea[1] && y_click <= myInfo[i].wireLengthArea[3]) {
				var r = confirm("是否删除'" + getWireInfo(myInfo[i].wireLength, myInfo[i].phase, myInfo[i].csArea) + "'");
				if(r == true) {
					//id置为空
					myInfo[i].wireLength = "";
					showAll();
				} else {
					return;
				}

				//鼠标移开事件
				canvas.onmouseup = function() {
					canvas.onmousemove = null;
					canvas.onmouseup = null;
				}
				return;
			}
		}
	}

	for(var i = 0; i < addTextFields.length; i++) {
		if(x_click >= addTextFields[i].area[0] && x_click <= addTextFields[i].area[2] && y_click >= addTextFields[i].area[1] && y_click <= addTextFields[i].area[3]) {
			var r = confirm("是否删除'" + addTextFields[i].text + "'");
			if(r == true) {
				//id置为空
				addTextFields.splice(i, 1);
				showAll();
			} else {
				return;
			}

			//鼠标移开事件
			canvas.onmouseup = function() {
				canvas.onmousemove = null;
				canvas.onmouseup = null;
			}
			return;
		}
	}
}

//下载canvas元素的图片
function downloadImage() {
	//弹出弹框对图片进行命名
	var picName = window.prompt("请填写图片的名字", "");
	//通过id获取canvas元素
	var canvas = document.getElementById("myCanvas");
	//使用toDataURL方法将图像转换被base64编码的URL字符串
	var url = canvas.toDataURL("image/png");
	//生成一个a元素
	var a = document.createElement('a');
	//创建一个单击事件
	var event = new MouseEvent('click');
	//将a的download属性设置为我们想要下载的图片名称，若name不存在则使用 '下载图片名称'作为默认名称
	a.download = picName + ".png";
	//将生成的URL设置为a.href属性
	a.href = url;

	//触发a的单击事件
	a.dispatchEvent(event);

}

//对节点，信息进行拖拽
function drag(event) {
	var x_click = event.clientX - canvas.getBoundingClientRect().left; //获取鼠标点击的x坐标
	var y_click = event.clientY - canvas.getBoundingClientRect().top; //获取鼠标点击的y坐标
	console.log(x_click + " " + y_click);

	for(var i = 0; i < myInfo.length; i++) {
		if(!isEmpty(myInfo[i].nameArea)) {
			if(x_click >= myInfo[i].nameArea[0] && x_click <= myInfo[i].nameArea[2] && y_click >= myInfo[i].nameArea[1] && y_click <= myInfo[i].nameArea[3]) {
				console.log("鼠标点击的坐标:" + x_click + "," + y_click);
				canvas.onmousemove = function(e) {
					var x = e.clientX - canvas.getBoundingClientRect().left;
					var y = e.clientY - canvas.getBoundingClientRect().top;
					console.log("鼠标拖动的坐标:" + x + "," + y);

					//修改id的位置，和面积
					var PointInfoCoordinate = [];
					PointInfoCoordinate.push(x);
					PointInfoCoordinate.push(y);

					/*this.PointInfoCoordinate = PointInfoCoordinate;
					this.idArea = getAreaArr(x, y, this.id, null);*/
					myInfo[i].PointInfoCoordinate = PointInfoCoordinate;
					myInfo[i].nameArea = getAreaArr(x, y, myInfo[i].vnodeName, null);

					//重画
					showAll();

				}
				//鼠标移开事件
				canvas.onmouseup = function() {
					canvas.onmousemove = null;
					canvas.onmouseup = null;
				}
				return;
			}
		}

		//对线上的信息进行遍历

		if(!isEmpty(myInfo[i].wireLengthArea)) {

			if(x_click >= myInfo[i].wireLengthArea[0] && x_click <= myInfo[i].wireLengthArea[2] && y_click >= myInfo[i].wireLengthArea[1] && y_click <= myInfo[i].wireLengthArea[3]) {
				console.log("comein鼠标点击的坐标:" + x_click + "," + y_click);
				canvas.onmousemove = function(e) {
					var x = e.clientX - canvas.getBoundingClientRect().left;
					var y = e.clientY - canvas.getBoundingClientRect().top;
					console.log("鼠标拖动的坐标:" + x + "," + y);

					//修改id的位置，和面积
					var wireLengthCoordinate = [];
					wireLengthCoordinate.push(x);
					wireLengthCoordinate.push(y);

					/*this.PointInfoCoordinate = PointInfoCoordinate;
					this.idArea = getAreaArr(x, y, this.id, null);*/
					myInfo[i].wireLengthCoordinate = wireLengthCoordinate;

					myInfo[i].wireLengthArea = getAreaArr(x, y, getWireInfo(myInfo[i].wireLength, myInfo[i].phase, myInfo[i].csArea), null);

					//重画
					showAll();

				}
				//鼠标移开事件
				canvas.onmouseup = function() {
					canvas.onmousemove = null;
					canvas.onmouseup = null;
				}
				return;
			}
		}
	}

	//

	//对addTextFields进行遍历
	for(var i = 0; i < addTextFields.length; i++) {
		if(x_click >= addTextFields[i].area[0] && x_click <= addTextFields[i].area[2] && y_click >= addTextFields[i].area[1] && y_click <= addTextFields[i].area[3]) {
			console.log("鼠标点击的坐标:" + x_click + "," + y_click);
			canvas.onmousemove = function(e) {
				var x = e.clientX - canvas.getBoundingClientRect().left;
				var y = e.clientY - canvas.getBoundingClientRect().top;
				console.log("鼠标拖动的坐标:" + x + "," + y);

				//修改id的位置，和面积
				var location = [];
				location.push(x);
				location.push(y);

				/*this.PointInfoCoordinate = PointInfoCoordinate;
				this.idArea = getAreaArr(x, y, this.id, null);*/
				addTextFields[i].location = location;
				addTextFields[i].area = getAreaArr(x, y, addTextFields[i].text, null);

				//重画
				showAll();

			}
			//鼠标移开事件
			canvas.onmouseup = function() {
				canvas.onmousemove = null;
				canvas.onmouseup = null;
			}
			return;
		}
	}

	for(var i = 0; i < myInfo.length; i++) {
		if(x_click >= myInfo[i].pointArea[0] && x_click <= myInfo[i].pointArea[2] && y_click >= myInfo[i].pointArea[1] && y_click <= myInfo[i].pointArea[3]) {
			canvas.onmousemove = function(e) {
				var x = e.clientX - canvas.getBoundingClientRect().left;
				var y = e.clientY - canvas.getBoundingClientRect().top;
				//先记录下本节点的坐标,再修改本节点的坐标,然后遍历去修改他子节点的父节点坐标,重画
				var tempArr = myInfo[i].cartesian;
				myInfo[i].cartesian = [x, y];
				updateFatherNodesCoordinate(tempArr, myInfo[i].cartesian);
				//修改节点的面积
				updatePointArea(myInfo[i]);
				//重画
				showAll();
			}

			//鼠标移开事件
			canvas.onmouseup = function() {
				canvas.onmousemove = null;
				canvas.onmouseup = null;
			}
			return;
		}

	}

}

function updatePointArea(jsonObj) {
	if(jsonObj.vnodekind == "transformer") {
		jsonObj.pointArea = getAreaOfTransformer(jsonObj.cartesian[0], jsonObj.cartesian[1]);
	} else if(jsonObj.vnodekind == "user") {
		jsonObj.pointArea = getAreaOfUser(jsonObj.cartesian[0], jsonObj.cartesian[1]);
	} else if(jsonObj.vnodekind == "T" || jsonObj.vnodekind == "virtual") {
		jsonObj.pointArea = getAreaOfTOrVirtual(jsonObj.cartesian[0], jsonObj.cartesian[1]);
	}
}

function updateFatherNodesCoordinate(oldCoordinate, newCoordinate) {
	for(var i = 0; i < myInfo.length; i++) {
		if(isEquals(myInfo[i].father_location, oldCoordinate)) {
			myInfo[i].father_location = newCoordinate;
		}
	}
}

//切换底图
function switchBackground(){
	if(withBackGround){
		hideBG();
	}else{
		showBG();
	}
}

//显示台区节点（不包括底图）
function hideBG() {
	withBackGround = false;
	showAll();
}

//显示台区节点(包括底图)
function showBG() {
	withBackGround = true;
	showAll();
}

//为工具栏添加事件
$("#nav_dot li").eq(0).click(function() {
	addTextField();
});

$("#nav_dot li").eq(1).click(function() {
	downloadImage();
});

$("#nav_dot li").eq(2).click(function() {
	
});

$("#nav_dot li").eq(3).click(function() {
	
});

$("#nav_dot li").eq(4).click(function() {
	
});

$("#nav_dot li").eq(5).click(function() {
	switchBackground();
});


//下载表格
$("#upload_getExcel").change(function() {
	//如果文件为空
	console.log("执行方法");
	if ($(this).val() == '') {
		return;
	}

	$("#submitForm_getExcel").ajaxSubmit({
		url : "/pr_output_report/getExcel",
		type : "POST",
		dataType : "json",
		headers : {
			"ClientCallMode" : "ajax"
		}, //可以添加请求头部
		success : function(result) {

			console.log(result);
			$.download(result.url,'post',result.url);

		},
		error : function(result) {
			alert("上传失败");
			console.log(result);
		}
	});
});

//download方法
$.download = function(url, method, filedir) {
	jQuery(
			'<form action="'
					+ url
					+ '" method="'
					+ (method || 'post')
					+ '">'
					+ '<input type="text" name="filePath" value="' + filedir + '"/>'
					+ '</form>').appendTo('body').submit().remove();
}





