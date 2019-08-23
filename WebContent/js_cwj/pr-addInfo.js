//将所有节点进行平移
function move(jsonArr) {
	$(jsonArr).each(function() {
		this.cartesian[0] = parseFloat(this.cartesian[0] + X_AMOUNT);
		this.cartesian[1] = parseFloat(this.cartesian[1] + Y_AMOUNT);
		if(this.father_location != "") {
			this.father_location[0] = parseFloat(this.father_location[0] + X_AMOUNT);
			this.father_location[1] = parseFloat(this.father_location[1] + Y_AMOUNT);
		}
	});
}

//存储节点的面积
function saveAreaOfPoint(jsonArr) {
	$(jsonArr).each(function() {
		if(this.vnodekind == "transformer") {
			this.pointArea = getAreaOfTransformer(this.cartesian[0], this.cartesian[1]);
		} else if(this.vnodekind == "T" || this.vnodekind == "virtual") {
			this.pointArea = getAreaOfTOrVirtual(this.cartesian[0], this.cartesian[1]);

		} else if(this.vnodekind == "user") {
			this.pointArea = getAreaOfUser(this.cartesian[0], this.cartesian[1]);
		}

	});
}

//获取一个变压器节点的面积
function getAreaOfTransformer(x, y) {
	var pointArea = [x - 15, y - 7.5, x + 15, y + 7.5];
	return pointArea;
}
//获取一个T节点获取virtual节点的面积
function getAreaOfTOrVirtual(x, y) {
	var pointArea = [x - 7.5, y - 7.5, x + 7.5, y + 7.5];
	return pointArea;
}
//获取一个user节点的面积
function getAreaOfUser(x, y) {
	var pointArea = [x - 7.5, y - 7.5, x + 7.5, y + 7.5];
	return pointArea;
}

//生成节点的面积，节点信息的面积，线长信息的面积 [x_old,y_old,x_new,y_new]
function saveArea(jsonArr) {
	$(jsonArr).each(function() {
		if(this.vnodekind == "transformer") {
			if(!isEmpty(REGION_NAME)) {
				var nameArea = getAreaArr(this.cartesian[0], this.cartesian[1], REGION_NAME, null);
				this.nameArea = nameArea;
			}
		} else if(this.vnodekind == "user" || this.vnodekind == "T" || this.vnodekind == "virtual") {
			if(!isEmpty(this.vnodeName)) {
				var nameArea = getAreaArr(this.cartesian[0], this.cartesian[1], this.vnodeName, null);
				this.nameArea = nameArea;
			}
			if(!isEmpty(this.wireLength)) {
				if(isNotEmpty(this.phase) && isNotEmpty(this.csArea)) {

					var text = getWireInfo(this.wireLength, this.phase, this.csArea);
					var wireLengthArea = getAreaArr(this.wireLengthCoordinate[0], this.wireLengthCoordinate[1], text, null);
					this.wireLengthArea = wireLengthArea;

				} else {
					var wireLengthArea = getAreaArr(this.wireLengthCoordinate[0], this.wireLengthCoordinate[1], this.wireLength, null);
					this.wireLengthArea = wireLengthArea;
				}

			}

		}

	});
}

//获取存储面积的数组(计算由fillText生成的面积)
function getAreaArr(x, y, text, maxWidth) {
	var result = [];

	var temp = getArea(text, maxWidth);

	result.push(x);
	result.push(y - temp[1]);
	result.push(x + temp[0]);
	result.push(y);

	return result;
}

//计算用户节点的面积
function getArea(text, maxWidth) {
	var result = [];
	if(maxWidth == null) {
		result.push(String(text).length * 12);
		result.push(12);
	} else {
		if(String(text).length * 12 <= maxWidth) {
			result.push(String(text).length * 12);
			result.push(12);
		} else {
			result.push(maxWidth);
			result.push(parseInt(String(text).length / maxWidth) + 1);
		}
	}
	return result;
}

//生成节点的信息坐标，线长的信息坐标，变压器的名字坐标
function putAllPointInfoAndWireLengthInfoCoordinate(jsonArr) {
	$(myInfo).each(function() {
		putPointInfoCoordinate(this);
		putWireLengthInfoCoordinate(this);
		//生成变压器的名字
		putTransformerNameCoordinate(this);
	});
}

//生成节点上的信息坐标
function putPointInfoCoordinate(jsonObj) {
	if(jsonObj.vnodekind == "user" && jsonObj.vnodekind == "T" && jsonObj.vnodekind == "virtual") {
		//判断标注是否为空
		if(isEmpty(jsonObj.vnodeName)) {
			return;
		}
		var PointInfoCoordinate = [];
		PointInfoCoordinate.push(jsonObj.cartesian[0]);
		PointInfoCoordinate.push(jsonObj.cartesian[1]);
		jsonObj.PointInfoCoordinate = PointInfoCoordinate;
	}

}

//生成线上信息的坐标
function putWireLengthInfoCoordinate(jsonObj) {
	if(isEmpty(jsonObj.wireLength)) {
		return;
	}

	var wireLengthCoordinate = [];
	var x1 = jsonObj.cartesian[0];
	var y1 = jsonObj.cartesian[1];
	var x2 = jsonObj.father_location[0];
	var y2 = jsonObj.father_location[1];
	var x = x1 > x2 ? (x2 + (x1 - x2) / 2) : (x1 + (x2 - x1) / 2);
	var y = y1 > y2 ? (y2 + (y1 - y2) / 2) : (y1 + (y2 - y1) / 2);

	wireLengthCoordinate.push(x);
	wireLengthCoordinate.push(y);
	jsonObj.wireLengthCoordinate = wireLengthCoordinate;

}

//生成变压器节点的名称坐标
function putTransformerNameCoordinate(jsonObj) {
	if(isNotEmpty(REGION_NAME)) {
		var PointInfoCoordinate = [];
		PointInfoCoordinate.push(jsonObj.cartesian[0]);
		PointInfoCoordinate.push(jsonObj.cartesian[1]);
		jsonObj.PointInfoCoordinate = PointInfoCoordinate;
	}
}