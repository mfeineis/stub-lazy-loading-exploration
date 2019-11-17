(function (window, NAME, SRC, stubs) {
    "use strict";

    if (window[NAME]) {
        return;
    }

    var document = window.document;
    var slice = [].slice;
    var buffer = {
        "replay": function () {
            for (var i = 0; i < buffer["calls"].length; i += 1) {
                var call = buffer["calls"][i];
                var parts = call[0].split(".");
                var fn = Lib;
                for (var j = 0; j < parts.length; j += 1) {
                    fn = fn[parts[j]];
                }
                fn.apply(null, call[1]);
            }
            buffer["calls"] = [];
        },
        "calls": [],
        "opts": null
    };

    var Lib = window[NAME] = {
        "__buffer": buffer,
        "getAccessToken": function () {
            return null;
        },
        "init": function (opts) {
            buffer["opts"] = opts;
        }
    };

    for (var i = 0; i < stubs.length; i += 1) {
        var stub = stubs[i];
        if (stub === "init") {
            continue;
        }

        var parts = stub.split(".");
        var what = parts.pop();
        var host = Lib;
        for (var j = 0; j < parts.length; j += 1) {
            if (!host[parts[j]]) {
                host[parts[j]] = {};
            }
            host = host[parts[j]];
        }

        host[what] = (function (fn) {
            return function stubbed() {
                buffer["calls"].push([fn, slice.call(arguments)]);
            };
        }(stub));
    }

    // Here you may adjust how your library code is being loaded
    var script = document.createElement("script");

    // |---X---<====(Y)Z===>---|
    // ^   ^   ^     ^ ^   ^- Content is ready
    // |   |   |     | *- Async script executes immediately after being loaded blocking the content
    // |   |   |     *- Deferred script code is done loading, stops the content loading and executes immediately
    // |   |   *- Content is being parsed and displayed
    // |   *- Deferred boot script added
    // *- User visits page
    // script.async = true;

    // |---X---<====(Y)====>--Z-|
    // ^   ^   ^     ^     ^  ^- Deferred script executes after static content is done
    // |   |   |     |     *- Content is ready
    // |   |   |     *- Deferred script code is done loading, execution is delayed until Z
    // |   |   *- Content is being parsed and displayed
    // |   *- Deferred boot script added
    // *- User visits page
    script.defer = true;

    // The seed code is plain ES3 so you may service clients with the appropriate
    // library format they support, maybe you want to roll out ES2019 code to modern
    // browsers but deliver a transpiled version for legacy clients? Just feature
    // detect here and adjust the url accordingly
    var featureDetectedSrc = SRC;

    // script.crossOrigin = "anonymous";
    script.src = featureDetectedSrc;

    var hostScript = document.getElementsByTagName("script")[0];
    hostScript.parentNode.insertBefore(script, hostScript);

}(window, "Acme", "./src/lib.js", ["AppEvents.logEvent", "getAccessToken", "init"]));