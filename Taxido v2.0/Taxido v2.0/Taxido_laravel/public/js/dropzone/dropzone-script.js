var DropzoneComponents = function () {
    var DropzoneDemos = function () {
        Dropzone.options.singleFileUpload = {
            paramName: "file",
            maxFiles: 1,
            maxFilesize: 5,
            accept: function(file, done) {
                //
            }
        };
        Dropzone.options.multiFileUpload = {
            paramName: "file",
            maxFiles: 10,
            maxFilesize: 10,
            accept: function(file, done) {
                //
            }
        };
        Dropzone.options.fileTypeValidation = {
            paramName: "file",
            maxFiles: 10,
            maxFilesize: 10, 
            acceptedFiles: "image/*,application/pdf,.psd",
            accept: function(file, done) {
                //
            }
        };
    }
    return {
        init: function() {
            DropzoneDemos();
        }
    };
}();