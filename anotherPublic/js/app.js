(function() {
    $(document).ready(function() {
        $('#buttonRequestSessionID').on('click', requestSession);
        $('form').on('submit', function(evt){
            evt.preventDefault();
        });
    });

    function requestSession(evt) {
        var id = $('#inputSessionId').val();
        if (id !== '') {
            $('#eventText').html('<img src="img/loading.gif"> loading...');
            //var jqxhr = $.ajax('/api/sessions/' + id)
                .done(function() {
                    hideSessionInput();
                })
                .success(function(data, textStatus) {
                    //console.log(data);
                    appendSessionView(data);
                })
                .fail(function(err) {
                    alert(err);
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

