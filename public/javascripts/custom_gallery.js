/**
 * Created by christianhalfmann on 02.07.15.
 */

$('#borderless-checkbox').on('change', function () {
    var borderless = $(this).is(':checked');
    $('#blueimp-gallery').data('useBootstrapModal', !borderless);
    $('#blueimp-gallery').toggleClass('blueimp-gallery-controls', borderless);
});

$('#fullscreen-checkbox').on('change', function () {
    $('#blueimp-gallery').data('fullScreen', $(this).is(':checked'));
});


/** Push vergessen **/