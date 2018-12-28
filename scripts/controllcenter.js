//Öffnet das Controllcenter
var lastactionssave = "";
var newactionhtml = '<tr class="lastactions" id="newlastaction"><td id="enr"></td><td id="time"></td><td id="location"></td><td id="locationobject"></td><td id="keyword"></td></tr>';
var newteamhead = '<tr><th>D-Nr</th><th>Name</th><th>Qualifikation</th></tr>';
var vehiclessave = "";
var fensterid = 0;

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
        function(){
            clockupdate(); 
            loadlastactions();
            loadvehicles();
        },1000
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
        opendispatch();
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
    if ($('#controllcenter_action_form').find('#sirene').prop('checked')) {
        formcontent['sirene'] = 1;
    } else {
        formcontent['sirene'] = 0;
    };
    console.log(formcontent);
    formcontent['action'] = 'saveaction';
    $.ajax({
        type:"POST",
        url:"/controllcenter/database.php",
        data:formcontent
    });
}


//Aktualisiert die Tabelle unten
function loadlastactions() {
    $.ajax({
        type:"POST",
        url:"/controllcenter/database.php",
        data:{
            action:"getlastactions"
        },
        success:function (data) {
            if (data != lastactionssave) {
                lastactionsnew = $.parseJSON(data);
                $('.lastactions').remove();
                $.each(lastactionsnew, function (index) {
                    $('#controllcenter_lastactions tbody').append(newactionhtml);
                    $('#newlastaction').find('#enr').text(lastactionsnew[index]['enr']);
                    $('#newlastaction').find('#time').text(lastactionsnew[index]['date'] + " | " + lastactionsnew[index]['time']);
                    $('#newlastaction').find('#location').text(lastactionsnew[index]['position']);
                    $('#newlastaction').find('#locationobject').text(lastactionsnew[index]['object']);
                    $('#newlastaction').find('#keyword').text(lastactionsnew[index]['longterm']);
                    newid = lastactionsnew[index]['enr'];
                    $('#newlastaction').attr("id",newid);
                    $('#' + newid).click(function() {
                        loadaction($(this).attr('id'));
                    });
                });
                lastactionssave = data;
            };
        }
    });
}

//Lädt einen Einsatz in das Formular
function loadaction(id) {
    $.ajax({
        type:"POST",
        url:"/controllcenter/database.php",
        data:{
            action:"getaction",
            id:id
        },
        success:function (data) {
            if (data != false) {
                action = $.parseJSON(data);
                form = $('#controllcenter_action_form');
                $(form).find('#enr').val(action['enr']);
                $(form).find('#date').val(action['date']);
                $(form).find('#time').val(action['time']);
                $(form).find('#locationobject').val(action['object']);
                $(form).find('#location').val(action['position']);
                $(form).find('#keywordexpanded').val(action['longterm']);
                $(form).find('#keywordshort').val(action['shortterm']);
                $(form).find('#callername').val(action['callername']);
                $(form).find('#callerid').val(action['callerid']);
                $(form).find('#comment').val(action['comment']);
                $(form).find('#prio').val(action['prio']);
                $('#controllcenter_action_form').find('input, textarea, select').not('.staydisabled').prop( "disabled" , false );
                $('#controllcenter_action_form').find('.show1, .show2, .show3').button("enable");
            };
        },
    });
}


//Lädt die Fahrzeuge und Updatet sie auch
function loadvehicles() {
    $.ajax({
        type:"POST",
        url:"/controllcenter/database.php",
        data:{
            action:"getvehicles"
        },
        success:function (data) {
            vehiclesnew = $.parseJSON(data);
            if (vehiclesnew.length==$('#controllcenter_vehicles_liste').find('.header').length) {
                if (data != vehiclessave) {
                    //checkstatus
                    $('.statusalert, .statusgreen, .statusyellow, .statusred').removeClass('statusalert statusgreen statusyellow statusred');
                    $.each(vehiclesnew, function (index) {
                        if ((vehiclesnew[index]['status']==1) || (vehiclesnew[index]['status']==2) || (vehiclesnew[index]['status']==9)) {
                            status="statusgreen";
                        } else if ((vehiclesnew[index]['status']==5)){
                            status="statusalert";
                        } else if ((vehiclesnew[index]['status']==3)||(vehiclesnew[index]['status']==4)||(vehiclesnew[index]['status']==6)||(vehiclesnew[index]['status']==7)) {
                            status="statusred";
                        } else if (vehiclesnew[index]['status']==8) {
                            status="statusyellow";
                        }
                        $('#status' + vehiclesnew[index]['vehicleid']).addClass(status);
                        $('#status' + vehiclesnew[index]['vehicleid']).text(vehiclesnew[index]['status']);
                        $('#lastpos' + vehiclesnew[index]['vehicleid']).text(vehiclesnew[index]['lastposition']);

                    })
                    vehiclessave = data;
                }
            } else {
                $('.vehicles').remove();
                $.each(vehiclesnew, function (index) {
                    insert = "";
                    insert = insert + '<tr class="header vehicles">';
                    insert = insert + '<td><button class="statusbuttons" id="status' + vehiclesnew[index]['vehicleid'] + '">' + vehiclesnew[index]['status'] + '</button></td>';
                    insert = insert + '<td>' + vehiclesnew[index]['vehiclename'] + '</td>';
                    userids= vehiclesnew[index]['userids'].split("|");
                    insert = insert + '<td>' + userids.length + '</td>';
                    insert = insert + '<td id="lastpos' + vehiclesnew[index]['vehicleid'] + '">' + vehiclesnew[index]['lastposition'] + '</td>';
                    insert = insert + '</tr>';
                    insert = insert + '<tr class="content vehicles"><td colspan="4">';
                    insert = insert + '<table><tr>';
                    insert = insert + '<th>D-Nr</th><th>Name</th><th>Qualifikation</th>';
                    $.each(userids, function (index) {
                        insert = insert + '<tr id="user' + userids[index] + '"></tr>'
                    });
                    insert = insert + '</tr>';
                    insert = insert + '</table>';
                    insert = insert + '</tr>';
                    $('#controllcenter_vehicles_liste_tbody').append(insert);
                    $.each(userids, function (index) {
                        insert = insert + '<tr id="user' + userids[index] + '"></tr>';
                        $.ajax({
                            type:"POST",
                            url:"/controllcenter/database.php",
                            data:{
                                action:"getuser",
                                id:userids[index]
                            },
                            success:function (data) {
                                user = $.parseJSON(data);
                                insertuser = "<td>" + user['id'] + "</td>";
                                insertuser = insertuser + "<td>" + user['name'] + ", " + user['vorname'] + "</td>";
                                insertuser = insertuser + "<td>" + user['ausbildung'] + "</td>";
                                $('#user' + user['id']).append(insertuser)
                            }
                        });
                    })
                    if ((vehiclesnew[index]['status']==1) || (vehiclesnew[index]['status']==2) || (vehiclesnew[index]['status']==9)) {
                        status="statusgreen";
                    } else if ((vehiclesnew[index]['status']==5)||(vehiclesnew[index]['status']==0)){
                        status="statusalert";
                    } else if ((vehiclesnew[index]['status']==3)||(vehiclesnew[index]['status']==4)||(vehiclesnew[index]['status']==6)||(vehiclesnew[index]['status']==7)) {
                        status="statusred";
                    } else if (vehiclesnew[index]['status']==8) {
                        status="statusyellow";
                    }
                    $('#status' + vehiclesnew[index]['vehicleid']).addClass(status);
                });
                vehiclessave = data;
                $("#controllcenter_vehicles_liste tr.content").hide();
                $("#controllcenter_vehicles_liste tr.header").click(function(){
                    $("#controllcenter_vehicles_liste tr.content").hide();
                    $(this).next("tr").fadeToggle(500);
                }).eq(0).trigger('click');
            };
        }
    });
}

//Disponierung öffnen
function opendispatch() {
    fensterid++;
    $('body').append('<div id="dispatch"><select id="dispatch_liste" multiple width="150px" size="8"><optgroup label="Rettungswagen | Status | Letzte Position" id="dispatch_rtw"></optgroup><optgroup label="Notarzteinsatzfahrzeuge" id="dispatch_nef"></optgroup></select><br><button id="dispatch_send" type="button">Dispatch senden</button></div>');
    $.ajax({
        type:"POST",
        url:"/controllcenter/database.php",
        data:{
            action:"getrtw"
        },
        async:false,
        success:function (data) {
            rtws = $.parseJSON(data);
            $.each(rtws, function (index) {
                text = '<option id="' + rtws[index]['vehicleid'] + '">' + rtws[index]['vehiclename'] + ' | ' + rtws[index]['status'] + ' | ' + rtws[index]['lastposition'] + '</option>';
                $('#dispatch_rtw').append(text);
            })
        }
    });
    $.ajax({
        type:"POST",
        url:"/controllcenter/database.php",
        data:{
            action:"getnef"
        },
        async:false,
        success:function (data) {
            rtws = $.parseJSON(data);
            $.each(rtws, function (index) {
                text = '<option id="' + rtws[index]['vehicleid'] + '">' + rtws[index]['vehiclename'] + ' | ' + rtws[index]['status'] + ' | ' + rtws[index]['lastposition'] + '</option>';
                $('#dispatch_nef').append(text);
            })
        }
    });
    $('#dispatch_send').button().click(function () {
        saveDispatch();
    });
    $('#dispatch').dialog({
        width: 'auto',
        height: 'auto'
    });
    
}


//Speichert Disponation
function saveDispatch() {
    var vehicles = [];
    id = $('#controllcenter_action_form').find('#enr').val();
    i=0;
    $.each($("#dispatch_liste").find('option:selected'), function() {
        vehicles[i] = $(this).prop('id'); 
        i++;
    });
    $.ajax({
        type:"POST",
        url:"/controllcenter/database.php",
        data:{
            action:"pushdispatch",
            vehicles:vehicles,
            id:id
        },
        success:function(data){
        }
    });
    $('#dispatch').dialog( 'destroy' ).remove();
}


//User im Dienst/Feierabend/Urlaub/Auf Abruf
function showusers() {
    $("body").append('<div id="userlist"></div>');
    $("#userlist").append('<ul id="onduty"></ul><ul id="offduty"></ul><ul id="vacation"></ul><ul id="oncall"></ul>');
    $.ajax({
        type:"POST",
        url:"/controllcenter/database.php",
        data:{
            action:"getusers",
            what:"onduty"
        },
        success:function(data){
            onduty = $.parseJSON(data);
            $('#onduty').append('<h3>Im Dienst</h3>')
            $.each(onduty, function (index) {
                $('#onduty').append('<li id="' + onduty[index]['id'] + '">' + onduty[index]['id'] + ' | ' + onduty[index]['name'] + ', ' + onduty[index]['vorname'] + '</li>')
            })
        }
    });
    $.ajax({
        type:"POST",
        url:"/controllcenter/database.php",
        data:{
            action:"getusers",
            what:"offduty"
        },
        success:function(data){
            offduty = $.parseJSON(data);
            $('#offduty').append('<h3>Außer Dienst</h3>');
            $.each(offduty, function (index) {
                $('#offduty').append('<li id="' + offduty[index]['id'] + '">' + offduty[index]['id'] + ' | ' + offduty[index]['name'] + ', ' + offduty[index]['vorname'] + '</li>')
            })
        }
    });
    $.ajax({
        type:"POST",
        url:"/controllcenter/database.php",
        data:{
            action:"getusers",
            what:"vacation"
        },
        success:function(data){
            vacation = $.parseJSON(data);
            $('#vacation').append('<h3>Urlaub</h3>');
            $.each(vacation, function (index) {
                $('#vacation').append('<li id="' + vacation[index]['id'] + '">' + vacation[index]['id'] + ' | ' + vacation[index]['name'] + ', ' + vacation[index]['vorname'] + '</li>')
            })
        }
    });
    $.ajax({
        type:"POST",
        url:"/controllcenter/database.php",
        data:{
            action:"getusers",
            what:"oncall"
        },
        success:function(data){
            oncall = $.parseJSON(data);
            $('#oncall').append('<h3>Auf Abruf</h3>');
            $.each(oncall, function (index) {
                $('#oncall').append('<li id="' + oncall[index]['id'] + '">' + oncall[index]['id'] + ' | ' + oncall[index]['name'] + ', ' + oncall[index]['vorname'] + '</li>')
            })
        }
    });
    $( "#onduty, #offduty, #vacation, #oncall" ).sortable({
        connectWith: "#onduty, #offduty, #vacation, #oncall",
        items: "> li",
        stop: function( event, ui ) {
            
        }
    });
    $('#userlist').dialog({
        width: 'auto',
        height: 'auto',
        modal:true,
        beforeClose: function(){ $('#userlist').dialog('destroy').remove(); }
    });
}

function deleteaction() {
    insert = "<div id='deleteactionwindow' title='Einsatz Löschen'><h3>Möchten sie den Einsatz wirklich Löschen?</h3><button type='button' id='deleteaction'>LÖSCHEN</button><button id='abortactiondelete'>Abbrechen</button></div>";
    $('body').append(insert);
    $('#deleteactionwindow #deleteaction').button().click(function(){
        id = $('#controllcenter_action_form #enr').val();
        $.ajax({
            
            type:"POST",
            url:"/controllcenter/database.php",
            data:{
                action:"deleteaction",
                id:id
            },
        });
        $('#deleteactionwindow').dialog( 'destroy' ).remove();
    })
    $('#deleteactionwindow #abortactiondelete').button().click(function(){ $('#deleteactionwindow').dialog( 'destroy' ).remove(); })
    $('#deleteactionwindow').dialog({
        width: 'auto',
        height: 'auto',
        beforeClose: function () {
            $('#deleteactionwindow').dialog( 'destroy' ).remove();
        }
    });
}



$(function () {
    loadvehicles();
    
})