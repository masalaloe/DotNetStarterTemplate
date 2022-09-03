/**
 * DevExtreme (core/utils/browser.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var extend = require("./extend").extend,
    windowUtils = require("./window"),
    navigator = windowUtils.getNavigator();
var webkitRegExp = /(webkit)[ \/]([\w.]+)/,
    ieRegExp = /(msie) (\d{1,2}\.\d)/,
    ie11RegExp = /(trident).*rv:(\d{1,2}\.\d)/,
    msEdge = /(edge)\/((\d+)?[\w.]+)/,
    safari = /(safari)/i,
    mozillaRegExp = /(mozilla)(?:.*? rv:([\w.]+))/;
var browserFromUA = function(ua) {
    ua = ua.toLowerCase();
    var result = {},
        matches = ieRegExp.exec(ua) || ie11RegExp.exec(ua) || msEdge.exec(ua) || ua.indexOf("compatible") < 0 && mozillaRegExp.exec(ua) || webkitRegExp.exec(ua) || [],
        browserName = matches[1],
        browserVersion = matches[2];
    if ("webkit" === browserName) {
        result.webkit = true;
        if (ua.indexOf("chrome") >= 0 || ua.indexOf("crios") >= 0) {
            browserName = "chrome";
            browserVersion = /(?:Chrome|CriOS)\/(\d+\.\d+)/i.exec(ua);
            browserVersion = browserVersion && browserVersion[1]
        } else {
            if (ua.indexOf("fxios") >= 0) {
                browserName = "mozilla";
                browserVersion = /FxiOS\/(\d+\.\d+)/i.exec(ua);
                browserVersion = browserVersion && browserVersion[1]
            } else {
                if (safari.exec(ua)) {
                    browserName = "safari";
                    browserVersion = /Version\/([0-9.]+)/i.exec(ua);
                    browserVersion = browserVersion && browserVersion[1]
                }
            }
        }
    }
    if ("trident" === browserName || "edge" === browserName) {
        browserName = "msie"
    }
    if (browserName) {
        result[browserName] = true;
        result.version = browserVersion
    }
    return result
};
module.exports = extend({
    _fromUA: browserFromUA
}, browserFromUA(navigator.userAgent));
