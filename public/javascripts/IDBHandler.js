/**
 * Implements methods to operate the client's indexedDB.
 *
 * @author Andreas Willems
 * @version 08 JUL 2015
 */
function IDBHandler(requestMethod) {

    var requestSession = requestMethod;
    var indexedDb;
    var sessionStore;
    var imageStore;

    /**
     * Handles errors.
     * @param caller - a name for the context
     * @param event - the event that occured
     */
    var errorHandler = function(caller, event) {
        console.log('Error in ' + caller);
        console.dir(event);
    };

    /**
     * Opens the indexedDB database.
     */
    this.openDB = function() {
        var openRequest = indexedDB.open('photoappdata');
        var self = this;

        openRequest.onupgradeneeded = function(event) {
            console.log("Upgrading...", event);
            indexedDb = event.target.result;
            sessionStore = indexedDb.createObjectStore(['sessionData']);
            imageStore = indexedDb.createObjectStore(['imageData']);

        };

        openRequest.onsuccess = function(evt) {
            console.log('Success...database '
                + evt.target.result.name
                + ' opened!');
            indexedDb = evt.target.result;
            self.getLastSessionFromIndexedDB();
        };

        openRequest.onerror = function(event) {
            errorHandler('openDb', event);
        };
    };

    /**
     * Handles the storing of sessionData into the client's indexedDB.
     * @param newData - the data to store
     * @param key - the object's field used as key
     */
    this.storeSessionDataInIndexedDB = function(newData, key) {
        var transaction = indexedDb.transaction(["sessionData"], "readwrite");
        transaction.oncomplete = function(event) {
            console.log('Transaction opened');
        };

        transaction.onerror = function(event) {
            errorHandler('transaction', event);
        };

        var objectStore = transaction.objectStore("sessionData");
        var objectStoreClearRequest = objectStore.clear();

        objectStoreClearRequest.onsuccess = function(event) {
            console.log('Data successfully cleared');
            var objectStoreAddRequest = objectStore.add(newData, key);
            objectStoreAddRequest.onsuccess = function(evt) {
                console.log('Data successfully stored');
                /*newData.images.forEach(function(image) {
                    getThumbnail(image);
                });*/
            };
            objectStoreAddRequest.onerror = function(event) {
                errorHandler('objectStoreAddRequest', event);
            };

        };

        objectStoreClearRequest.onerror = function(event) {
            errorHandler('objectStoreClearRequest', event);
        };
    };

    /**
     * Fetches the thumbnail with the given id and
     * passes it on to be stored in the indexedDB.
     * @param id - the image's id
     */
    var getThumbnail = function(id) {
        var xhr = new XMLHttpRequest();
        var blob;
        xhr.open('GET', '/api/thumbnails/' + id, true);
        xhr.responseType = 'blob';
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                console.log('Image retrieved');
                blob = xhr.response;
                console.log('Blob: ' + blob);
                //storeImageInIndexedDB(blob, id);
            }
        }, false);
        // Send XHR
        xhr.send();
    };

    /**
     * Handles the storing of images into the client's indexedDB.
     * @param image - the image to store
     * @param key - the object's field used as key
     */
    var storeImageInIndexedDB = function(image, key) {
        var transaction = indexedDb.transaction(["imageData"], "readwrite");

        transaction.oncomplete = function(event) {
            console.log('Transaction opened');
        };

        transaction.onerror = function(event) {
            errorHandler('transaction', event);
        };

        var imageStore = transaction.objectStore("imageData");
        var imageStoreRequest = imageStore.put(image, key);

        imageStoreRequest.onsuccess = function(event) {
            console.log('Image successfully stored');
        };

        imageStoreRequest.onerror = function(event) {
            errorHandler('objectStoreRequest', event);
        };
    };

    /**
     * Requests the last stored session from the indexedDB.
     */
    this.getLastSessionFromIndexedDB = function() {
        var lastSession;
        var transaction = indexedDb.transaction(["sessionData"], "readonly");
        var objectStore = transaction.objectStore("sessionData");
        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                lastSession = cursor.value;
                cursor.continue();
            } else {
                // in case a last session exists
                if (lastSession) {
                    requestSession(lastSession.sessionId);
                }
            }
        };
    };
}

