/*
 *  PicUp it - core functions
 */
/*
 *
 *  credentialsGlobal - to store credentials to avoid calls from indexedDB
 */
var credentialsGlobal = {};
/*
 * Hides everything except topbar
 */
function hideAll() {
    $('#idHomePageView').hide();
    $('#idGalleryView').hide();
    $('#idPictureView').hide();
    $('#toolbarPicture').hide();
}
/*
 * Hides galleries on the homepage
 */
function hideHomeGalleries() {
    $('#picupGalleries').hide();
    $('#picupUsers').hide();
}
/*
 * Draws homepage
 * TODO: Actually it only shows, refactor
 */
function drawHomepage() {
    hideAll();
    $('#idHomePageView').show();
}
/*
 * Draws gallery with provided id
 */
function drawGallery(gallery) {
    console.log(gallery);
    $('#idGalleryTitle').html(gallery['title']);
    hideAll();
    $('#idGalleryView').show();
    var pictures = gallery['pictures'];
    $('#picupGalleryPictures').html('');
    $.map(pictures, function(elem, index) {
        console.log(elem);
        console.log(index % 4);
        // if (index%4==0) 
        // {
        $myLi = $("<li>", {
            class: 'picupImage'
        });
        // }
        var myId = "idPictureLink" + elem['id'];
        var $img = $("<img>", {
            src: "https://picup.it" + elem['thumb'],
            id: myId,
            val: elem['id'],
            class: "a",
            width: '24%'
        });
        //$('#picupGalleryPictures').append($img);
        $myLi.append($img);
        $('#picupGalleryPictures').append($myLi);
        $('#' + myId).click(function() {
            var picture = $(this).val();
            getPicture(picture);
        });
        // if (index%4==0) 
        // {
        // }
    })
}
/*
 * Draws user with provided id
 */
function drawUser(user) {
    console.log(user);
    console.log("implement me :)");
}
/*
 * Draws picture with provided id
 */
function drawPicture(picture) {
    console.log(picture);
    $('#picupPicture').attr('src', '');
    hideAll();
    $('#toolbarPicture').show();
    $('#idPictureView').show();
    $('#picupPicture').attr('src', 'https://picup.it' + picture['medium']);
    $('#idPicupDescription').html(picture['description']);
}
/*
 * Draws provided amount of galleries
 */
function drawGalleries(galleries, amount = 0) {
    console.log("drawGalleries");
    $.map(galleries, function(elem, index) {
        console.log(elem);
        if ((amount < 1) || (index <= amount)) {
            var myId = "idGalleryLink" + elem['id'];
            var $img = $("<img>", {
                src: "https://picup.it" + elem['thumb'],
                class: "a",
                id: myId,
                val: elem['id'],
                width: '24%'
            });
            $('#picupGalleries').append($img);
            $('#' + myId).click(function() {
                var gallery = $(this).val();
                getGallery(gallery);
            });
        };
    })
}
/*
 * Draws provided amount of users
 */
function drawUsers(users, amount = 0) {
    console.log("drawUsers");
    $.map(users, function(elem, index) {
        console.log(elem);
        if ((amount < 1) || (index <= amount)) {
            var $img = $("<img>", {
                src: "https://picup.it" + elem['thumb'],
                class: "a",
                width: '24%'
            });
            $('#picupUsers').append($img);
        }
    })
}
/*
 * Fetches picture from PicUp.It
 */
function getPicture(picture_id) {
    console.log('getPicture');
    var http = new XMLHttpRequest({
        mozSystem: true
    });
    var url = "https://picup.it/api/picture/" + picture_id + "/";
    http.open("GET", url, true);
    http.send(null);
    http.onreadystatechange = function() {
        console.log('onreadystatechange');
        if (http.readyState == 4 && ((http.status == 200))) {
            console.log('picture ok!');
            var data = $.parseJSON(http.responseText);
            var picture = data;
            //var users = data['users'];
            drawPicture(picture);
            //drawUsers(users,7);
        } else {
            console.log("status: " + http.status);
            console.log("resp: " + http.responseText);
            console.log("readyState: " + http.readyState);
        }
    };
    console.log('after onreadystatechange');
}
/*
 * Fetches gallery from PicUp.It
 */
function getGallery(gallery_id) {
    console.log('getGallery');
    var http = new XMLHttpRequest({
        mozSystem: true
    });
    var url = "https://picup.it/api/gallery/" + gallery_id + "";
    http.open("GET", url, true);
    http.send(null);
    http.onreadystatechange = function() {
        console.log('onreadystatechange');
        if (http.readyState == 4 && ((http.status == 200))) {
            console.log('gallery ok!');
            var data = $.parseJSON(http.responseText);
            var gallery = data;
            //var users = data['users'];
            drawGallery(gallery);
            //drawUsers(users,7);
        } else {
            console.log("status: " + http.status);
            console.log("resp: " + http.responseText);
            console.log("readyState: " + http.readyState);
        }
    };
    console.log('after onreadystatechange');
}
/*
 * Fetches galleries and users from PicUp.It
 */
function getBrowse() {
    console.log('getGalleries');
    var http = new XMLHttpRequest({
        mozSystem: true
    });
    var url = "https://picup.it/browse/?format=json";
    http.open("GET", url, true);
    http.send(null);
    http.onreadystatechange = function() {
        console.log('onreadystatechange');
        if (http.readyState == 4 && ((http.status == 200))) {
            console.log('galleries ok!');
            var data = $.parseJSON(http.responseText);
            var galleries = data['galleries'];
            var users = data['users'];
            drawGalleries(galleries, 7);
            drawUsers(users, 7);
        } else {
            console.log("status: " + http.status);
            console.log("resp: " + http.responseText);
            console.log("readyState: " + http.readyState);
        }
    };
    console.log('after onreadystatechange');
}