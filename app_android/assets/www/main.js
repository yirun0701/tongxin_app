var aStorage = [];
var aCount = [];
var today = null;
var currentDay = null;

function getToday() {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var date = myDate.getDate();
    today = year + "-" + month + "-" + date;
}


function isNotNull(value) {
    if (typeof (value) != "undefined" && value) {
        return true;
    }
    else {
        return false;
    }
}

var socket = io.connect('http://172.20.67.217:3000');
socket.on('connected', function(){
    var phoneName = getQueryStringByName("phoneName");
	socket.emit('username', {'phoneNum': phoneName });
	
});

var localMsg=[];
socket.on('msg_in', function(msg){
	window.plugins.statusBarNotification.notify("同鑫资讯", "你有新的消息");

    newMsg(msg.title, msg.content, msg.timestamp);
    //navigator.notification.vibrate(1000);
    navigator.notification.beep(1);
});

function getQueryStringByName(name){
     var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
     if(result == null || result.length < 1){
         return "";
     }
     return result[1];
}


function newMsg(header, content, aside) {
    getToday();
    var alocalStorage = [];
    var index = null;
    var localStorage = window.localStorage["txlocalMsg"];
    if (isNotNull(localStorage)) {
        alocalStorage = localStorage.split("||");
        for (var i = 0; i < alocalStorage.length; i++) {
            var localStorageItem = alocalStorage[i];
            var aItem = localStorageItem.split(",");
            var date = aItem[0];
            if (date == today) {
                index = parseInt(aItem[1]);
                alocalStorage[i] = today + "," + (index + 1);
                break;
            }
        }
    }
    if (index == null) {
        //没有今天的消息
        alocalStorage.unshift(today + ",1");
        window.localStorage["txlocalMsg"] = alocalStorage.join("||");
        index = 1;

        var div = createCollapsible(today);
        div.prependTo($("#content"));
        div.collapsible();
        div.trigger("expand");
    }
    else {
        //有今天的消息
        window.localStorage["txlocalMsg"] = alocalStorage.join("||");
        index++;

    }

    var localDateMsg = window.localStorage["txlocalDateMsg" + today];
    if (isNotNull(localDateMsg)) {
        var aLocalDateMsg = localDateMsg.split("||");
        aLocalDateMsg.unshift(today + "-" + index);
        window.localStorage["txlocalDateMsg" + today] = aLocalDateMsg.join("||");
    }
    else {
        window.localStorage["txlocalDateMsg" + today] = today + "-1";
    }

    var aMsg = [];
    aMsg[0] = index;
    aMsg[1] = header;
    aMsg[2] = content;
    aMsg[3] = aside;

    window.localStorage["txMsg" + today + "-" + index] = aMsg.join("||");
    createAddCordion(today);


}

function createAddCordion(date) {
    $(".myView").empty();
    var ul = createListView(date);
    var p = $("#coll" + date).find(".myView");
    p.append(ul);
    $(ul).listview();
}

function createCollapsible(str) {
    var div = $("<div></div>");
    div.attr("data-role", "collapsible");
    div.attr("id", "coll" + str);
    var h3 = $("<h3>" + str + "</h3>");
    var p = $("<p></p>");
    p.addClass("myView");
    h3.click(function () {
        $(".myView").empty();
        var ul = createListView(str);
        p.append(ul);
        $(ul).listview();
    });

    h3.appendTo(div);
    p.appendTo(div);

    return div;
}

function createListView(date) {
    var ul = null;
    if (window.localStorage["txlocalDateMsg" + date]) {
        var selectDayItemStr = window.localStorage["txlocalDateMsg" + date];
        var selectDayItems = selectDayItemStr.split("||");
        ul = $("<ul></ul>");
        ul.attr("data-role", "listview");
        ul.attr("data-split-icon", "delete");
        ul.attr("data-split-theme", "d");
        ul.attr("id", "ul" + date);
        for (var i = 0; i < selectDayItems.length; i++) {

            var index = selectDayItems[i];
            if (window.localStorage["txMsg" + index]) {
                var data = window.localStorage["txMsg" + index];
                var aMsg = data.split("||");
                var index = aMsg[0];
                var header = aMsg[1];
                var content = aMsg[2];
                var time = aMsg[3];

                var li = $("<li></li>");
                var id = "li" + date + "-" + index;
                li.attr("id", id);
                var a1 = $("<a href=\"#\"></a>");
                var h2 = $("<h2>" + header + "</h2>");
                var p = $("<p>" + content + "</p>");
                var aside = $("<p></p>");
                aside.addClass("ui-li-aside");
                var strong = $("<strong>" + time + "</strong>");
                strong.appendTo(aside);
                a1.appendTo(li);

                h2.appendTo(a1);
                p.appendTo(a1);
                aside.appendTo(a1);

                var a2 = $("<a href=\"#\">删除</a>");
                a2.attr("data-rel", "popup");
                a2.attr("data-position-to", "window");
                a2.attr("data-transition", "pop");
                a2.attr("id", "a" + date + "-" + index);
                //删除
                a2.attr("onclick", "deleteLi('" + date + "','" + index + "')");
                a2.appendTo(li);
                //a2.click(function () {
                //    //alert(date);
                //    //alert(index);
                //    deleteLi(date, index);
                //});
                li.appendTo(ul);

            }
        }
    }
    return ul;
}

function deleteLi(date, index) {

	var result = confirm('您确定要删除吗？');
	if(result)
	{
	    var id = "li" + date + "-" + index;
	    $("#" + id).remove();
	    var key = date + "-" + index;
	    window.localStorage["txMsg" + key] = null;
	    var DateMsg = window.localStorage["txlocalDateMsg" + date];
	    if (DateMsg != null) {
	        var aDateMsg = DateMsg.split("||");
	        for (var i = 0; i < aDateMsg.length; i++) {
	            if (aDateMsg[i] == key) {
	                aDateMsg.splice(i, 1);
	                break;
	            }
	        }
	        if (aDateMsg.length > 0) {
	            var str = aDateMsg.join("||");
	            window.localStorage["txlocalDateMsg" + date] = str;
	        }
	        else {
	            window.localStorage["txlocalDateMsg" + date] = null;
	            var localStorage = window.localStorage["txlocalMsg"];
	            if (localStorage != null) {
	                var aLocalStorage = localStorage.split("||");
	                for (var i = 0; i < aLocalStorage.length; i++) {
	                    var tempArr = aLocalStorage[i].split(",");
	                    if (tempArr[0] == date) {
	                        aLocalStorage.splice(i, 1);
	                        break;
	                    }
	                }
	                if (aLocalStorage.length > 0) {
	                    var str = aLocalStorage.join("||");
	                    window.localStorage["txlocalMsg"] = str;
	                }
	                else {
	                    window.localStorage["txlocalMsg"] = null;
	                    var u = window.localStorage["username"];
	                	var p = window.localStorage["password"];
	                    window.localStorage.clear();
	                    window.localStorage["username"]=u;
	                	window.localStorage["password"]=p;
	                }
	            }
	            $("#coll" + date).remove();
	        }
	    }
    }

}
