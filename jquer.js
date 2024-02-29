$(document).ready(function() { 
    $(document).mousemove(function(e){
        $("#image").css({left:e.pageX, top:e.pageY});
    });
});
