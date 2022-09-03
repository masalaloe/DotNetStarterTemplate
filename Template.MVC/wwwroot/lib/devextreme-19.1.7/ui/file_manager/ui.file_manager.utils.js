/**
 * DevExtreme (ui/file_manager/ui.file_manager.utils.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _iterator = require("../../core/utils/iterator");
var PATH_SEPARATOR = "/";
var getFileExtension = function(path) {
    var index = path.lastIndexOf(".");
    return index !== -1 ? path.substr(index) : ""
};
var getName = function(path) {
    var index = path.lastIndexOf(PATH_SEPARATOR);
    return index !== -1 ? path.substr(index + PATH_SEPARATOR.length) : path
};
var getParentPath = function(path) {
    var index = path.lastIndexOf(PATH_SEPARATOR);
    return index !== -1 ? path.substr(0, index) : ""
};
var getPathParts = function(path, includeFullPath) {
    var result = path.split(PATH_SEPARATOR);
    if (includeFullPath) {
        for (var i = 0; i < result.length; i++) {
            result[i] = pathCombine(0 === i ? "" : result[i - 1], result[i])
        }
    }
    return result
};
var pathCombine = function() {
    var result = "";
    (0, _iterator.each)(arguments, function(_, arg) {
        if (arg) {
            if (result) {
                result += PATH_SEPARATOR
            }
            result += arg
        }
    });
    return result
};
var getDisplayFileSize = function(byteSize) {
    var sizesTitles = ["B", "KB", "MB", "GB", "TB"];
    var index = 0;
    var displaySize = byteSize;
    while (displaySize >= 1024 && index <= sizesTitles.length - 1) {
        displaySize /= 1024;
        index++
    }
    displaySize = Math.round(10 * displaySize) / 10;
    return displaySize + " " + sizesTitles[index]
};
module.exports.getFileExtension = getFileExtension;
module.exports.getName = getName;
module.exports.getParentPath = getParentPath;
module.exports.getPathParts = getPathParts;
module.exports.pathCombine = pathCombine;
module.exports.getDisplayFileSize = getDisplayFileSize;
