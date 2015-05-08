'use strict';

hw2.define([
    'hw2!{PATH_JS_LIB}uri/include.js',
    // fragmentURI already includes URI.js
    //'hw2!{PATH_JS_LIB}uri/modules/URI.js',
    //'hw2!{PATH_JS_LIB}uri/modules/URI.fragmentQuery.js',
    'hw2!{PATH_JS_LIB}uri/modules/URI.fragmentURI.js',
    'hw2!{PATH_JS_LIB}uri/modules/URITemplate.js'
], function (inc, URI) {
    var $ = this;

    return $.Uri = $.Class({base: URI, members: [
            /**
             * Public
             */
            {
                a: "public", n: "__construct", v: function (url, resolving) {
                    this.i.href(url);
                }
            }
        ]}
    );
}); 