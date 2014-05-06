(function() {
    /*
     * Sandbox for now
     *
     */
    console.log("GALLERIES");
    getGalleries();
    alert('aaaa');
    $.get("https://picup.it/browse/?format=json", function(data) {
        alert(data);
    })
    console.log("SHARE ACTIVITY");
    // navigator.mozSetMessageHandler('activity', function(activityRequest) {
    //   var option = activityRequest.source;
    //   alert(option);
    //   if (option.name === "share") {
    //     // Do something to handle the activity
    //     alert('sharing');
    //     alert(option.data)
    //     // Send back the result
    //     if (picture) {
    //       activityRequest.postResult(picture);
    //     } else {
    //       activityRequest.postError("Unable to provide a picture");
    //     }
    //   }
    // });
})