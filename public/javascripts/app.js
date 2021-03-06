/**
 * Created by christianhalfmann on 01.07.15.
 */

(function() {

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    // Start Condition
    $(document).ready(function(){

        $('#greeterHeading').html('Willkommen bei Picture Moments!<br/>Hier hast Du die Möglichkeit Bilder' +
            ' Deiner Foto-Session Online zu betrachten. Bitte gib dafür Deine Session-ID ein.');

        $('#pickButton').hide();
        $('#galleryButton').hide();
        $('#backButton').hide();

        //mobileTest();

        $('#buttonRequestSessionID').on('click', requestSession);
        $('form').on('submit', function(evt){
            evt.preventDefault();

        });
    });

    function requestSession(evt) {

        var id = $('#inputSessionId').val();
        if (id !== '') {
            //$('#eventText').html('<img src="images/loading.gif"> loading...');
            var jqxhr = $.ajax('/api/sessions/' + id)
                .done(function() {
                    //alert('done');
                    //hideSessionInput();
                })
                .success(function(data, textStatus) {
                    //console.log(data);
                    //alert('success');
                    appendSessionView(data);
                })
                .fail(function(err) {
                    //alert(err);
                    $('#greeterHeading').css({"color": "#C1121C"}).html('Die eingegebene Session ID ist nicht vergeben. ' +
                        'Bitte kontrolliere Deine Eingabe oder versuche es zu einem späteren Zeitpunkt noch einmal.');
                })
                .always(function() {
                    //alert( "complete" );
                });
        } else {
            //alert('No session id given!');
            $('#greeterHeading').css({"color": "#C1121C"}).html('Es wurde keine Eingabe getätigt. ' +
                'Bitte gib Deine Session-ID ein.');
        }
    }

    function appendSessionView(sessionData) {
        //alert('Bingo!');
        var imagesHTML = '';
        sessionData.images.forEach(function(image) {

            var link = '<div class="col-xs-6 col-sm-5 col-md-4 col-lg-3"><a href="/api/images/' + image + '" class="thumbnail" data-gallery>';
                link += '<img src="/api/thumbnails/'
                + image + '" class="img-responsive" width="200" height="200" alt="' + image + '" /></a>';

            link += '</div>';
            imagesHTML += link;

            $('#thumbnail').css({"wight": "80px", "height": "80px"});

        });

        var name = sessionData.client.firstname + ' '
            + sessionData.client.lastname;


        $('#greeterHeading').css({"color": "#8D9091"}).html('Hallo ' + name + '!<br/> Die Bilder Deiner Session liegen hier bereit. ' +
            'Du kannst Dich durch alle Bilder durchklicken und sie online betrachten. Viel Spaß!');

        hideSessionInput();
        showPickButton();

        $('#pictures').click(function(){
            if(isMobile.any()) {
                $('#jumbotron').hide();
                $('#pickButton').hide();
                $('#sessionData').html(imagesHTML).show();
                $('#backButton').show();
            } else {
                $('#jumbotron').hide();
                $('#pickButton').hide();
                $('#galleryButton').show();
                $('#sessionData').html(imagesHTML).show();
                $('#backButton').show();
            }
        });

        $('#idBack').click(function(){
            location.reload();
        });
    }

    $('#backButton').click(function() {
        $('#jumbotron').show();
        $('#pickButton').show();
        $('#galleryButton').hide();
        $('#backButton').hide();
        $('#sessionData').hide();
    });

    function hideSessionInput() {
        $('#formSessionId').hide();
    }

    function showPickButton() {
        $('#pickButton').show();
    }


    // Gallery view for mobile and desktop devices
    if(isMobile.any()) {
        // Fullscreen and borderless gallery view for mobile devices
        $('#borderless-checkbox').prop('checked', function () {
            var borderless = $(this).is(':checked');
            $('#blueimp-gallery').data('useBootstrapModal', !borderless);
            $('#blueimp-gallery').toggleClass('blueimp-gallery-controls', borderless);
        });

        $('#fullscreen-checkbox').prop('checked', function () {
            $('#blueimp-gallery').data('fullScreen', $(this).is(':checked'));
        });



    }else {

        // Initial Lightbox view for desktop devices
        $('#borderless-checkbox').on('change', function () {
            var borderless = $(this).is(':checked');
            $('#blueimp-gallery').data('useBootstrapModal', !borderless);
            $('#blueimp-gallery').toggleClass('blueimp-gallery-controls', borderless);
        });

        $('#fullscreen-checkbox').on('change', function () {
            $('#blueimp-gallery').data('fullScreen', $(this).is(':checked'));
        });

    }
})();
/** **/