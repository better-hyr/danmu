#前言
这个弹幕墙的风格承载了我为数不多的少女心，目前1.0版本功能较为单一，版本持续更新，欢迎 Fork&Star
-----
![页面主体](http://img.blog.csdn.net/20170225141932431?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHlyX2lp/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

#1. 基本功能

##★ 发送弹幕
点击提交按钮或者键盘回车，发送输入框中的弹幕
##★ 显示弹幕

 - 单一弹幕运动轨迹从左至右  
 - 不同的弹幕等间隔从上之下排列
 - 弹幕颜色随机

##★ 清除弹幕
 点击清屏按钮可以清除屏幕中的弹幕，这里的清除会清空原来的弹幕，也就是说原来的弹幕不会再显示

---

#2. 具体实现

主要分为两个部分，一部分是利用野狗云服务来保存和提取弹幕，另一部分是按照规则显示弹幕

##2.1 野狗云服务                                                                                            

###2.1.1 创建应用

在[野狗云首页](https://www.wilddog.com/)，登录或者注册，进入控制面板新建一个应用，输入应用名称和 ID，点击添加应用。右边就是我们得到的一个应用的 URL：http//<appid>.wilddogio.com/，可以理解为云端数据库的地址

###2.1.2 引入 wilddog
在 HTML 中加入一个 script 标签
```
<script src='https://cdn.wilddog.com/js/client/current/wilddog.js'></script>
```
###2.1.3 创建一个 wilddog 对象引用

```
var ref = new Wilddog("https://a-danmu-app.wilddogio.com"); 
```
###2.1.4 保存数据

```
var txt = $(".text").val();
ref.child("message").push(txt);
```
push() 方法会在当前节点（也就是 message 节点）下新增一个数据，数据的 key 随机生成。
###2.1.5 获取数据
wilddog 获取数据的方式是绑定一个异步监听的回调函数，当每次**特定事件**发生时，这个回调函数会被执行。回调函数接收一个 snapshot 类型参数，一个 snapshot 对象代表的是在指定的数据路径下，某一个时间点上数据的一个快照。调用它的 val() 函数，可以得到一个代表当前节点数据的 JavaScript 对象

```
ref.child("message").on("child_added",function(snapshot){
    // 新增弹幕
  });
ref.on("child_removed",function(){
    // 移除弹幕
})
```
关于wilddog的更多用法请见：[wilddog for javascript开发向导](https://wenku.baidu.com/view/900c2b556bec0975f565e20a.html)

##2.2 显示弹幕

###★ 颜色随机函数

第一种方法是准备一组喜欢的颜色，随机取；第二种是随机生成颜色值

这里用到的是一种比较逆天且简洁的方法

```
"#"+(Math.random()*0xffffff<<0).toString(16)
```
我们知道颜色值可以表示为 #000000~#ffffff，相当于数值 0x0000000~0xffffff，现将 0xffffff 左移 0 位转化为十进制，乘以 [0,1)     随机数后，再转换为十六进制

我们发现上面的代码有一个 bug，就是取不到 0xffffff 这个颜色值，我们将代码改进为

```
"#"+(Math.random()*0x1000000<<0).toString(16)  // 0xffffff+1
```

###★ 弹幕滚动
这里让弹幕从左至右滚动直到消失用到的是 jQuery 的 animate() 方法

```
var time = 20000 + 10000 * Math.random();
obj.animate({left:"-"+_left+"px"},time,function() {
  obj.remove();
});
```


###★  多个弹幕随机出现
若有 n 个弹幕，生成一个 [0,n-1] 的随机数，将弹幕信息加入到显示队列中
```
var n = Math.floor(Math.random() * arr.length + 1) - 1;
var textObj = $("<div>" + arr[n] + "</div>");
$(".dm_show").append(textObj);
```
###★ 响应式设计
引用了 Bootstrap 框架，页面具有良好的自适应性

#3. 兼容性测试
IE8及以下IE版本不支持
---

#4. 下一版本

 1. 加入暂停功能，点击暂停按钮，弹幕停止滚动
 2. 同一条弹幕重复次数过多，考虑一条弹幕只滚动一次或者几次
 3. 颜色值较多，考虑建立颜色数组随机选取
