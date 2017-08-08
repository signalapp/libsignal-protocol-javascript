$(() => {
    $('#click-me').on('click', sayHello);
    $('#register-keys').on('click', registerId);
    $('#create-session').on('click', startSession);
    $('#send-message').on('click', postMessage);
});


function sayHello() {
    alert('Hello!!!');
}

function registerId() {
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/register",
        dataType: "json", 
        success: function(data) {
            console.log('keys', data);
            console.log('success');
        }
    });
}

function startSession() {
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/session",
        dataType: "json",
        success: function(data) {

        }
    });
}

function sendMessage() {
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/send",
        dataType: "",
        success: function(data) {

        }
    });
}