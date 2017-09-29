'use strict';

var loop = function() {
    $.ajax({
        url: "getStats",
        success: function(data) {
            $("#nodes-cnt").text(data.nodes);
            $("#con-cnt").text(data.connections);
        }
    });
    $.ajax({
        url: "latest",
        success: function(data) {
            var html = '<h2><p class="latest-text">Latest requests:</p></h2><br>';
            html += '<table class="table table-striped">';
            html += '<tr><th>Id1</th><th>Id2</th></tr>';
            for (var i = 0; i < data.length; i++) {
                var req = data[i];
                html += '<tr><td>' + req.id1 + '</td><td>' + req.id2 + '</td></tr>';
            }
            html += '</table>';
            $("#latest").html(html);
        }
    });
};

var findPath = function(id1, id2) {
    console.log("find path " + id1 + " " + id2);
    $("#result").html('<p class="text-process">Processing...</p>');
    $.ajax({
         url: "/api/search",
         type: "GET",
         data: {
             "id1": id1,
             "id2": id2
         },
         success: function(data) {
             console.log(data);
             var info = data.comment;
             var html = '<p class="text-info">Info: ' + info + '</p><br>';
             var path = data.list;
             if (path.length > 0) {
                 html += '<table class="table table-striped">';
                 html += '<tr><th>Id</th><th>First name</th><th>Last name</th><th>Photo</th></tr>';
                 for (var i = 0; i < path.length; i++) {
                     var acc = path[i];
                     html += '<tr><td>' + acc.id + '</td><td>' + acc.first_name + '</td><td>' + acc.last_name + '</td><td><a href="https://vk.com/id' + acc.id + '"><img src="' + acc.photo_100 + '" alt="Photo 100px" ></a></td></tr>';
                 }
                 html += '</table>';
             }
             $("#result").html(html);
         },
         complete: function() {
             console.log("complete");
         },
         timeout: 3600000,
         error: function() {
             $("#result").html('<p class="text-process error-process">Error. Try again later</p>');
         }
    });
};

$(function() {
    loop();

    //var interval = setInterval(loop, 1000);

    $("#friends-btn").click(function(e) {
        e.preventDefault();
        var id1 = $("#id1").val();
        var id2 = $("#id2").val();
        findPath(id1, id2);
    });
});

