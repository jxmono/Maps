// dependencies
var Jipics  = require ("jipics")
  , Application = require("../application")
  ;

/**
 * Init crud
 *
 */
setTimeout(function () {

    // get module field
    var module = Application.miids.crud.module;

    // dev version?
    if (module.substring(module.lastIndexOf("/") + 1) === "dev") {
        module += "_" + M.config.app.id;
    }

    // require that file to initialize the server events
    require(M.app.getPath() + "/mono_modules/" +  module + "/operations");

}, 3000);

/*
 *  This handles the image upload requests
 *
 * */
M.on("imageUpload", function (link) {

    // some validations
    if (!link.files || !link.files.inputImage || !link.files.inputImage.size) {
        return link.send(400, { error: "Invalid image upload" });
    }

    // get the image from the request
    var image = link.files.inputImage

        // get the application absolute path
      , appPath = M.app.getPath() + "/"

        // get the absolute path to the uploaded image
      , absoluteImagePath = appPath + image.path
      ;

    Jipics.upload ({
        path: absoluteImagePath
      , deleteAfterUpload: true
    }, function (err, data) {

        // handle error
        if (err) {
            return link.send (400, err);
        }

        // no image uploaded
        if (!data || !data.length) {
            return link.send (400, "No image uploaded.");
        }

        // send the url
        link.send (200, "http://jipics.net/?src=" + data[0]);
    });
});
