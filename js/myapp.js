(function() {
    /*
     * PicUp It Image Uploader for FirefoxOS
     * https://picup.it/
     * author: bluszcz@bluszcz.net
     */
    var db;
    /*
     * Initialization of the indexedDB
     */
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    if (!window.indexedDB) {
        window.alert("Your browser doesn't support a stable version of IndexedDB.");
    }
    var openRequest = indexedDB.open("PicUp.it.database", 1);
    var logged = {
        'email': false,
        'api_key': false
    }
    /*
     * TODO: should be moved to homepage.js
     * TODO: maybe remove or rewrite
     */
    $('#homepage').click(function() {
        drawHomepage();
    })
    $('#showGallery').click(function() {
        console.log("showGallery");
        hideAll();
        $('#idGalleryView').show();
    })
    /*
     * pickImage() function has been copy pasted from:
     * https://github.com/soapdog/firefoxos-sample-app-image-uploader
     * This function is called by the "Pick Image" button in the main screen.
     * It calls a "pick" web activity to fetch an image.
     *
     *
     * More information about web activities in:
     *
     * https://hacks.mozilla.org/2013/01/introducing-web-activities/
     *
     */
    function pickImage() {
        // Use the 'pick' activity to acquire an image
        var pick = new MozActivity({
            name: "pick",
            data: {
                type: ["image/jpeg", "image/png", "image/jpg"]
            }
        });
        pick.onsuccess = function() {
            // Pick the returned image blob and upload to picup
            //var img = document.createElement("img");
            var img = document.querySelector("#imageSelected")
            img.src = window.URL.createObjectURL(this.result.blob);
            // Present that image in your app, so it looks cool.
            //var imagePresenter = document.querySelector("#image-presenter");
            $('#image-presenter').show();
            //imagePresenter.innerHTML = "";
            //imagePresenter.appendChild(img);
            //console.log(imagePresenter);
            //alert(imagePresenter);
            hideHomeGalleries();
            // Check connection before upload.
            var connection = window.navigator.mozConnection;
            if (connection.bandwidth === 0) {
                alert("Please connect to the internet to upload images to PicUp.It");
                return;
            }
            document.querySelector("#upload").classList.remove("hidden");
            if (checkIfAppIsAuthorized()) {
                //var username = data.config.username;
                console.log("Changing label to " + username);
                document.querySelector("#username").innerHTML = username;
                document.querySelector("#upload_user").classList.remove("hidden");
            }
            currentImage = this.result.blob;
        };
        pick.onerror = function() {
            // If an error occurred or the user canceled the activity
            alert("Can't view the image!");
        };
    }
    document.querySelector("#pick").addEventListener("click", pickImage);
    /* 
     * Hides loging - checking if user is logged in first place
     */
    function hideLogin() {
        if ((logged['email'] == true) && (logged['api_key'] == true)) {
            console.log("hiding login button");
            $('#login').hide();
            $('#loginArea').hide();
            $('#picupDeerBox').show();
        } else {
            console.log("NOT hiding login button");
        }
    }
    /* 
     * gets email from indexedDB
     */
    function getApiEmail() {
        var objectStore = db.transaction(["data"], "readwrite").objectStore("data");
        var request = objectStore.get("email");
        request.onerror = function(event) {
            console.log("no email");
        };
        request.onsuccess = function(event) {
            if (request.result.myValue != '') {
                logged['email'] = true;
                hideLogin();
            } else {
                console.log("found myValue but empty");
            }
            console.log("Email is " + request.result.myValue);
        };
    }
    /* 
     * gets api_key from indexedDB
     */
    function getApiApi() {
        var objectStore = db.transaction(["data"], "readwrite").objectStore("data");
        var request_api = objectStore.get("api_key");
        request_api.onerror = function(event) {
            console.log("no api");
        };
        request_api.onsuccess = function(event) {
            if (request_api.result.myValue != '') {
                logged['api_key'] = true;
                hideLogin();
            } else {
                console.log("found myValue but empty");
            }
            console.log("API is " + request_api.result.myValue);
        };
    }
    /* 
     * gets both
     */
    function getApiCredentials() {
        console.log("getApiCredentials");
        getApiEmail();
        getApiApi();
    }
    /*
     * inserts email
     */
    function insertApiEmail(personaResponse) {
        var objectStore = db.transaction(["data"], "readwrite").objectStore("data");
        console.log(objectStore);
        var request = objectStore.get("email");
        request.onsuccess = function(event) {
            var data = request.result;
            console.log("DATA BELOW");
            console.log(data);
            //console.log(personaResponse['email']);
            if (personaResponse['email'] != '') {
                if (typeof data === "undefined") {
                    console.log("adding email because undefined");
                    req = objectStore.add({
                        'myKey': 'email',
                        'myValue': personaResponse['email']
                    });
                    req.onerror = function(event) {
                        console.log('undefined add failed also :/');
                    }
                    req.onsuccess = function(event) {
                        console.log('undefined add worked out :)');
                    }
                } else {
                    data.myValue = personaResponse['email'];
                    var requestUpdate = objectStore.put(data);
                    requestUpdate.onerror = function(event) {
                        alert('could not update email');
                    };
                    requestUpdate.onsuccess = function(event) {
                        console.log('email update ok');
                    };
                }
            }
        }
        request.onerror = function(event) {
            console.log("adding email");
            req = objectStore.add({
                'myKey': 'email',
                'myValue': personaResponse['email']
            });
        }
    }
    /*
     * inserts api_key
     */
    function insertApiApi(personaResponse) {
        var objectStoreApi = db.transaction(["data"], "readwrite").objectStore("data");
        console.log(objectStoreApi);
        var request_api_key = objectStoreApi.get("api_key");
        request_api_key.onsuccess = function(event) {
            var data = request_api_key.result;
            console.log("DATA API BELOW");
            console.log(data);
            if (personaResponse['api_key'] != '') {
                if (typeof data === "undefined") {
                    console.log("adding api_key because undefined");
                    req = objectStoreApi.add({
                        'myKey': 'api_key',
                        'myValue': personaResponse['api_key']
                    });
                } else {
                    data.myValue = personaResponse['api_key'];
                    var requestUpdateAPI = objectStoreApi.put(data);
                    requestUpdateAPI.onerror = function(event) {
                        alert('could not update api_key');
                    };
                    requestUpdateAPI.onsuccess = function(event) {
                        console.log('api update ok');
                    };
                }
            }
        }
        request_api_key.onerror = function(event) {
            console.log("adding api_key");
            req_api_key = objectStoreApi.add({
                'myKey': 'api_key',
                'myValue': personaResponse['api_key']
            });
        };
    }
    /*
     * inserts credentials - parsed from persona respone JSON
     */
    function insertApiCredentials(personaResponse) {
        personaResponse = $.parseJSON(personaResponse);
        console.log(personaResponse);
        console.log("insertApiCredentials");
        var req;
        insertApiApi(personaResponse);
        insertApiEmail(personaResponse);
    };
    // Some experiments
    // try {
    //   req = objectStore.add({'myKey':'email', 'myValue':personaResponse['email']});
    //   req = objectStore.add({'myKey':'api_key', 'myValue':personaResponse['api_key']});
    // } catch (e) {
    //   if (e.name == 'DataCloneError')
    //     displayActionFailure("This engine doesn't know how to clone a Blob, " +
    //      "use Firefox");
    //   throw e;
    // }
    $('#loginPicup').click(function() {
        //getAPICredentials();
    })
    openRequest.onerror = function(event) {
        alert("indexedDB error");
    };
    openRequest.onsuccess = function(event) {
        console.log("indexedDB OK");
        console.log("indexedDB OK");
        db = this.result;
        getApiCredentials();
    };
    openRequest.onupgradeneeded = function(event) {
        console.log("onupgradeneeded");
        var db = event.target.result;
        var objectStore = db.createObjectStore("data", {
            keyPath: "myKey"
        });
        objectStore.createIndex("myKey", "myKey", {
            unique: true
        });
        objectStore.createIndex("myValue", "myValue", {
            unique: true
        });
        console.log("onupgradeneeded done");
    };
  
    /*
    * Authentication trough Persona
    * Takes assertion from Persona to further pass to PicUp
    */

    window.addEventListener("DOMContentLoaded", function() {
        navigator.id.watch({
            // Provide a hint to Persona: who do you think is logged in?
            loggedInUser: null,
            // Called when persona provides you an identity assertion
            // after a successful request().  You *must* post the assertion
            // to your server for verification.  Never verify assertions
            // in client code.  See Step 3 in this document:
            // https://developer.mozilla.org/en/Persona/Quick_Setup
            onlogin: function(assertion) {
                var http = new XMLHttpRequest({
                    mozSystem: true
                });
                //http.withCredentials = true;
                var url = "https://picup.it/mobile/persona/?next=ffosdata&xml";
                var params = "assertion=" + assertion;
                console.log(assertion);
                http.open("POST", url, true);
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                http.setRequestHeader("Content-length", params.length);
                http.setRequestHeader("Connection", "close");
                http.onreadystatechange = function() {
                    console.log(http.status);
                    console.log(http.responseText);
                    console.log(http.readyState);
                    // var xhr = new XMLHttpRequest({ mozSystem: true });
                    // xhr.withCredentials = true;
                    // xhr.onload = function(e) 
                    // {
                    //  if (xhr.status === 200 || xhr.status === 0) 
                    //  {
                    //      //alert('ok2');
                    //      //alert(xhr.responseText);
                    //    } 
                    //    else 
                    //    {
                    //    };
                    //  }
                    //xhr.open('GET', 'https://picup.it/mobile/data/?callback=ffos', true);
                    //xhr.send();
                    if (http.readyState == 4 && ((http.status == 200) || (http.status == 302))) {
                        console.log('got som');
                        console.log(http.responseText);
                        insertApiCredentials(http.responseText);
                    } else {
                        //alert('This aert bad');
                        console.log(http.status);
                        console.log(http.responseText);
                        console.log(http.readyState);
                    }
                }
                http.send(params);
                var http_data = new XMLHttpRequest({
                    mozSystem: true
                });
                http_data.withCredentials = true;
                var url = "https://picup.it/mobile/data/";
                // do somthing with assertion ...
                // Note that Persona will also call this function automatically
                // if a previously-signed-in user visits your page again.
            },
            onlogout: function() {
                // handle logout ...
            },
            onready: function() {
                // Your signal that Persona's state- and callback-management
                // business is complete.  Enable signin buttons etc.
            }
        });
        // Set up click handlers for your buttons
        document.getElementById("login").addEventListener('click', function() {
            $('#login').hide();
            $('#loginProgress').show();
            navigator.id.request({
                // optional callback to request so you can respond to
                // a user canceling the sign-in flow 
                oncancel: function() { /* do something */ }
            });
        })
    })
    var xhr = new XMLHttpRequest({
        mozSystem: true
    });
    var signinLink = document.getElementById('login');
    /*
     * This is totally messed up. :/
     * Idea was to use this part to set image from PicUp as wallpaper and so.
     * https://bugzilla.mozilla.org/show_bug.cgi?id=993321
     * TODO: move it away until bug will be fixed or I will know a proper way to
     * handle such case.
     */
    $('#sharePicture').click(function() {
        var x = new XMLHttpRequest({
            mozSystem: true
        });
        x.open('GET', $('#picupPicture').attr('src'));
        x.responseType = 'blob';
        x.send(null);
        x.onload = function() {
            console.log(x.response);
            cos = x.response;
            var activity = new MozActivity({
                name: "share",
                number: 1,
                blobs: [cos],
                filenames: ['imie.jpg'],
                filepaths: [],
                data: {
                    type: ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/bmp"],
                }
            });
            activity.blob = x.response;
            activity.onsuccess = function() {
                //var picture = this.result;
                //postResult(answer);
                console.log("A picture has been retrieved");
            };
            activity.onerror = function() {
                console.log(this.error);
            };
        }
    });
    //var pickImage = document.querySelector("#getpicture");
})();