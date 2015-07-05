/**
 * Created by christianhalfmann on 01.07.15.
 */

(function() {


    // Start Condition
    $(document).ready(function(){

        $('#greeterHeading').text('Willkommen bei Picture Moments! Hier hast Du die Möglichkeit Bilder' +
            ' Deiner Foto-Session Online zu betrachten. Bitte gib dafür Deine Session-ID ein.');

        $('#pickButton').hide();
        $('#galleryButton').hide();
        $('#backButton').hide();

        $('#buttonRequestSessionID').on('click', requestSession);
        $('form').on('submit', function(evt){
            evt.preventDefault();
        });
    });

    function requestSession(evt) {

        var id = $('#inputSessionId').val();
        if (id !== '') {
            $('#eventText').html('<img src="imgages/loading.gif"> loading...');
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

            var link = '<div class="col-xs-6 col-md-3"><a href="/api/images/' + image + '" class="thumbnail" data-gallery>';
            link += '<img src="/api/thumbnails/'
                + image + '" class="img-responsive" width="200" height="200" alt="' + image + '" /></a>';

            link += '</div>';
            imagesHTML += link;
        });

        var name = sessionData.client.surname + ' '
            + sessionData.client.lastname;


        $('#greeterHeading').css({"color": "#8D9091"}).html('Hallo ' + name + '. Die Bilder Deiner Session liegen hier bereit. ' +
            'Du kannst Dich durch alle Bilder durchklicken oder sie als Slideshow betrachten. Viel Spaß!');

        hideSessionInput();
        showButtons();

        $('#pictures').click(function(){
            $('#jumbotron').hide();
            $('#pickButton').hide();
            $('#galleryButton').show();
            $('#sessionData').html(imagesHTML);
            $('#sessionData').show();
            $('#backButton').show();
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

    function showButtons() {
        $('#pickButton').show();
    }

})();