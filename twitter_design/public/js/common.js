/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const sHost = window.location.host;
const sProtocol = window.location.protocol;
const API_URL = sProtocol + '//' + sHost;

$(document).ready(function(){
    $('.login-info-box').fadeOut();
    $('.login-show').addClass('show-log-panel');
    // $('#label-login').click(()=> {
    //     $('.login-show').addClass('register-show');
    //     $('.login-show').removeClass('show-log-panel');
    //     $('.register-info-box').fadeOut();
    //     $('.login-info-box').fadeIn();
    //     $('.register-show').addClass('show-log-panel');
        
    // })
});

function login() {
    var email = $('#email-id').val();
    var password = $('#password').val();

    if(email && password) {
        $.ajax({
            url: API_URL + '/login',
            data: {
                'email': email,
                'password': password
            },
            type: 'POST',
            success: function(response) {
                
            }
        });
    }
     
}

$('.login-reg-panel input[type="radio"]').on('change', function() {
    if($('#log-login-show').is(':checked')) {
        $('.register-info-box').fadeOut(); 
        $('.login-info-box').fadeIn();
        
        $('.white-panel').addClass('right-log');
        $('.register-show').addClass('show-log-panel');
        $('.login-show').removeClass('show-log-panel');
        
    }
    else if($('#log-reg-show').is(':checked')) {
        $('.register-info-box').fadeIn();
        $('.login-info-box').fadeOut();
        
        $('.white-panel').removeClass('right-log');
        
        $('.login-show').addClass('show-log-panel');
        $('.register-show').removeClass('show-log-panel');
    }
});
