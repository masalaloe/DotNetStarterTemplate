/**
 * DevExtreme (ui/file_manager/file_provider/file_provider.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) {
                descriptor.writable = true
            }
            Object.defineProperty(target, descriptor.key, descriptor)
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) {
            defineProperties(Constructor.prototype, protoProps)
        }
        if (staticProps) {
            defineProperties(Constructor, staticProps)
        }
        return Constructor
    }
}();
var _data = require("../../../core/utils/data");
var _uiFile_manager = require("../ui.file_manager.utils");
var _common = require("../../../core/utils/common");
var _date_serialization = require("../../../core/utils/date_serialization");
var _iterator = require("../../../core/utils/iterator");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}
var DEFAULT_FILE_UPLOAD_CHUNK_SIZE = 2e5;
var FileProvider = function() {
    function FileProvider(options) {
        _classCallCheck(this, FileProvider);
        options = (0, _common.ensureDefined)(options, {});
        this._nameGetter = (0, _data.compileGetter)(this._getNameExpr(options));
        this._isDirGetter = (0, _data.compileGetter)(this._getIsDirExpr(options));
        this._sizeGetter = (0, _data.compileGetter)(options.sizeExpr || "size");
        this._dateModifiedGetter = (0, _data.compileGetter)(options.dateModifiedExpr || "dateModified");
        this._thumbnailGetter = (0, _data.compileGetter)(options.thumbnailExpr || "thumbnail")
    }
    _createClass(FileProvider, [{
        key: "getFolders",
        value: function(path) {
            return this.getItems(path, "folder")
        }
    }, {
        key: "getFiles",
        value: function(path) {
            return this.getItems(path, "file")
        }
    }, {
        key: "getItems",
        value: function(path, itemType) {
            return []
        }
    }, {
        key: "renameItem",
        value: function(item, name) {}
    }, {
        key: "createFolder",
        value: function(parentFolder, name) {}
    }, {
        key: "deleteItems",
        value: function(items) {}
    }, {
        key: "moveItems",
        value: function(items, destinationFolder) {}
    }, {
        key: "copyItems",
        value: function(items, destinationFolder) {}
    }, {
        key: "initiateFileUpload",
        value: function(uploadInfo) {}
    }, {
        key: "uploadFileChunk",
        value: function(uploadInfo, chunk) {}
    }, {
        key: "finalizeFileUpload",
        value: function(uploadInfo) {}
    }, {
        key: "abortFileUpload",
        value: function(uploadInfo) {}
    }, {
        key: "getFileUploadChunkSize",
        value: function() {
            return DEFAULT_FILE_UPLOAD_CHUNK_SIZE
        }
    }, {
        key: "_getItemsByType",
        value: function(path, folders) {
            return this.getItems(path).filter(function(item) {
                return item.isDirectory === folders
            })
        }
    }, {
        key: "_convertDataObjectsToFileItems",
        value: function(entries, path, itemType) {
            var _this = this;
            var useFolders = "folder" === itemType;
            var result = [];
            (0, _iterator.each)(entries, function(_, entry) {
                var fileItem = _this._createFileItem(entry, path);
                if (!itemType || fileItem.isDirectory === useFolders) {
                    result.push(fileItem)
                }
            });
            return result
        }
    }, {
        key: "_createFileItem",
        value: function(dataObj, path) {
            var fileItem = new FileManagerItem(path, this._nameGetter(dataObj), (!!this._isDirGetter(dataObj)));
            fileItem.size = this._sizeGetter(dataObj);
            if (void 0 === fileItem.size) {
                fileItem.size = 0
            }
            fileItem.dateModified = (0, _date_serialization.deserializeDate)(this._dateModifiedGetter(dataObj));
            if (void 0 === fileItem.dateModified) {
                fileItem.dateModified = new Date
            }
            if (fileItem.isDirectory) {
                fileItem.hasSubDirs = this._hasSubDirs(dataObj)
            }
            fileItem.thumbnail = this._thumbnailGetter(dataObj) || "";
            fileItem.dataItem = dataObj;
            return fileItem
        }
    }, {
        key: "_hasSubDirs",
        value: function(dataObj) {
            return true
        }
    }, {
        key: "_getNameExpr",
        value: function(options) {
            return options.nameExpr || "name"
        }
    }, {
        key: "_getIsDirExpr",
        value: function(options) {
            return options.isDirectoryExpr || "isDirectory"
        }
    }]);
    return FileProvider
}();
var FileManagerItem = function() {
    function FileManagerItem(parentPath, name, isDirectory) {
        _classCallCheck(this, FileManagerItem);
        this.parentPath = parentPath;
        this.name = name;
        this.relativeName = (0, _uiFile_manager.pathCombine)(this.parentPath, name);
        this.isDirectory = isDirectory || false;
        this.size = 0;
        this.dateModified = new Date;
        this.thumbnail = "";
        this.tooltipText = ""
    }
    _createClass(FileManagerItem, [{
        key: "getExtension",
        value: function() {
            return this.isDirectory ? "" : (0, _uiFile_manager.getFileExtension)(this.name)
        }
    }, {
        key: "getParent",
        value: function() {
            if (this.isRoot()) {
                return null
            }
            return new FileManagerItem((0, _uiFile_manager.getParentPath)(this.parentPath), (0, _uiFile_manager.getName)(this.parentPath), true)
        }
    }, {
        key: "isRoot",
        value: function() {
            return !this.relativeName
        }
    }, {
        key: "equals",
        value: function(item) {
            return item && this.relativeName === item.relativeName
        }
    }, {
        key: "createClone",
        value: function() {
            var result = new FileManagerItem(this.parentPath, this.name, this.isDirectory);
            result.size = this.size;
            result.dateModified = this.dateModified;
            result.thumbnail = this.thumbnail;
            result.tooltipText = this.tooltipText;
            result.hasSubDirs = this.hasSubDirs;
            result.dataItem = this.dataItem;
            return result
        }
    }]);
    return FileManagerItem
}();
module.exports.FileProvider = FileProvider;
module.exports.FileManagerItem = FileManagerItem;
