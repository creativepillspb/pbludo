var socket = io(window.location.host, {path: baseUrl + 'socket.io'}),
    inQueue = -1,
    lastReadyChange = new Date();

socket.on('lobby', function (msg) {
    updateLobby();
});
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
socket.on('gamestart', function (msg) {
    let args = msg.split(" ");

    console.log(msg);

    for (let i = 1; i < msg.length; i++) if (parseInt(msg[i]) == localStorage.playerId) {
        console.log("test join");
                console.log(localStorage.playerId);

        window.location.href = baseUrl + "game?gameid=" + args[0]+"&coins="+getUrlVars.coins;
    }
});

socket.on('connect_error', function (err) {
    alert("Connection lost. The webpage will now refresh.");
    location.reload();
});

function sendActiveSignal() {
    jQuery.ajax({
        url: baseUrl + "rest/active?token=" + localStorage.token,
        type: "POST",
        data: JSON.stringify({}),
        contentType: 'application/json; charset=utf-8',
        timeout: 1000
    });
}

function updateLobby() {
    jQuery.ajax({
        url: baseUrl + "rest/lobby?token=" + localStorage.token,
        type: "GET",

        contentType: 'application/json; charset=utf-8',
        success: function (resultData) {
            if (typeof resultData.redirect == 'string') window.location = resultData.redirect;

            let readyPlayers = 0;

            $("#players").empty();
            $("#readyPlayers").empty();
            for (let i = 0; i < resultData.players.length; i++) {
                if (resultData.players[i].ready) {
                    readyPlayers++;
                    if (resultData.players[i].playerId == localStorage.playerId) {
                        inQueue = 0;
                        updateReadyButton();
                    }
                }
                jQuery('<div/>', {
                    class: 'well',
                    text: resultData.players[i].playerName
                }).appendTo($((resultData.players[i].ready) ? "#readyPlayers" : "#players"));
            }

            if (readyPlayers >= 2) {
                $("#startGame").prop("disabled", false).css('opacity', 1.0);
            } else {
                $("#startGame").prop("disabled", true).css('opacity', 0.5);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },

        timeout: 2000,
    });

    jQuery.ajax({
        url: baseUrl + "rest/games?token=" + localStorage.token,
        type: "GET",

        contentType: 'application/json; charset=utf-8',
        success: function (resultData) {
            if (resultData.length == 0) {
                $("#ongoingGames").text("No games ongoing");
                $("#previousGames").text("No previous games");
            } else {
                $("#ongoingGames").empty();
                $("#previousGames").empty();

                for (let i = 0; i < resultData.length; i++) {
                    let string = "";

                    if (resultData[i].status === 1) {
                        string += "Players: ";
                        for (var j = 0; j < resultData[i].players.length; j++) string += resultData[i].players[j].playerName + ((resultData[i].players.length - 1 === j) ? "" : ", ");
                        string += " on turn " + resultData[i].turn + ".";
                        if (resultData[i].winners.length > 0) string += " Winners: "
                        for (var j = 0; j < resultData[i].winners.length; j++) string += (j + 1) + ". " + resultData[i].players[resultData[i].winners[j]].playerName + ((resultData[i].winners.length - 1 === j) ? "" : ", ");

                    } else {
                        string += "Winners: ";
                        for (var j = 0; j < resultData[i].winners.length; j++) string += (j + 1) + ". " + resultData[i].players[resultData[i].winners[j]].playerName + ((resultData[i].winners.length - 1 === j) ? "" : ", ");
                    }
                    jQuery('<button/>', {
                        href: baseUrl + "game?gameid=" + resultData[i].gameId,
                        rel: 'internal',
                        class: 'well',
                        text: string,
                        style: 'padding: 2%; width: 100%; textAlign: left; ',
                        onclick: "window.location.href=$(this).attr('href')",
                    }).click(function () {
                        console.log("test");
                    }).prependTo($((resultData[i].status == 1) ? "#ongoingGames" : "#previousGames"));
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },

        timeout: 2000,
    });
}

function readyUnready() {
    if (new Date() - lastReadyChange < 400) return;
    lastReadyChange = new Date();

    if (inQueue === -1) {
        jQuery.ajax({
            url: baseUrl + "rest/lobby?token=" + localStorage.token,
            type: "POST",
            data: JSON.stringify({action: "ready"}),
            contentType: 'application/json; charset=utf-8',
            timeout: 2000,
            success: function () {
                inQueue = 0;
                updateReadyButton();
            }
        });
    } else {
        jQuery.ajax({
            url: baseUrl + "rest/lobby?token=" + localStorage.token,
            type: "POST",
            data: JSON.stringify({action: "unready"}),
            contentType: 'application/json; charset=utf-8',
            timeout: 2000,
            success: function () {
                inQueue = -1;
                updateReadyButton();
                alert(2);
            }
        });
    }
}

function updateReadyButton() {
    if (inQueue === -1) {
        $("#readyBtn").text(" Ready ");
    } else {
        $("#readyBtn").text("Unready");
    }
}

function logout() {
    localStorage.token = undefined;
    window.location.href = baseUrl;
}

  window.setInterval(function(){ 
$("#startGame").click();
    }, 5000);

$(document).ready(function () {
    updateLobby();
    $("#startGame").click(function () {
        jQuery.ajax({
            url: baseUrl + "rest/lobby?token=" + localStorage.token,
            type: "POST",
            data: JSON.stringify({action: "startGame"}),
            contentType: 'application/json; charset=utf-8',
            timeout: 2000
        });
    });
function gameLost() {
  jQuery.ajax({
            url: baseUrl + "rest/lobby?token=" + localStorage.token,
            type: "POST",
            data: JSON.stringify({action: "startGame"}),
            contentType: 'application/json; charset=utf-8',
            timeout: 2000
        });
}
setTimeout(gameLost, 60000);

    jQuery.ajax({
            url: baseUrl + "rest/lobby?token=" + localStorage.token,
            type: "POST",
            data: JSON.stringify({action: "ready"}),
            contentType: 'application/json; charset=utf-8',
            timeout: 2000,
            success: function () {
                inQueue = 0;
                updateReadyButton();
            }
        });

    $("#logoutBtn").click(function () {
        logout();
    });

    sendActiveSignal();
    setInterval(function () {
        sendActiveSignal();
    }, 3000);

});
