/**
 * Tools and Utilities for use in frontend and backend pages.
 *
 * @author Andreas Willems (dev.athyrion@gmail.com)
 * @version 07 MAY 2015
 */

(function() {
    // #### classes ####

    /*
     * A variety of custom errors, mainly for testing /debugging purposes.
     */
    function NotSupportedError(msg) {
        this.name = 'NotSupportedError';
        this.message = msg || 'Functionality not supported';
    }
    NotSupportedError.prototype = Error.prototype;

    function WrongTypeError(msg) {
        this.name = 'wrongTypeError';
        this.message = msg || 'Wrong type';
    }
    WrongTypeError.prototype = Error.prototype;

    function MissingURLError(msg) {
        this.name = 'MissingUrlError';
        this.message = msg || 'Missing Url';
    }
    MissingURLError.prototype = Error.prototype;

    function MissingCallbackError(msg) {
        this.name = 'MissingCallbackError';
        this.message = msg || 'Missing callback function';
    }
    MissingCallbackError.prototype = Error.prototype;


    /**
     * Provides an abstraction of the XMLHttpRequest object and helper methods.
     */
    function XHR() {
        this.request = new XMLHttpRequest();

        this.get = function(url, callback) {
            this.request.onreadystatechange = callback;
            this.request.open('GET', url, true);
            this.request.setRequestHeader(
                'Content-Type', 'application/json; charset=UTF-8'
            );
            this.request.send();
        };

        this.post = function(url, data, callback) {
            this.request.onreadystatechange = callback;
            this.request.open('POST', url, true);
            this.request.setRequestHeader(
                'Content-Type', 'application/json; charset=UTF-8'
            );
            this.request.send(JSON.stringify(data));
        };

        this.getReadyState = function() {
            return this.request.readyState;
        };

        this.getStatusCode = function() {
            return this.request.status;
        };

        this.getResponse = function() {
            return this.request.responseText;
        };
    }
    XHR.prototype = Object.prototype;



    /*
     * The object containing the public methods.
     */
    var awQuery = {

        /**
         * Traverses the DOM and tries to get an element
         * by the given id or classname.
         *
         * @param selector - the id (format: #id) or
         *                   classname (format: .classname)
         */
        findElement: function(selector) {
            var findElementById = function (elemId) {
                return document.getElementById(elemId);
            };

            var findElementByClass = function (className) {
                return document.getElementsByClassName(className);
            };

            if (typeof selector == 'string') {
                var selectorType = selector.substring(0, 1);
                if (selectorType == '#') {
                    return findElementById(selector.substring(1));
                } else if (selectorType == '.') {
                    return findElementByClass(selector.substring(1));
                } else {
                    throw new NotSupportedError('selector not supported');
                }
            } else {
                throw new WrongTypeError('selector is not a string');
            }
        },

        /**
         * Make an asynchronous AJAX request to the given url.
         *
         * @param url - the url to send the request to
         * @param options - options object to change the type of the request
         * @returns the response to the request as JSON
         */
        ajax: function(url, options, callback) {

            // check if a correct url is given
            if (typeof url !== 'string' || url == '') {
                throw new MissingURLError();
            }

            // check if callback function is given
            if (typeof callback !== 'function') {
                throw new MissingCallbackError();
            }

            var opts = options;
            // check if options are given
            if (typeof options !== 'object' || options == {} || options == null) {
                // define default values
                opts = {
                    'method': options.method || 'GET',
                    'requestHeaderName': 'Content-Type',
                    'requestHeaderValue': 'application/json',
                    'data': options.data || null
                };
            }

            // prepare XMLHttpRequest
            var xhr = new XHR();
            // send request depending on chosen method
            if (opts.method == 'GET') {
                xhr.get(url, function() {
                    if (xhr.getReadyState() == 4 && xhr.getStatusCode() == 200) {
                        callback(xhr.getResponse());
                    }
                });
            } else if (opts.method == 'POST') {
                xhr.post(url, opts.data, function() {
                    if (xhr.getReadyState() == 4 && xhr.getStatusCode() == 200) {
                        callback(xhr.getResponse());
                    } else {
                        callback(null);
                    }
                });
            }
        }
    };

    // TODO find another way to safely export the awQuery object
    // export awQuery object to the window
    window.awQuery = awQuery;
    // export method findElement to $ as a tribute to jQuery syntax
    window.$ = awQuery.findElement;

})();