//判断指定的字符串是否为空
function isEmpty(p) {
	if(p == undefined || p == "" || p == null) {
		return true;
	} else {
		return false;
	}
}

//判断指定的字符串非空
function isNotEmpty(p) {
	if(isEmpty(p)) {
		return false;
	} else {
		return true;
	}
}

//判断两组坐标的值是否相同
function isEquals(arr1, arr2) {
	if(arr1[0] == arr2[0] && arr1[1] == arr2[1]) {
		return true;
	} else {
		return false;
	}
}