$(document).ready(function(){
  //连接到野狗数据库
  var ref = new Wilddog("https://a-danmu-app.wilddogio.com");
  var arr=[];
  //把数据提交到野狗云（响应提交按钮）
  $(".send").click(function(){
    var txt = $(".text").val();
    ref.child("message").push(txt);
    $(".text").val("");
  });
  //响应提交事件(按回车发送)
  $(".text").keypress(function(event){
    if(event.keyCode == 13){
      $(".send").trigger("click");
    }
  });
  //响应清除按钮
  $(".clear").click(function(){
    ref.remove();
    arr=[];
    $(".dm_show").empty();
  });
  //监听云端数据变更
  ref.child("message").on("child_added",function(snapshot){
    var text = snapshot.val();
    arr.push(text);
    var textObj = $("<div class=\"dm_message\"></div>");
    textObj.text(text);
    $(".dm_show").append(textObj);
    moveObj(textObj);
    //alert(textObj.width());
  });
  ref.on("child_removed",function(){
    arr = [];
    $(".dm_show").empty();
  })
  //按规则显示弹幕内容
  var topMin = $(".dm_mask").offset().top;
  var topMax = topMin + $(".dm_mask").height();
  var _top = topMin;
  
  function moveObj(obj) {
    _top = _top + 50;
    if((_top+50) > topMax) {
      _top = topMin;
    }
    var _left = $(".dm_mask").width() - obj.width();
    obj.css({
      top:_top,
      left:_left,
      color:getRandomColor()
    });
    var time = 20000 + 10000 * Math.random();
    obj.animate({left:"-"+_left+"px"},time,function(){obj.remove()});
  }
  //颜色随机函数
  function getRandomColor() {
    return "#"+(Math.random()*0xffffff<<0).toString(16);
  }
  //alert(Math.random()*0xffffff);
  //多个弹幕重复
	 var getAndRun = function() {
	   if (arr.length > 0) {
	     var n = Math.floor(Math.random() * arr.length + 1) - 1;
	     var textObj = $("<div>" + arr[n] + "</div>");
	     $(".dm_show").append(textObj);
	     moveObj(textObj);
	   }
	   setTimeout(getAndRun, 3000);
	 }

	 jQuery.fx.interval = 50;
	 getAndRun();
});
