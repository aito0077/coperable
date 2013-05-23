(function($) {

    $(document).ready(function() {

        console.log("1");
        window.defaultMyImage =
            new MyImage({filename: 'preview.png',
                 data: '/static/javascripts/s3-upload/preview.png',
                 bucket: 'coperable-storage',
                 acl: 'public-read',
                 successActionRedirect: 'http://coperable.net/user/signup',
                 contentType: 'image/',
                 folder: '/',
                 AWSAccessKeyId: 'KEY',
                 AWSSecretKeyId: 'SECRET'
                });

        console.log("2");
        window.imagePreviewView = new ImagePreviewView({model: window.defaultMyImage});
        console.log("3");
        window.imageFileView = new ImageFileView({model: window.defaultMyImage});
        console.log("4");

        window.App = new window.ImageRouter();
        console.log("5");
        Backbone.history.start();
        console.log("6");
    });

})(jQuery);
