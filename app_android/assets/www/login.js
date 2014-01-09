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
	 	navigator.notification.alert("请连接网络", function () { });
	 	return false;
	 }

	$.mobile.loading( 'show', {
	text: '登录中，请稍候。。。',
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
            url: "http://172.20.67.217/CheckLogin/CheckLogin.ashx",
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
                    navigator.notification.alert("密码不正确", function () { });
                }
                else if(msg.result=="0") {
                    navigator.notification.alert("用户不存在", function () { });
                }
                else
                {
                	navigator.notification.alert("请重新登录", function () { });
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){ //TODO: 处理status， http status code，超时 408
				navigator.notification.alert("登陆超时", function () { 
				$("#submitButton").removeAttr("disabled");
				});
			}, 
            complete:function(msg){
            	$.mobile.hidePageLoadingMsg();
            	$("#submitButton").removeAttr("disabled");
            }
        });
    } else {
        navigator.notification.alert("请输入用户名和密码", function () { });
        $("#submitButton").removeAttr("disabled");
        $.mobile.hidePageLoadingMsg();
    }
    
    return false;
}

function deviceReady(){
	checkPreAuth();
}