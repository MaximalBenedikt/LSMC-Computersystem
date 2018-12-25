$(function(){
    var zindex = 0;
    var user;
/*
    function openLoginForm(){
        var response;
        $.ajax({
            type: "GET",   
            url: "computer/login.html",   
            async: false,
            success : function(text)
            {
                response= text;
            }
        });
        $('body').append(response);
        $('#dialog_login').dialog({
            width: '360px',
            height: 'auto'
        });
        $('#dialog_login').find('.ui-dialog-titlebar-close').remove();
        $('#dialog_login #login_button').button();
        $("#login_button").button().click(function() {
            performLogin();
        })
    }

    function performLogin(){
        var logindata = {
            username:$('#dialog_login #login_username').val(),
            password:$('#dialog_login #login_password').val(),
        };
        $.ajax({
            type: "POST",   
            url: "computer/login.php",
            data: {username:logindata['username'],password:logindata['password']},   
            async: false,
            success : function(data)
            {
                user = jQuery.parseJSON(data);
            }
        });
        console.log(logindata)
        $('#dialog_login').dialog("destroy");
        $('#dialog_login').remove();
    }

    openLoginForm();*/
    openControllcenter();
})