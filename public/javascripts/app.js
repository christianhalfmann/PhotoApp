/**
 * Created by christianhalfmann on 01.07.15.
 */

var name = "Christian"

// Start Condition
$(document).ready(function(){
    $('#page2').hide()
    $('#page3').hide()
    $('#page4').hide()
    $('#page5').hide()


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
