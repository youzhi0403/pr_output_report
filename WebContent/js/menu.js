// JavaScript

$(document).ready(function() {
	$("#header div").click(function() {
		$(this).addClass("choosed");
		$(this).siblings().removeClass("choosed");
	})

	$("#header div").eq(0).click(function() {
		$(".main canvas").css("display", "block");
		$(".main div").css("display","none");

	})

	$("#header div").eq(1).click(function() {
		$(".main canvas").css("display", "none");
		$(".main div").css("display","block");
	})

})