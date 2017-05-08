(function (window, className) {
    let Listener = function () {
        this.cache = [];
    };
    Listener.prototype = {

        add: function (fn) {
            this.cache.push(fn)
        },
        star: function () {
            this.cache.forEach((item, index) => {
                item();
            });
        }
    };

    let MImage = function (el) {
        this.el = el;
        this.top = 0;
    };

    MImage.prototype = {
        getTop: function () {
            let node = this.el;
            do {
                this.top+= node.offsetTop;
            }while (node = node.parentNode != 'BODY');
        },
        show: function () {

        }
    }

    function process (className, srcName) {
        let imgListener = new Listener();
        let images = [];
        let imagesNode = document.getElementsByClassName(className);

        function init () {
            imagesNode.forEach((img, index) => {
                images.push(new MImage(img));
            })
            images.forEach((img, index) => {
                img.getTop();
            })
        }
    }
})(window, className)