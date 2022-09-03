/**
 * DevExtreme (ui/file_manager/file_provider/onedrive.js)
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
var _ajax = require("../../../core/utils/ajax");
var _ajax2 = _interopRequireDefault(_ajax);
var _deferred = require("../../../core/utils/deferred");
var _common = require("../../../core/utils/common");
var _file_provider = require("./file_provider");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return call && ("object" === typeof call || "function" === typeof call) ? call : self
}

function _inherits(subClass, superClass) {
    if ("function" !== typeof superClass && null !== superClass) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass)
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) {
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass
    }
}
var REQUIRED_ITEM_FIELDS = "id,name,folder,lastModifiedDateTime,size,parentReference";
var REST_API_URL = "https://graph.microsoft.com/";
var DRIVE_API_URL = REST_API_URL + "v1.0/drive";
var APP_ROOT_URL = DRIVE_API_URL + "/special/approot";
var OneDriveFileProvider = function(_FileProvider) {
    _inherits(OneDriveFileProvider, _FileProvider);

    function OneDriveFileProvider(options) {
        _classCallCheck(this, OneDriveFileProvider);
        options = options || {};
        options.dateModifiedExpr = "lastModifiedDateTime";
        options.isDirectoryExpr = "folder";
        var _this = _possibleConstructorReturn(this, (OneDriveFileProvider.__proto__ || Object.getPrototypeOf(OneDriveFileProvider)).call(this, options));
        _this._getAccessTokenUrl = options.getAccessTokenUrl || "";
        _this._accessToken = "";
        _this._accessTokenPromise = null;
        return _this
    }
    _createClass(OneDriveFileProvider, [{
        key: "getItems",
        value: function(path, itemType) {
            return this._getItems(path, itemType)
        }
    }, {
        key: "initiateFileUpload",
        value: function(uploadInfo) {
            var _this2 = this;
            var folderPath = uploadInfo.destinationFolder.relativeName;
            var fileName = uploadInfo.file.name;
            var customData = uploadInfo.customData;
            return this._ensureAccessTokenAcquired().then(function() {
                return _this2._createFile(folderPath, fileName)
            }).then(function(entry) {
                return _this2._initiateUploadSession(entry.id).done(function(info) {
                    customData.uploadUrl = info.uploadUrl
                })
            })
        }
    }, {
        key: "uploadFileChunk",
        value: function(_ref, _ref2) {
            var customData = _ref.customData,
                uploadedBytesCount = _ref.uploadedBytesCount,
                file = _ref.file;
            var blob = _ref2.blob,
                size = _ref2.size;
            return this._uploadFileChunk(customData.uploadUrl, blob, size, uploadedBytesCount, file.size)
        }
    }, {
        key: "abortFileUpload",
        value: function(uploadInfo) {
            var _this3 = this;
            return this._ensureAccessTokenAcquired().then(function() {
                return _this3._cancelUploadSession(uploadInfo.customData.uploadUrl)
            })
        }
    }, {
        key: "_getItems",
        value: function(path, itemType) {
            var _this4 = this;
            return this._ensureAccessTokenAcquired().then(function() {
                return _this4._getEntriesByPath(path)
            }).then(function(entries) {
                return _this4._convertDataObjectsToFileItems(entries.children, path, itemType)
            })
        }
    }, {
        key: "_ensureAccessTokenAcquired",
        value: function() {
            var _this5 = this;
            if (this._accessTokenPromise) {
                return this._accessTokenPromise
            }
            var deferred = new _deferred.Deferred;
            if (this._accessToken) {
                deferred.resolve()
            } else {
                _ajax2.default.sendRequest({
                    url: this._getAccessTokenUrl,
                    dataType: "json"
                }).done(function(_ref3) {
                    var token = _ref3.token;
                    _this5._accessToken = token;
                    _this5._accessTokenPromise = null;
                    deferred.resolve()
                })
            }
            this._accessTokenPromise = deferred.promise();
            return this._accessTokenPromise
        }
    }, {
        key: "_getEntriesByPath",
        value: function(path) {
            var itemPath = this._prepareItemRelativePath(path);
            var queryString = "?$select=" + REQUIRED_ITEM_FIELDS + "&$expand=children($select=" + REQUIRED_ITEM_FIELDS + ")";
            var url = APP_ROOT_URL + itemPath + queryString;
            return _ajax2.default.sendRequest({
                url: url,
                dataType: "json",
                cache: false,
                headers: {
                    Authorization: this._authorizationString
                }
            })
        }
    }, {
        key: "_uploadFileChunk",
        value: function(uploadUrl, chunkBlob, chunkSize, uploadedSize, totalSize) {
            var chunkEndPosition = uploadedSize + chunkSize - 1;
            var contentRange = "bytes " + uploadedSize + "-" + chunkEndPosition + "/" + totalSize;
            return _ajax2.default.sendRequest({
                url: uploadUrl,
                method: "PUT",
                dataType: "json",
                data: chunkBlob,
                upload: {
                    onprogress: _common.noop,
                    onloadstart: _common.noop,
                    onabort: _common.noop
                },
                cache: false,
                headers: {
                    Authorization: this._authorizationString,
                    "Content-Range": contentRange
                }
            })
        }
    }, {
        key: "_initiateUploadSession",
        value: function(fileId) {
            var url = DRIVE_API_URL + "/items/" + fileId + "/createUploadSession";
            return _ajax2.default.sendRequest({
                url: url,
                method: "POST",
                dataType: "json",
                cache: false,
                headers: {
                    Authorization: this._authorizationString
                }
            })
        }
    }, {
        key: "_createFile",
        value: function(folderPath, objectName) {
            var itemPath = this._prepareItemRelativePath(folderPath);
            var queryString = "?$select=" + REQUIRED_ITEM_FIELDS;
            var url = APP_ROOT_URL + itemPath + "/children" + queryString;
            var params = {
                name: objectName,
                file: {},
                "@microsoft.graph.conflictBehavior": "rename"
            };
            var data = JSON.stringify(params);
            return _ajax2.default.sendRequest({
                url: url,
                method: "POST",
                dataType: "json",
                data: data,
                cache: false,
                headers: {
                    Authorization: this._authorizationString,
                    "Content-Type": "application/json"
                }
            })
        }
    }, {
        key: "_cancelUploadSession",
        value: function(uploadUrl) {
            return _ajax2.default.sendRequest({
                url: uploadUrl,
                method: "DELETE",
                dataType: "json",
                cache: false,
                headers: {
                    Authorization: this._authorizationString
                }
            })
        }
    }, {
        key: "_prepareItemRelativePath",
        value: function(path) {
            return "" === path ? "" : ":/" + path + ":"
        }
    }, {
        key: "_hasSubDirs",
        value: function(dataObj) {
            return Object.prototype.hasOwnProperty.call(dataObj, "folder") && dataObj.folder.childCount > 0
        }
    }, {
        key: "_authorizationString",
        get: function() {
            return "Bearer " + this._accessToken
        }
    }]);
    return OneDriveFileProvider
}(_file_provider.FileProvider);
module.exports = OneDriveFileProvider;
