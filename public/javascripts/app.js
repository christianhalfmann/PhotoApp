/**
 * Created by christianhalfmann on 01.07.15.
 */

(function() {

    var name = "Christian"


    // Start Condition
    $(document).ready(function(){
        $('#error').hide()
        $('#page2').hide()
        $('#page3').hide()
        $('#page4').hide()

        $('#buttonRequestSessionID').on('click', requestSession);
        $('form').on('submit', function(evt){
            evt.preventDefault();
        });


        $('#start').click(function(){

            $('#page1').hide()
            $('#name').text(name);
            $('#page2').show()

        });

        $('#pictures').click(function(){
            $('#page2').hide()
            $('#page3').show()

        });

        $('#videos').click(function(){
            $('#page2').hide()
            $('#page4').show()

        });

        $('#back_button_page3').click(function(){
            $('#page3').hide()
            $('#page2').show()

        });

        $('#back_button_page4').click(function(){
            $('#page4').hide()
            $('#page2').show()

        });

    });


    function requestSession(evt) {

        var id = $('#inputSessionId').val();
        if (id !== '') {
            $('#eventText').html('<img src="img/loading.gif"> loading...');
            var jqxhr = $.ajax('/api/sessions/' + id)
                .done(function() {
                    alert('done');
                    hideSessionInput();
                })
                .success(function(data, textStatus) {
                    //console.log(data);
                    alert('success');
                    appendSessionView(data);
                })
                .fail(function(err) {
                    alert(err);
                    $('#start').hide();
                    $('#error').show();
                })
                .always(function() {
                    //alert( "complete" );
                });
        } else {
            alert('No session id given!');
        }
    }

    function appendSessionView(sessionData) {
        var imagesHTML = '';
        sessionData.images.forEach(function(image) {
            var link = '<a href="/api/images/' + image + '" class="thumbnail">';
            link += '<img src="/api/thumbnails/'
                + image + '" class="img-responsive" width="200" height="200" alt="' + image + '" />';
            link += '</a>';
            imagesHTML += link;
        });

        var name = sessionData.client.firstname + ' '
            + sessionData.client.lastname;

        $('#greeterHeading').html('Hallo, ' + name);
        $('#sessionData').html(imagesHTML);
    }

    function hideSessionInput() {
        $('#formSessionId').hide();
    }
})();
