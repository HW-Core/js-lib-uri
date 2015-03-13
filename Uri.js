/*
 * Copyright (C) 2007 - 2014 Hyperweb2 All rights reserved.
 * GNU General Public License version 3; see www.hyperweb2.com/terms/
 */

'use strict';

hw2.define([
    'hw2!PATH_JS_LIB:uri/include.js'
], function () {
    var $ = this;
    return $.Uri = $.Class({members: [
            /**
             * Private
             */
            {attributes: "private", name: "url", val: null},
            {attributes: "private", name: "parsedUrl", val: null},
            {attributes: "private", name: "parsedQuery", val: null},
            /**
             * Public
             */
            {attributes: "public", name: "__construct", val: function (url, parseFragment) {
                    if (typeof url !== "string")
                        throw new Error("Url must be a string!");

                    this._i.url = url;

                    this._i.parsedUrl = this.s.parseUrl(url);
                    this._i.parsedQuery = this.s.parseQuery(this._i.parsedUrl.query);

                    // useful with single page apps
                    if (parseFragment) {
                        this._i.parsedUrl.fragment = new $.Uri(this._i.parsedUrl.fragment,false);
                    }
                }
            },
            {attributes: "public", name: "toString", val: function () {
                    return this._i.url;
                }
            },
            {attributes: "public", name: "getFragment", val: function () {
                    return this.i.getParsedUrl().fragment;
                }
            },
            {attributes: "public", name: "getParsedUrl", val: function () {
                    return this._i.parsedUrl;
                }
            },
            {attributes: "public", name: "getParsedQuery", val: function () {
                    return this._i.parsedQuery;
                }
            },
            {attributes: "public", name: "getParam", val: function (key) {
                    return this.i.parsedQuery[key];
                }
            },
            {attributes: ["public", "static"], name: "parseQuery", val: function (query) {
                    if (!query)
                        return null;

                    var query_string = {};

                    var vars = query.split("&");
                    for (var i = 0; i < vars.length; i++) {
                        var pair = vars[i].split("=");
                        // If first entry with this name
                        if (typeof query_string[pair[0]] === "undefined") {
                            query_string[pair[0]] = pair[1];
                            // If second entry with this name
                        } else if (typeof query_string[pair[0]] === "string") {
                            var arr = [query_string[pair[0]], pair[1]];
                            query_string[pair[0]] = arr;
                            // If third or later entry with this name
                        } else {
                            query_string[pair[0]].push(pair[1]);
                        }
                    }

                    return query_string;
                }
            },
            // from: http://phpjs.org/functions/parse_url/
            // note: Does not replace invalid characters with '_' as in PHP, nor does it return false with
            // a seriously malformed URL.
            // Besides function name, is essentially the same as parseUri as well as our allowing
            // an extra slash after the scheme/protocol (to allow file:/// as in PHP)
            // 
            // example 1: parseUrl('http://username:password@hostname/path?arg=value#anchor');
            // returns 1: {scheme: 'http', host: 'hostname', user: 'username', pass: 'password', path: '/path', query: 'arg=value', fragment: 'anchor'}
            {attributes: ["public", "static"], name: "parseUrl", val: function (str, mode, component, queryKey) {
                    var query, key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
                        'relative', 'path', 'directory', 'file', 'query', 'fragment'
                    ],
                            parser = {
                                php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                                // Added one optional slash to post-scheme to catch file:/// (should restrict this)
                                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                            };

                    mode = mode || 'php';

                    var m = parser[mode].exec(str),
                            uri = {},
                            i = 14;
                    while (i--) {
                        if (m[i]) {
                            uri[key[i]] = m[i];
                        }
                    }

                    if (component) {
                        return uri[component.replace('PHP_URL_', '')
                                .toLowerCase()];
                    }

                    if (mode !== 'php') {
                        var name = queryKey || 'queryKey';
                        parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
                        uri[name] = {};
                        query = uri[key[12]] || '';
                        query.replace(parser, function ($0, $1, $2) {
                            if ($1) {
                                uri[name][$1] = $2;
                            }
                        });
                    }
                    delete uri.source;
                    return uri;
                }
            }
        ]}
    );
}); 