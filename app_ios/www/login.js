function init() {
    document.addEventListener("deviceready", deviceReady, true);
    delete init;
}

var local = false;
function checkPreAuth() {
local=false;
    var form = $("#loginForm");
    if (window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
        $("#username", form).val(window.localStorage["username"]);
        $("#password", form).val(window.localStorage["password"]);
        local = true;
        handleLogin();
    }
}

function handleLogin() {
	 if(!navigator.onLine)
	 {
	 	navigator.notification.alert("请连接网络", function () { }, "警告", "确定");
	 	return false;
	 }

	$.mobile.loading( 'show', {
	text: '登录中，请稍候...',
	textVisible: true,
	theme: 'b',
	html: ""
	});
    var form = $("#loginForm");
    //disable the button so we can't resubmit while we wait
    $("#submitButton", form).attr("disabled", "disabled");
    var u="";
    var p="";
    if(local)
    {
    	u = $("#username", form).val();
	    p = $("#password", form).val();
	    
    	if(u=="" || p=="")
    	{
	    	u=window.localStorage["username"];
	    	p=window.localStorage["password"];
    	}
    }
    else
    {
	    u = $("#username", form).val();
	    p = $("#password", form).val();
    }
    
    if (u != '' && p != '') {
        $.ajax({
            type: "get",
            url: "http://180.169.11.50:3001/CheckLogin/CheckLogin.ashx",
            dataType: "jsonp",
            timeout:20000,
            jsonp: "callback",
            data: "Method=CheckLogin&username="+u+"&password="+p+"&callback=?",
            success: function (msg) {
                if (msg.result == "2") {
               		
	                window.localStorage["username"]=u;
	                window.localStorage["password"]=p;
                    location.href = "main.html?phoneName="+u;
                }
                else if(msg.result=="1") {
                    navigator.notification.alert("密码不正确", function () { }, "警告", "确定");
                }
                else if(msg.result=="0") {
                    navigator.notification.alert("用户不存在", function () { }, "警告", "确定");
                }
                else
                {
                	navigator.notification.alert("请重新登录", function () { }, "警告", "确定");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){ //TODO: 处理status， http status code，超时 408
				navigator.notification.alert("登陆超时", function () { 
				$("#submitButton").removeAttr("disabled");
				}, "警告", "确定");
			}, 
            complete:function(msg){
            	$.mobile.hidePageLoadingMsg();
            	$("#submitButton").removeAttr("disabled");
            }
        });
    } else {
        navigator.notification.alert("请输入用户名和密码", function () { }, "警告", "确定");
        $("#submitButton").removeAttr("disabled");
        $.mobile.hidePageLoadingMsg();
    }
    
    return false;
}

var pushNotification;

function tokenHandler (result) {
    window.localStorage["iosToken"] = result;
}

// result contains any error description text returned from the plugin call
function errorHandler (error) {
    alert('error = ' + error);
}

// iOS
function onNotificationAPN (event) {
    if ( event.alert )
    {
        navigator.notification.alert(event.alert, function () { }, "警告", "确定");
    }
    
    if ( event.sound )
    {
        var snd = new Media(event.sound);
        snd.play();
    }
    
    if ( event.badge )
    {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}


function deviceReady(){
    pushNotification = window.plugins.pushNotification;
    pushNotification.register(
                              tokenHandler,
                              errorHandler, {
                              "badge":"true",
                              "sound":"true",
                              "alert":"true",
                              "ecb":"onNotificationAPN"
                              });
	checkPreAuth();
}