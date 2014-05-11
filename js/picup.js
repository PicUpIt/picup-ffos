/*
 *  PicUp it - core functions
 */
/*
 *
 *  credentialsGlobal - to store credentials to avoid calls from indexedDB
 */
var credentialsGlobal = {
    'email': '',
    'api_key': ''
};

function checkIfAppIsAuthorized() {
    if ((credentialsGlobal['email'] != '') && (credentialsGlobal['api_key'] != '')) return true;
    else return false;
}
/*
 * stores blob
 */
var currentImage;
/*
 * Hides everything except topbar
 */
function hideAll() {
    $('#idHomePageView').hide();
    $('#idGalleryView').hide();
    $('#idPictureView').hide();
    $('#toolbarPicture').hide();
    $('#uploadPageView').hide();
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
        $('#picupGalleries').show();
    $('#picupUsers').show();
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
function drawGalleries(galleries, amount=0) {
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

function scheduleBanner() {
  window.setTimeout(function() {
    document.getElementById("upload-banner").hidden = true;
  }, 4000);
}

function showBanner() {
    console.log("showBanner");
  document.getElementById("upload-banner").hidden = false;
  scheduleBanner();
}

function picupUpload(file) {
    console.log(picupUpload);
    console.log(file);
    var fd = new FormData();
    fd.append("picture", file); // Append the file
    //fd.append("type", "file"); // Append the file
    fd.append("api_key", credentialsGlobal['api_key']);
    fd.append("email", credentialsGlobal['email']);
    var url = "https://picup.it/api/upload/";
    console.log(fd);
    // Create the XHR (Cross-Domain XHR FTW!!!)
    //var xhr = new XMLHttpRequest();
    var xhr = new XMLHttpRequest({
                    mozSystem: true
    });
    xhr.open("POST", url); // Boooom!
    xhr.onload = function() {
        console.log('// Big win!');
        // The URL of the image is:
        console.log(xhr.responseText);
        var response = JSON.parse(xhr.responseText);
        console.log(response);
        showBanner();
        getPicture(response['data']['id']);
        // if (response.success) {
        //    // console.log("image sharing succeeded");

        //     console.log("url", response.data);
        //     //inCallback(null, response);
        // } else {
        //     console.log(response);
        //     //inCallback(response, null);
        // }
    }

    // xhr.onreadystatechange = function() {
    //   console.log(xhr.status);
    //                 console.log(xhr.responseText);
    //                 console.log(xhr.readyState);
    // }

    xhr.send(fd);
}