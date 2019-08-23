//向页面添加一个div元素，展示表格的信息
function addDivForTable(id) {
	div = getDivForTable(id);
	
	div.setAttribute("id", id);
	div.setAttribute("style", "height: 100%;");
	return div;
}

function getDivForTable(id){
	if(div == null || div == undefined){
		var main = document.getElementById("mainContent");
		div = document.createElement("div");
		main.appendChild(div);
		return div;
	}else{
		return div;
	}
}

//向页面添加一个canvas元素，展示台区的节点信息
function addCanvas(id) {
	canvas = getCanvas(id);
	
	canvas.setAttribute("id", id);
	canvas.setAttribute("width", img.width);
	canvas.setAttribute("height", img.height);
	
	return canvas;
}

function getCanvas(id){
	if(canvas == null || canvas == undefined){
		var main = document.getElementById("mainContent");
		canvas = document.createElement("canvas");
		main.appendChild(canvas);
		return canvas;
	}else{
		return canvas;
	}
}

var withBackGround = true; //重画时是否带底图


//开始显示
function showAll() {
	if(withBackGround) {
		drawWithBackGroud();
	} else {
		drawWithOutBackGroud();
	}
}

//画出台区节点图(带底图)
function drawWithBackGroud() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, 0, 0);
	draw(myInfo);
}

//画出台区节点图(不带底图)
function drawWithOutBackGroud() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	draw(myInfo);
}

//画出节点
function draw(jsonArr) {
	drawLines(jsonArr);
	drawLineInfos(jsonArr);
	drawNodeInfos(jsonArr);
	drawNodes(jsonArr);
	drawAddTextFields(addTextFields);

}

function drawNodes(jsonArr) {
	$(jsonArr).each(function() {
		switch(this.vnodekind) {
			case "T":
				drawTNode(this.cartesian[0], this.cartesian[1]);
				break;
			case "transformer":
				drawTranformerNode(this.cartesian[0], this.cartesian[1]);
				break;
			case "user":
				drawUserNode(this.cartesian[0], this.cartesian[1]);
				break;
			case "virtual":
				drawTNode(this.cartesian[0], this.cartesian[1]);
				break;
		}
	});
}

function drawLines(jsonArr) {
	$(jsonArr).each(function() {
		switch(this.vnodekind) {
			case "T":
				if(this.father_location != "") {
					drawLine(this.cartesian[0], this.cartesian[1], this.father_location[0], this.father_location[1]);
				}
				break;
			case "transformer":
				break;
			case "user":
				if(this.father_location != "") {
					drawLine(this.cartesian[0], this.cartesian[1], this.father_location[0], this.father_location[1]);

				}
				break;
			case "virtual":
				if(this.father_location != "") {
					drawLine(this.cartesian[0], this.cartesian[1], this.father_location[0], this.father_location[1]);
				}
				break;
		}
	});
}

function drawLineInfos(jsonArr) {
	$(jsonArr).each(function() {
		switch(this.vnodekind) {
			case "T":
				if(!isEmpty(this.wireLength)) {
					drawLineInfo(this.wireLengthCoordinate[0], this.wireLengthCoordinate[1], getWireInfo(this.wireLength, this.phase, this.csArea));
				}
				break;
			case "transformer":
				break;
			case "user":
				//画出线的信息
				/*if(!isEmpty(this.wireLength)) {
					drawLineInfo(this.wireLengthCoordinate[0], this.wireLengthCoordinate[1], getWireInfo(this.wireLength, this.phase, this.csArea));
				}*/
				break;
			case "virtual":
				//画出线的信息
				if(!isEmpty(this.wireLength)) {
					drawLineInfo(this.wireLengthCoordinate[0], this.wireLengthCoordinate[1], getWireInfo(this.wireLength, this.phase, this.csArea));
				}
				break;
		}
	});
}

//根据线长，象形，横截面积获得线上的信息
function getWireInfo(wireLength, phase, csArea) {
	if(isNotEmpty(phase) && isNotEmpty(csArea)) {
		var phaseNum;
		if(phase.length == 1) {
			phaseNum = 2;
		} else if(phase.length == 2) {
			phaseNum = 3;
		} else {
			phaseNum = 4;
		}
		return "BVV-" + phaseNum + "*" + csArea + "mm2/" + gerundet(wireLength) + "m";
	} else {
		return gerundet(wireLength) + "m";
	}
}

//对线的长度四舍五入
function gerundet(wireLength) {
	var str = String(wireLength);
	var index = str.indexOf(".");
	if(index == -1) {
		return str;
	} else {
		if(str.substring(index, str.length).length <= 2) {
			return str;
		} else {
			return str.substring(0, 3);
		}
	}
}

function drawNodeInfos(jsonArr) {
	$(jsonArr).each(function() {
		switch(this.vnodekind) {
			case "T":
				if(!isEmpty(this.vnodeName)) {
					drawPointInfo(this.PointInfoCoordinate[0], this.PointInfoCoordinate[1], this.vnodeName);
				}

				break;
			case "transformer":
				if(!isEmpty(REGION_NAME)) {
					drawPointInfo(this.PointInfoCoordinate[0], this.PointInfoCoordinate[1], REGION_NAME);
				}
				break;
			case "user":
				//画出节点标注
				if(!isEmpty(this.vnodeName)) {
					drawPointInfo(this.PointInfoCoordinate[0], this.PointInfoCoordinate[1], this.vnodeName);
				}
				break;
			case "virtual":
				//画出节点标注
				if(!isEmpty(this.vnodeName)) {
					drawPointInfo(this.PointInfoCoordinate[0], this.PointInfoCoordinate[1], this.vnodeName);
				}
				break;
		}
	});
}

function drawAddTextFields(addTextFields) {
	//开始画addTextFields的数组
	for(var i = 0; i < addTextFields.length; i++) {
		console.log(addTextFields[i]);
		console.log(addTextFields[i].location);

		drawPointInfo(addTextFields[i].location[0], addTextFields[i].location[1], addTextFields[i].text);
	}
}

//画出变压器
function drawTranformerNode(x, y) {
	//需要调整位置。
	ctx.fillStyle = "red";
	ctx.fillRect(x - 30 / 2, y - 15.0 / 2, 30, 15);
}

//画出T节点
function drawTNode(x, y) {
	ctx.fillStyle = "green";
	ctx.fillRect(x - 15.0 / 2, y - 15.0 / 2, 15, 15);
}

//画出用户节点
function drawUserNode(x, y) {

	ctx.beginPath();
	ctx.fillStyle = userNode_color;
	ctx.lineWidth = userNode_size;
	ctx.arc(x, y, 7.5, 0, 2 * Math.PI);
	ctx.stroke();
}

//画出线
function drawLine(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.fillStyle = wire_color;
	ctx.lineWidth = wire_size;
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();

}

//画出节点上的信息(在每个节点的上方)
function drawPointInfo(x, y, info) {
	ctx.font = "12px Times New Roman";
	//fillText(text,x,y,[,maxWidth])该方法用于在指定的位置绘制文本，如果设置了maxWidth,则会调整字符串使之符合这个条件
	ctx.fillText(info, x, y);
}

//画出线上的信息(在两条线段的中间向右偏移两个像素)
function drawLineInfo(x, y, info) {
	ctx.font = "12px Times New Roman";
	ctx.fillText(info, x, y);
}

//展示表格
function showTable(jsonArr){
	var table = document.createElement("table");
	
	
	var tr = document.createElement("tr");
	var th1 = document.createElement("th");
	th1.innerText = "编号";
	var th2 = document.createElement("th");
	th2.innerText = "用户名";
	var th3 = document.createElement("th");
	th3.innerText = "用户编号";
	var th4 = document.createElement("th");
	th4.innerText = "标号";
	var th5 = document.createElement("th");
	th5.innerText = "资产编号";
	
	tr.appendChild(th1);
	tr.appendChild(th2);
	tr.appendChild(th3);
	tr.appendChild(th4);
	tr.appendChild(th5);
	
	table.appendChild(tr);
	var index = 1;
	$(jsonArr).each(function() {
		switch(this.vnodekind) {
			case "user":
				tr = document.createElement("tr");
				th1 = document.createElement("th");
				th1.innerText = index++;
				th2 = document.createElement("th");
				th2.innerText = this.userName;
				th3 = document.createElement("th");
				th3.innerText = this.id;
				th4 = document.createElement("th");
				th4.innerText = this.vnodeName;
				th5 = document.createElement("th");
				th5.innerText = this.assetNumber;
				
				tr.appendChild(th1);
				tr.appendChild(th2);
				tr.appendChild(th3);
				tr.appendChild(th4);
				tr.appendChild(th5);
				
				table.appendChild(tr);	
				break;
		}
	});
	div.appendChild(table);
}