function getInput(){
    var values = document.getElementsByClassName("linkInput");
    var links = [];
    var valids = [];

    for (var i = 0; i < values.length; i++){;
        link = values[i].value.split("=")[1];
        if (link) {
            links.push(link);
            valids.push(i);
        } else {
            if (values[i].value){
                alert("Error... Check your link: " + values[i].value);
                return false;
            }
        }
    }

    var starts = [];
    var loops = [];

    var start = document.getElementsByClassName("start");
    var loop = document.getElementsByClassName("loop");

    for (var i = 0; i < valids.length; i++){

        if (start[valids[i]].value == ""){
            starts.push(0);
        } else {
            starts.push(start[valids[i]].value);
        }

        loops.push(boolToInt(loop[valids[i]].checked));
    }

    return [links, starts, loops];
}

function boolToInt(input){
    if (input){
        return 1;
    } else {
        return 0;
    }
}

function convertToSecond(time){
    if (time) {
        var time = time.split(":");
    } else {
        return 0;
    }

    var start = 0;
    if (time[time.length-1]){
        start += parseInt(time[time.length-1]);
    }

    if (time[time.length-2]){
        start += parseInt(time[time.length-2]) * 60;
    }

    if (time[time.length-3]){
        start += parseInt(time[time.length-3]) * 3600;
    }

    return start;
}

function submit(){
    var input = getInput();
    if (input[0].length > 0){
        location.hash = craftHash(input);
    }
}

function craftHash(links){
    var hash = "";
    for (var i = 0; i < links[0].length; i++){
        hash += links[0][i] + "!" + links[1][i] + "!" + links[2][i];
        if (i < links[0].length -1){
            hash += "&";
        }
    }

    return hash;
}

function parseURL(){
    var hash = location.hash.substring(1);
    var entries = hash.split("&");

    var links = [];
    var starts = [];
    var loops = [];

    for (var i = 0; i < entries.length; i++){
        var entry = entries[i].split("!");
        links.push(entry[0]);
        starts.push(convertToSecond(entry[1]));
        loops.push(entry[2]);
    }

    return [links, starts, loops];
}

function addVideo(links, starts, loops){
    var template = "https://youtube.com/embed/{{id}}?autoplay=1&start={{start}}&loop={{loop}}";
    var html = "";
    for (var i = 0; i < links.length; i++){
        var add = template;
        if (loops[i] == 1){
            add = add.replace("{{loop}}", loops[i] + "&playlist=" + links[i]);
        } else {
            add = add.replace("{{loop}}", loops[i]);
        }

        add = add.replace(/{{id}}/g, links[i]);
        add = add.replace("{{start}}", starts[i]);

        html += "<iframe width=\"560\" height=\"315\" src=\"" + encodeURI(add) + "\" frameborder=\"0\" allowfullscreen></iframe>";
    }


    document.getElementById("videos").innerHTML = html;
}

function show(id){
    document.getElementById(id).style.display = "block";
}

function hide(){
    document.getElementById("videos").innerHTML = "";
    document.getElementById("inputs").innerHTML = "";

    document.getElementById("inputholder").style.display = "none";
    document.getElementById("videos").style.display = "none";
    document.getElementById("about").style.display = "none";
}

function modes(){
    if (parseURL()[0][0] != ""){
        if (parseURL()[0][0] == "about"){
            hide();
            show("about");
            return false;
        }
        var data = parseURL();
        var links = data[0];
        var starts = data[1];
        var loops = data[2];
        hide();
        addVideo(links, starts, loops);
        show("videos");
    } else {
        hide();
        show("inputholder");
        addInput(2);
    }
}

function home(){
    location.hash = "";
}

function about(){
    hide();
    show("about");
}

function addInput(amount){
    var inputs = "";
    for (var i = 0; i < amount; i++){
        inputs += "<input class=\"linkInput\" title=\"URL of Youtuber-video\" type=\"link\" placeholder=\"https://www.youtube.com/watch?v=ic5z-0bbYsw\"><input class=\"start\" title=\"Start from...\" placeholder=\"hh:mm:ss\"><input class=\"loop\" title=\"Loop\" type=\"checkbox\"><br>";
    }
    document.getElementById("inputs").innerHTML += inputs;
}
