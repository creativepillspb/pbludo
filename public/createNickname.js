


function validate() {
    var newText = "";

    jQuery.ajax({
        url: baseUrl + "rest/playerExists",
        type: "POST",
        data: JSON.stringify({"playerName": $("#playerName").val()}),

        contentType: 'application/json; charset=utf-8',
        success: function (resultData) {
            if (!resultData.success) $("#nicknameError").text(resultData.message);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },
          timeout: 120000,
    });

    if ($("#playerName").val().length > 16) newText = "Name max length is 16 charaters.";
    if ($("#playerName").val().length < 3) newText = "Name must be at least 3 charaters.";

    $("#nicknameError").text(newText);

    $("#createNickname").attr("disabled", (newText != ""));
}
function playercheck(){
   // var username=getUrlVars().username;
            //if(localStorage.getItem("playerId") === null){
                submit();
                
            //}else{
            //console.log('in');
           //}
                    
 
    
}
function tokeninsert(plid,token){
    var username=getUrlVars().username;
    jQuery.ajax({
        url:"https://playbattleapp.tk/API/inserttoken.php?username="+username+"&player_id="+plid+"&token="+token,
        type: "POST",
        data: JSON.stringify({"playerName": $("#playerName").val()}),

        success: function (resultData) {
            // if (resultData.success) {
            //     document.write(resultData.token);
            //     document.write(resultData);
            //     localStorage.token = resultData.token;
            //     localStorage.playerId = resultData.playerId;
            //     window.location.href = "lobby";
            // }else{
            //      document.write("error");

            // }
            console.log(resultData);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },

        timeout: 120000,
    });
    
}
function submit() {
    jQuery.ajax({
        url: baseUrl + "rest/regPlayer",
        type: "POST",
        data: JSON.stringify({"playerName": $("#playerName").val()}),

        contentType: 'application/json; charset=utf-8',
        success: function (resultData) {
            if (resultData.success) {
//                 document.write(resultData.token);
//                 document.write(resultData);
                localStorage.token = resultData.token;
                localStorage.playerId = resultData.playerId;
                tokeninsert(resultData.playerId,resultData.token);
              window.location.href = "lobby?coins="+getUrlVars().coins+"&username="+getUrlVars().username;
            }else{
                 document.write("error");

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },

        timeout: 120000,
    });
}

function validateToken(next) {
    jQuery.ajax({
        url: baseUrl + "rest/login/?token=" + localStorage.token,
        type: "GET",

        contentType: 'application/json; charset=utf-8',
        success: function (resultData) {
            next(resultData.valid);
        },
        timeout: 120000,
    });
}
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
$(document).ready(function () {
var match=getUrlVars().match;
if(match=='over'){
    document.write("<center>Game Over</center>");
}
    var username=getUrlVars().username;
 $("#playerName").val(username);
    $("#playerName").on("change keyup", function (event) {
        validate();
        if (event.keyCode === 13) {
            submit();
        }
    });
    
   playercheck();
   validateToken(function (valid) {
    if (valid)window.location.href = baseUrl + "lobby?coins="+getUrlVars().coins+"&username="+getUrlVars().username;
    });
   
});
