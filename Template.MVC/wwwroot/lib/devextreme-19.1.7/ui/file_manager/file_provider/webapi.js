/**
 * DevExtreme (ui/file_manager/file_provider/webapi.js)
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
var _common = require("../../../core/utils/common");
var _guid = require("../../../core/guid");
var _guid2 = _interopRequireDefault(_guid);
var _window = require("../../../core/utils/window");
var _iterator = require("../../../core/utils/iterator");
var _deferred = require("../../../core/utils/deferred");
var _file_provider = require("./file_provider");
var _data = require("../../../core/utils/data");

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
var window = (0, _window.getWindow)();
var FILE_CHUNK_BLOB_NAME = "chunk";
var WebApiFileProvider = function(_FileProvider) {
    _inherits(WebApiFileProvider, _FileProvider);

    function WebApiFileProvider(options) {
        _classCallCheck(this, WebApiFileProvider);
        options = (0, _common.ensureDefined)(options, {});
        var _this = _possibleConstructorReturn(this, (WebApiFileProvider.__proto__ || Object.getPrototypeOf(WebApiFileProvider)).call(this, options));
        _this._endpointUrl = options.endpointUrl;
        _this._hasSubDirsGetter = (0, _data.compileGetter)(options.hasSubDirectoriesExpr || "hasSubDirectories");
        return _this
    }
    _createClass(WebApiFileProvider, [{
        key: "getItems",
        value: function(path, itemType) {
            return this._getItems(path, itemType)
        }
    }, {
        key: "renameItem",
        value: function(item, name) {
            return this._executeRequest("Rename", {
                id: item.relativeName,
                name: name
            })
        }
    }, {
        key: "createFolder",
        value: function(parentFolder, name) {
            return this._executeRequest("CreateDir", {
                parentId: parentFolder.relativeName,
                name: name
            })
        }
    }, {
        key: "deleteItems",
        value: function(items) {
            var _this2 = this;
            return items.map(function(item) {
                return _this2._executeRequest("Remove", {
                    id: item.relativeName
                })
            })
        }
    }, {
        key: "moveItems",
        value: function(items, destinationFolder) {
            var _this3 = this;
            return items.map(function(item) {
                return _this3._executeRequest("Move", {
                    sourceId: item.relativeName,
                    destinationId: destinationFolder.relativeName + "/" + item.name
                })
            })
        }
    }, {
        key: "copyItems",
        value: function(items, destinationFolder) {
            var _this4 = this;
            return items.map(function(item) {
                return _this4._executeRequest("Copy", {
                    sourceId: item.relativeName,
                    destinationId: destinationFolder.relativeName + "/" + item.name
                })
            })
        }
    }, {
        key: "initiateFileUpload",
        value: function(uploadInfo) {
            uploadInfo.customData.uploadId = new _guid2.default
        }
    }, {
        key: "uploadFileChunk",
        value: function(uploadInfo, chunk) {
            var args = {
                destinationId: uploadInfo.destinationFolder.relativeName,
                chunkMetadata: JSON.stringify({
                    UploadId: uploadInfo.customData.uploadId,
                    FileName: uploadInfo.file.name,
                    Index: chunk.index,
                    TotalCount: uploadInfo.totalChunkCount,
                    FileSize: uploadInfo.file.size
                })
            };
            var formData = new window.FormData;
            formData.append(FILE_CHUNK_BLOB_NAME, chunk.blob);
            formData.append("arguments", JSON.stringify(args));
            formData.append("command", "UploadChunk");
            var deferred = new _deferred.Deferred;
            _ajax2.default.sendRequest({
                url: this._endpointUrl,
                method: "POST",
                dataType: "json",
                data: formData,
                upload: {
                    onprogress: _common.noop,
                    onloadstart: _common.noop,
                    onabort: _common.noop
                },
                cache: false
            }).then(function(result) {
                !result.success && deferred.reject(result) || deferred.resolve()
            }, function(e) {
                return deferred.reject(e)
            });
            return deferred.promise()
        }
    }, {
        key: "abortFileUpload",
        value: function(uploadInfo) {
            return this._executeRequest("AbortUpload", {
                uploadId: uploadInfo.customData.uploadId
            })
        }
    }, {
        key: "_getItems",
        value: function(path, itemType) {
            var _this5 = this;
            return this._getEntriesByPath(path).then(function(result) {
                return _this5._convertDataObjectsToFileItems(result.result, path, itemType)
            })
        }
    }, {
        key: "_getItemsIds",
        value: function(items) {
            return items.map(function(it) {
                return it.relativeName
            })
        }
    }, {
        key: "_getEntriesByPath",
        value: function(path) {
            return this._executeRequest("GetDirContents", {
                parentId: path
            })
        }
    }, {
        key: "_executeRequest",
        value: function(command, args) {
            var method = "GetDirContents" === command ? "GET" : "POST";
            var deferred = new _deferred.Deferred;
            _ajax2.default.sendRequest({
                url: this._getEndpointUrl(command, args),
                method: method,
                dataType: "json",
                cache: false
            }).then(function(result) {
                !result.success && deferred.reject(result) || deferred.resolve(result)
            }, function(e) {
                return deferred.reject(e)
            });
            return deferred.promise()
        }
    }, {
        key: "_getEndpointUrl",
        value: function(command, args) {
            var queryString = this._getQueryString({
                command: command,
                arguments: JSON.stringify(args)
            });
            var separator = this._endpointUrl && this._endpointUrl.indexOf("?") > 0 ? "&" : "?";
            return this._endpointUrl + separator + queryString
        }
    }, {
        key: "_getQueryString",
        value: function(params) {
            var pairs = [];
            var keys = Object.keys(params);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = params[key];
                if (void 0 === value) {
                    continue
                }
                if (null === value) {
                    value = ""
                }
                if (Array.isArray(value)) {
                    this._processQueryStringArrayParam(key, value, pairs)
                } else {
                    var pair = this._getQueryStringPair(key, value);
                    pairs.push(pair)
                }
            }
            return pairs.join("&")
        }
    }, {
        key: "_processQueryStringArrayParam",
        value: function(key, array, pairs) {
            var _this6 = this;
            (0, _iterator.each)(array, function(_, item) {
                var pair = _this6._getQueryStringPair(key, item);
                pairs.push(pair)
            })
        }
    }, {
        key: "_getQueryStringPair",
        value: function(key, value) {
            return encodeURIComponent(key) + "=" + encodeURIComponent(value)
        }
    }, {
        key: "_hasSubDirs",
        value: function(dataObj) {
            var hasSubDirs = this._hasSubDirsGetter(dataObj);
            return "boolean" === typeof hasSubDirs ? hasSubDirs : true
        }
    }]);
    return WebApiFileProvider
}(_file_provider.FileProvider);
module.exports = WebApiFileProvider;
