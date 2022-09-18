VERSION = "v1.3.0";


function version(msg){
    var responseobj;
    var request = new XMLHttpRequest();

    request.onload = function(){
        responseobj = JSON.parse(this.responseText);
        if(responseobj.tag_name != VERSION && this.status == 200){
            msg = "<u><a href='https://github.com/fuyuneko/" +
                        "startpage/releases'>" + responseobj.tag_name +
                        " is available!</a></u><br>" + msg;
        }
    };

    request.open("get", "http://api.github.com/repos/fuyuneko/startpage/releases/latest", false);
    request.send();

    return msg;
}



function fixJitter(container){
    container.style.height = window.innerHeight - 0.5 + "px";
}


function popup(obj, msg){
    if(cfg_bool[3]){
        msg = version(msg);
    }

    var popuphandler = function(){
        popup(this, msg);
    }
    // add event listener when it's going to be visible
    if(!visibility){
        obj.addEventListener("click", popuphandler);
        obj.innerHTML = msg;
        obj.style.bottom = "-" + cfg[9];
    }else{
        obj.removeEventListener("click", popuphandler);
        obj.style.bottom = "-10px";
    }
    visibility = !visibility;
}


// expanding and contracting squares
function expand(){
    if(this.acount > 0){
        this.style.height = 640 + 25*this.acount + "px";		//max height - non search
    }else{
        this.style.height = "800px";							//max height - search
    }
    if(cfg_bool[0]){
        this.style.borderTop = cfg[9] + " solid " + cfg[8];
        this.style.borderBottom = cfg[9] + " solid " + cfg[8];
    }
    this.style.opacity = "1";
}


function contract(){
    this.style.height = "330px";								//min height after being expanded
    this.style.borderTop = "0 solid" + cfg[8];
    this.style.borderBottom = "0 solid" + cfg[8];
    this.style.opacity = "0.65";
}



String.prototype.replaceChars = function(character, replacement){
    var str = this;
    var a;
    var b;
    for(var i=0; i < str.length; i++){
        if(str.charAt(i) == character){
            a = str.substr(0, i) + replacement;
            b = str.substr(i + 1);
            str = a + b;
        }
    }
    return str;
}


function searchCase(url, query, replacement){
    query = query.substr(3);
    window.location = url + query.replaceChars(" ", replacement);
}

function search(query){
    switch(query.substr(0, 2)){
        case "-h":
            popup(popupDiv, HelpText);
            break;
        case "-c":
            configmenuInit(undefined);
            break;
        case "-g":
            searchCase("https://www.google.com/search?&q=", query, "+");
            break;
        case "-i":
            searchCase("https://www.google.com/search?tbm=isch&q=", query, "+");
            break;
        case "-w":
            searchCase("https://en.wikipedia.org/w/index.php?search=", query, "+");
            break;
        case "-a":
            searchCase("https://wiki.archlinux.org/index.php?search=", query, "+");
            break;
        case "-d":
            searchCase("http://danbooru.donmai.us/posts?tags=", query, "+");
            break;
        case "-m":
            searchCase("http://myanimelist.net/anime.php?q=", query, "+");
            break;
        case "-y":
            searchCase("https://www.youtube.com/results?search_query=", query, "+");
            break;
        case "-n":
            searchCase("https://nyaa.si/?f=0&c=1_2&q=", query, "+");
            break;
        case "-p":
            searchCase("http://www.pixiv.net/search.php?s_mode=s_tag&word=", query, "%20");
            break;
        case "-map":
            searchCase("https://www.google.com/maps?q=", query, "+");
            break;
        default:
            window.location = "https://www.google.com/search?client=firefox-b-d&q=" + query.replaceChars(" ", "+");
    }
}



window.onresize = function(){
    fixJitter(container);
}


function main(){
    HelpText = "-h Shows this list<br>-i Image search<br>-w Wikipedia<br>\
                -a ArchWiki<br>-d Danbooru<br>-m MyAnimeList<br>-y YouTube<br>\
                -n nyaa<br>-p pixiv";
    visibility = false;
    container = document.getElementById("container");
    fixJitter(container);
    popupDiv = document.getElementById("popup");
    // search
    var searchinput = document.getElementById("searchinput");
    if(!!searchinput){
        searchinput.addEventListener("keydown", function(a){
            var key = a.keyCode;
            if(key == 13){
                var query = this.value;
                search(query);
            }
        });
    }

    // add bottom border to searchbar
    if(cfg_bool[0] && searchinput.style.borderBottomStyle != "solid"){
        searchinput.style.borderBottom = cfg[9] + " solid " + cfg[8];
    }

    // jump to search when tab is pressed
    var search_sqr = document.getElementById("search_sqr");

    document.addEventListener("keydown", function(a){
        var key = a.keyCode;
        if(key == 9){
            document.getElementById("searchinput").focus();
        }
        if([9].indexOf(key) > -1){
            a.preventDefault();
        }
    });

    // expand/contract search square when searchbar has focus or not
    var searchinput = document.getElementById("searchinput");

    searchinput.onfocus = function(){
        search_sqr.style.opacity = '1';
        search_sqr.style.height = "800px";                          //max heigth search when tab is pressed
        search_sqr.style.borderTop = cfg[9] + " solid " + cfg[8];
        search_sqr.style.borderBottom = cfg[9] + " solid " + cfg[8];
        search_sqr.removeEventListener("mouseout", contract, false);
    }

    searchinput.onblur = function(){
        search_sqr.style.opacity = '0.65';
        search_sqr.style.height = "330px";
        search_sqr.style.borderTop = "0 solid" + cfg[8];
        search_sqr.style.borderBottom = "0 solid" + cfg[8];
        search_sqr.addEventListener("mouseout", contract, false);
    }

    // select random image for the banner
    var banner = document.getElementById("banner");
    var imgCount = 30;
    var dir = 'img/banners/';
    var randomCount = Math.round(Math.random() * (imgCount - 1)) + 1;
    var banners = new Array
        banners[1] = "bnr01.gif",
        banners[2] = "bnr02.gif",
        banners[3] = "bnr03.gif",
        banners[4] = "bnr04.gif",
        banners[5] = "bnr05.gif",
        banners[6] = "bnr06.gif",
        banners[7] = "bnr07.gif",
        banners[8] = "bnr08.gif",
        banners[9] = "bnr09.gif",
        banners[10] = "bnr10.gif",
        banners[11] = "bnr11.gif",
        banners[12] = "bnr12.gif",
        banners[13] = "bnr13.gif",
        banners[14] = "bnr14.gif",
        banners[15] = "bnr15.gif",
        banners[16] = "bnr16.gif",
        banners[17] = "bnr17.gif",
        banners[18] = "bnr18.gif",
        banners[19] = "bnr19.gif",
        banners[20] = "bnr20.gif",
        banners[21] = "bnr21.gif",
        banners[22] = "bnr22.gif",
        banners[23] = "bnr23.gif",
        banners[24] = "bnr24.gif",
        banners[25] = "bnr25.gif",
        banners[26] = "bnr26.gif",
        banners[27] = "bnr27.gif",
        banners[28] = "bnr28.gif",
        banners[29] = "bnr29.gif",
        banners[30] = "bnr30.gif",
    banner.src = dir + banners[randomCount];

    // relocating the banner on mouseover
    function center(){
        banner.style.left= "calc(50% - 170px)";
    }
    var last= "left";
    function left(){
        banner.style.left= "calc(36% - 170px + 10px)";
        last= "left";
    }
    function right(){
        banner.style.left= "calc(64% - 170px - 10px)";
        last= "right"
    }
    function shortest(){
        if(last == "left"){
            banner.style.left= "calc(30% - 170px)";
        }else{
            banner.style.left= "calc(70% - 170px)";
        }
    }

    var sqr_center_left = document.getElementById("sqr_center_left");
    sqr_center_left.addEventListener("mouseover", right, false);
    sqr_center_left.addEventListener("mouseout", center, false);

    var sqr_center_right = document.getElementById("sqr_center_right");
    sqr_center_right.addEventListener("mouseover", left, false);
    sqr_center_right.addEventListener("mouseout", center, false);

    search_sqr.addEventListener("mouseover", shortest, false);
    search_sqr.addEventListener("mouseout", center, false);

    searchinput.addEventListener("focus", shortest, false);
    searchinput.addEventListener("blur", center, false);

    // adding event listeners to squares or expanding them onload
    var sqr = document.querySelectorAll(".sqr");
    if(!cfg_bool[1]){
        for(var i = 0; i < sqr.length; ++i){
            sqr[i].acount = sqr[i].getElementsByTagName("a").length;
            sqr[i].addEventListener("mouseover", expand, false);
            sqr[i].addEventListener("mouseout", contract, false);
        }
    }else{
        for(var i = 0; i < sqr.length; ++i){
            var a = 0;
            for(var x = 0; x < sqr.length; ++x){
                if(a < sqr[x].getElementsByTagName("a").length){
                    a = sqr[x].getElementsByTagName("a").length;
                }
            }
            sqr[i].style.height = 225 + 25*a + "px";
            if(cfg_bool[0]){
                sqr[i].style.borderTop = cfg[9] + " solid " + cfg[8];
                sqr[i].style.borderBottom = cfg[9] + " solid " + cfg[8];
            }
        }
    }
}


configmenuInit(main);
