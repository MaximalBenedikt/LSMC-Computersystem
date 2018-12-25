//Öffnet das Controllcenter
function openControllcenter(){
    var response;
    $.ajax({
        type: "GET",   
        url: "controllcenter/base.html",   
        async: false,
        success : function(text)
        {
            response= text;
        }
    });
    $('body').append(response);
    $('.actionbuttons').button();
    $('.show2, .show3').button( "disable" );
    $('#controllcenter_action').find('input, textarea, select').not('.staydisabled').prop('disabled',true);
    $('.actionbuttons').each(function (index) {
        $('.actionbuttons:eq('+index+')').button( "widget" ).css('width', '-webkit-fill-available');
    });
    $('#controllcenter').dialog({
        width: '-webkit-fill-available',
        height: 'auto'
    });
    setInterval(
        'clockupdate()',1000
    );
    $("#completeactionbutton").button().click(function() {
        completeaction();
    });
    $("#deleteactionbutton").button().click(function() {
        deleteaction();
    });
    $("#removebutton").button().click(function() {
        clearactionform();
    });
    $("#savebutton").button().click(function() {
        saveactionform();
    });
    $("#dispatchbutton").button().click(function() {
        dispatchaction();
    });
    $("#actionbutton").button().click(function() {
        opennewaction();
    });    
    $("#activusersbutton").button().click(function() {
        showusers();
    });
    $("#activteamsbutton").button().click(function() {
        showvehicles();
    });
    $('#controllcenter_action_form').find('input, textarea, select').change(function () {
        $('#savebutton').button( "enable" );
    })
}

//Uhrfunktion
function clockupdate(){
    time = new Date();
    hours = time.getHours();
    minutes = time.getMinutes();
    seconds = time.getSeconds();
    date = time.getDate();
    month = time.getMonth();
    year = time.getFullYear();
    if(date < 10){date = '0'+date;} 
    if(month < 10){month = '0'+month;} 
    if(hours < 10){hours = '0'+hours;} 
    if(minutes < 10){minutes = '0'+minutes;} 
    if(seconds < 10){seconds = '0'+seconds;}
    $('#clock #date').text(date + '.' + month + '.' + year);
    $('#clock #time').text(hours + ':' + minutes + ':' + seconds);
}


//Actionform clearen und mit neuer Uhrzeit, Datum und ENR Nummer bestücken
function opennewaction(){
    clearactionform();
    clockupdate();
    $('#controllcenter_action_form').find('input, textarea, select').not('.staydisabled').prop( "disabled" , false );
    $('#controllcenter_action_form').find('.show1, .show3').button("disable");
    $('#controllcenter_action_form').find('.show2').button("enable");
    $('#controllcenter_action_form #date').val($('#clock #date').text());
    $('#controllcenter_action_form #time').val($('#clock #time').text());
    daytime = $('#controllcenter_action_form #time').val();
    time = new Date();
    day = time.getDate();
    month = time.getMonth();
    year = time.getFullYear();
    if(date < 10){date = '0'+date;} 
    if(month < 10){month = '0'+month;} 
    date = year + '-' + month + '-' + day;

    data = {
        action: 'newaction',
        date: date,
        time: daytime
    };
    $.ajax({
        type:"POST",
        url:"/controllcenter/database.php",
        data:data,
        success:function(data){
            $('#controllcenter_action_form #enr').val(data);
        }
    });
    $('#controllcenter_action_form #location').select();
    $('#controllcenter_action_form #prionorm').prop('selected' , true)
}



//Löscht das Formular und Deaktiviert es 
function clearactionform(){
    $('#controllcenter_action_form').find('input, textarea, select').val('')
    $('#controllcenter_action_form').find('input, textarea, select').not('.staydisabled').prop( "disabled" , true );
    $('#controllcenter_action_form').find('.show2, .show3').button("disable");
    $('#controllcenter_action_form').find('.show1').button("enable");
}



//Speichert den Inhalt des Formulars in die Datenbank
function saveactionform() {
    $('#controllcenter_action_form').find('.show2').button("disable");
    $('#controllcenter_action_form').find('.show1, .show3').button("enable");
    var formcontent = {};
    $('#controllcenter_action_form').find('input, textarea, select').each(
        function ( index ) {
            formcontent[$( this ).attr('id')] = $( this ).val();
        }
    );
    if ($('#controllcenter_action_form').find('input #sirene').prop('checked')) {
        formcontent['sirene'] = 1;
    } else {
        formcontent['sirene'] = 0;
    };
    console.log(formcontent);
    formcontent['action'] = 'saveaction';
    $.ajax({
        type:"POST",
        url:"/controllcenter/database.php",
        data:formcontent,
        success:function (data) {
            console.log(data);
        }
    });
}


