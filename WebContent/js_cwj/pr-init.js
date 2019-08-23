//存储文字框
var addTextFields = [];

//改变节点，连线的粗细，颜色
var userNode_color = "blue";
var wire_color = "blue";
var wire_size = 3;
var userNode_size = 2;
var myInfo; //存储台区节点信息
var canvas;

var ctx;

var div;

var X_AMOUNT; //x轴的平移量
var Y_AMOUNT; //y轴的平移量
var REGION_NAME; //台区名字

var imgIsLoad = false;

//去掉默认的contextMenu事件，否则会和右键事件同时出现
document.oncontextmenu = function(e) {
	e.preventDefault();
}

//根据图片的大小创建指定大小的canvas
var img = new Image();


$("#upload_getImagePath").change(function() {
	//如果文件为空
	console.log("执行方法");
	if ($(this).val() == '') {
		return;
	}

	$("#submitForm_getImagePath").ajaxSubmit({
		url : "/pr_output_report/getImagePath",
		type : "POST",
		dataType : "json",
		headers : {
			"ClientCallMode" : "ajax"
		}, //可以添加请求头部
		success : function(result) {
			//result.url为底图的地址
			console.log(result);
			img.src = result.url;
			
			img.onload = function(){
				canvas = addCanvas("myCanvas");
				ctx = canvas.getContext("2d");
				
				div = addDivForTable("myDiv");
				$(".main div").css("display", "none");
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0);
				
				imgIsLoad = true;
			}

		},
		error : function(result) {
			alert("上传失败");
			console.log(result);
		}
	});
});


$("#upload_getJSON").change(function() {
	//如果文件为空
	if ($(this).val() == '') {
		return;
	}
	//如果还没有上传底图,则返回
	if(!imgIsLoad){
		alert("请先上传底图");
		return;
	}

	$("#submitForm_getJSON").ajaxSubmit({
		url : "/pr_output_report/getJSON",
		type : "POST",
		dataType : "json",
		headers : {
			"ClientCallMode" : "ajax"
		}, //可以添加请求头部
		success : function(result) {
			
			X_AMOUNT = result.baseInfo.transformX;
			Y_AMOUNT = result.baseInfo.transformY;
			REGION_NAME = result.baseInfo.name;

			myInfo = result.jsonArray;
			myInfo[0].vnodeName = REGION_NAME;

			//生成表格
			showTable(myInfo);
			
			//对整个台区图进行平移
			move(myInfo);

			//生成节点坐标信息 、线信息坐标
			putAllPointInfoAndWireLengthInfoCoordinate(myInfo);

			//做节点信息面积的存储
			saveArea(myInfo);

			//做节点面积的存储
			saveAreaOfPoint(myInfo);

			showAll();

			canvas.onmousedown = function(event) {
				console.log("点击了canvas");
				if(event.button == 0) {
					drag(event);
				} else if(event.button == 2) {
					deleteTextField(event);
				}

			}

			//设置双击事件
			canvas.ondblclick = function(event) {
				var x_dbclick = event.clientX - canvas.getBoundingClientRect().left; //获取鼠标点击的x坐标
				var y_dbclick = event.clientY - canvas.getBoundingClientRect().top; //获取鼠标点击的y坐标

				//循环查看是否点击在可改变的区域上
				//弹出弹框，将信息写在弹框上
				//确定后改写信息，重画
				for(var i = 0; i < myInfo.length; i++) {
					if(!isEmpty(myInfo[i].nameArea)) {
						if(x_dbclick >= myInfo[i].nameArea[0] && x_dbclick <= myInfo[i].nameArea[2] && y_dbclick >= myInfo[i].nameArea[1] && y_dbclick <= myInfo[i].nameArea[3]) {
							var info = window.prompt("请输入改变的值", myInfo[i].vnodeName);
							myInfo[i].vnodeName = info;
							if(myInfo[i].vnodekind == "transformer"){
								REGION_NAME = info;
							}
							showAll();
							return;
						}
					}

				}
				for(var i = 0; i < addTextFields.length; i++) {
					if(!isEmpty(addTextFields[i].text)) {
						if(x_dbclick >= addTextFields[i].area[0] && x_dbclick <= addTextFields[i].area[2] && y_dbclick >= addTextFields[i].area[1] && y_dbclick <= addTextFields[i].area[3]) {
							var info = window.prompt("请输入改变的值", addTextFields[i].text);
							addTextFields[i].text = info;
							showAll();
							return;
						}
					}
				}
			}
			

		},
		error : function(result) {
			alert("上传失败");
			console.log(result);
		}
	});
});

//


