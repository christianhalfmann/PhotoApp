(function() {
    $(document).ready(function() {
        $('#buttonRequestSessionID').on('click', requestSession);
    });


    function requestSession(evt) {
        var id = $('#inputSessionId').val();
        if (id !== '') {
            $('#eventText').html('<img src="img/loading.gif"> loading...');
            var jqxhr = $.ajax('/api/sessions/' + id)
                .done(function() {
                    $('#eventText').html('Session ' + id + ' requested');
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
            imagesHTML += '<img src=/api/thumbnails/'
                + image + ' width="200" height="200" alt="' + image + '" />'
        });

        $('#sessionData').html(
            '<span>' + sessionData.client.firstname + '&nbsp;</span>' +
            '<span>' + sessionData.client.lastname + '</span>' +
            imagesHTML
        );
    }

})();

