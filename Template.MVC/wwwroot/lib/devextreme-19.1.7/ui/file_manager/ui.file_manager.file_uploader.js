/**
 * DevExtreme (ui/file_manager/ui.file_manager.file_uploader.js)
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
var _get = function get(object, property, receiver) {
    if (null === object) {
        object = Function.prototype
    }
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (void 0 === desc) {
        var parent = Object.getPrototypeOf(object);
        if (null === parent) {
            return
        } else {
            return get(parent, property, receiver)
        }
    } else {
        if ("value" in desc) {
            return desc.value
        } else {
            var getter = desc.get;
            if (void 0 === getter) {
                return
            }
            return getter.call(receiver)
        }
    }
};
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _extend = require("../../core/utils/extend");
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _deferred = require("../../core/utils/deferred");
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _button = require("../button");
var _button2 = _interopRequireDefault(_button);
var _progress_bar = require("../progress_bar");
var _progress_bar2 = _interopRequireDefault(_progress_bar);
var _popup = require("../popup");
var _popup2 = _interopRequireDefault(_popup);

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
var FILE_MANAGER_FILE_UPLOADER_CLASS = "dx-filemanager-fileuploader";
var FILE_MANAGER_FILE_UPLOADER_FILE_INPUT_CLASS = FILE_MANAGER_FILE_UPLOADER_CLASS + "-fileinput";
var FILE_MANAGER_PROGRESS_PANEL = "dx-filemanager-progresspanel";
var FILE_MANAGER_PROGRESS_BOX = "dx-filemanager-progressbox";
var FILE_MANAGER_PROGRESS_BOX_TITLE = FILE_MANAGER_PROGRESS_BOX + "-title";
var FILE_MANAGER_PROGRESS_BOX_PROGRESS_BAR = FILE_MANAGER_PROGRESS_BOX + "-progressbar";
var FILE_MANAGER_PROGRESS_BOX_CANCEL_BUTTON = FILE_MANAGER_PROGRESS_BOX + "-cancel-button";
var FileManagerFileUploader = function(_Widget) {
    _inherits(FileManagerFileUploader, _Widget);

    function FileManagerFileUploader() {
        _classCallCheck(this, FileManagerFileUploader);
        return _possibleConstructorReturn(this, (FileManagerFileUploader.__proto__ || Object.getPrototypeOf(FileManagerFileUploader)).apply(this, arguments))
    }
    _createClass(FileManagerFileUploader, [{
        key: "_initMarkup",
        value: function() {
            this._initActions();
            this._progressPanel = this._createComponent((0, _renderer2.default)("<div>"), FileManagerUploadProgressPanel, {});
            this.$element().addClass(FILE_MANAGER_FILE_UPLOADER_CLASS).append(this._progressPanel.$element());
            this._renderFileInput();
            _get(FileManagerFileUploader.prototype.__proto__ || Object.getPrototypeOf(FileManagerFileUploader.prototype), "_initMarkup", this).call(this)
        }
    }, {
        key: "_renderFileInput",
        value: function() {
            this._$fileInput = (0, _renderer2.default)("<input>").attr("type", "file").prop({
                multiple: "multiple",
                tabIndex: -1
            }).addClass(FILE_MANAGER_FILE_UPLOADER_FILE_INPUT_CLASS);
            _events_engine2.default.on(this._$fileInput, "change", this._onFileInputChange.bind(this));
            _events_engine2.default.on(this._$fileInput, "click", function(e) {
                e.stopPropagation();
                return true
            });
            this.$element().append(this._$fileInput)
        }
    }, {
        key: "_onFileInputChange",
        value: function() {
            var files = this._$fileInput.prop("files");
            if (0 === files.length) {
                return
            }
            _events_engine2.default.off(this._$fileInput, "change");
            _events_engine2.default.off(this._$fileInput, "click");
            var $fileInput = this._$fileInput;
            this._uploadFiles(files).always(function() {
                setTimeout(function() {
                    $fileInput.remove()
                })
            });
            this._renderFileInput()
        }
    }, {
        key: "_uploadFiles",
        value: function(files) {
            var _this2 = this;
            if (0 === files.length) {
                return
            }
            var progressBoxTitle = "Uploading " + files.length + " files";
            var progressBox = this._progressPanel.addProgressBox(progressBoxTitle, null);
            var controllerGetter = this.option("getController");
            var session = new FileManagerUploadSession({
                controller: controllerGetter(),
                onProgress: function(value) {
                    return progressBox.updateProgress(100 * value)
                },
                onError: function(reason) {
                    return _this2._raiseOnErrorOccurred(reason)
                }
            });
            progressBox.option("onCancel", function() {
                return session.cancelUpload()
            });
            var deferreds = session.uploadFiles(files);
            return _deferred.when.apply(null, deferreds).then(function() {
                this._progressPanel.removeProgressBox(progressBox);
                var results = [].slice.call(arguments);
                if (results.some(function(res) {
                        return res.success
                    })) {
                    this._onFilesUploaded()
                }
            }.bind(this))
        }
    }, {
        key: "tryUpload",
        value: function() {
            this._$fileInput.click()
        }
    }, {
        key: "_onFilesUploaded",
        value: function() {
            this._actions.onFilesUploaded()
        }
    }, {
        key: "_raiseOnErrorOccurred",
        value: function(args) {
            this._actions.onErrorOccurred({
                info: args
            })
        }
    }, {
        key: "_initActions",
        value: function() {
            this._actions = {
                onFilesUploaded: this._createActionByOption("onFilesUploaded"),
                onErrorOccurred: this._createActionByOption("onErrorOccurred")
            }
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerFileUploader.prototype.__proto__ || Object.getPrototypeOf(FileManagerFileUploader.prototype), "_getDefaultOptions", this).call(this), {
                getController: null,
                onFilesUploaded: null,
                onErrorOccurred: null
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "getController":
                    this.repaint();
                    break;
                case "onFilesUploaded":
                case "onErrorOccurred":
                    this._actions[name] = this._createActionByOption(name);
                    break;
                default:
                    _get(FileManagerFileUploader.prototype.__proto__ || Object.getPrototypeOf(FileManagerFileUploader.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }]);
    return FileManagerFileUploader
}(_ui2.default);
var FileManagerUploadSession = function() {
    function FileManagerUploadSession(options) {
        _classCallCheck(this, FileManagerUploadSession);
        this._controller = options.controller;
        this._onProgressHandler = options.onProgress;
        this._onErrorHandler = options.onError;
        this._canceled = false
    }
    _createClass(FileManagerUploadSession, [{
        key: "uploadFiles",
        value: function(files) {
            var progressInfo = {
                uploadedBytesCount: 0,
                totalBytesCount: 0
            };
            for (var j = 0; j < files.length; j++) {
                progressInfo.totalBytesCount += files[j].size
            }
            var result = [];
            for (var i = 0; i < files.length; i++) {
                var deferred = this._uploadFile(files[i], progressInfo);
                result.push(deferred)
            }
            return result
        }
    }, {
        key: "cancelUpload",
        value: function() {
            this._canceled = true
        }
    }, {
        key: "_uploadFile",
        value: function(file, progressInfo) {
            var _this3 = this;
            var state = this._createUploadingState(file);
            return this._controller.initiateUpload(state).then(function() {
                return _this3._uploadChunks(state, progressInfo)
            }).then(function() {
                return _this3._finalizeUpload(state)
            }, function(reason) {
                if (reason && reason.canceled) {
                    return _this3._abortUpload(state)
                } else {
                    return _this3._handleError(reason, file)
                }
            }).catch(function(reason) {
                return _this3._handleError(reason, file)
            })
        }
    }, {
        key: "_uploadChunks",
        value: function(state, progressInfo) {
            var _this4 = this;
            if (this._canceled) {
                var reason = this._createResultInfo(state.file.name, false, true);
                return (new _deferred.Deferred).reject(reason).promise()
            }
            var chunk = this._getChunk(state);
            if (!chunk) {
                return (new _deferred.Deferred).resolve().promise()
            }
            return this._controller.uploadChunk(state, chunk).done(function() {
                state.uploadedBytesCount += chunk.size;
                state.uploadedChunksCount++;
                progressInfo.uploadedBytesCount += chunk.size;
                _this4._raiseOnProgress(progressInfo)
            }).then(function() {
                return _this4._uploadChunks(state, progressInfo)
            })
        }
    }, {
        key: "_getChunk",
        value: function(state) {
            var bytesLeft = state.file.size - state.uploadedBytesCount;
            if (0 === bytesLeft) {
                return null
            }
            var chunkSize = Math.min(bytesLeft, this._controller.chunkSize);
            var blob = state.file.slice(state.uploadedBytesCount, state.uploadedBytesCount + chunkSize);
            return {
                index: state.uploadedChunksCount,
                size: chunkSize,
                blob: blob
            }
        }
    }, {
        key: "_finalizeUpload",
        value: function(state) {
            var _this5 = this;
            return this._controller.finalizeUpload(state).then(function() {
                return _this5._createResultInfo(state.file.name, true)
            })
        }
    }, {
        key: "_abortUpload",
        value: function(state) {
            var _this6 = this;
            return this._controller.abortUpload(state).then(function() {
                return _this6._createResultInfo(state.file.name, false, true)
            })
        }
    }, {
        key: "_handleError",
        value: function(error, file) {
            var result = this._createResultInfo(file.name, false, false, error);
            this._onErrorHandler(result);
            return result
        }
    }, {
        key: "_raiseOnProgress",
        value: function(info) {
            var value = 0 !== info.totalBytesCount ? info.uploadedBytesCount / info.totalBytesCount : 1;
            this._onProgressHandler(value)
        }
    }, {
        key: "_createUploadingState",
        value: function(file) {
            var chunkCount = Math.ceil(file.size / this._controller.chunkSize);
            return {
                file: file,
                uploadedBytesCount: 0,
                uploadedChunksCount: 0,
                totalChunkCount: chunkCount,
                customData: {}
            }
        }
    }, {
        key: "_createResultInfo",
        value: function(fileName, success, canceled, error) {
            return {
                fileName: fileName,
                success: success || false,
                canceled: canceled || false,
                error: error || null
            }
        }
    }]);
    return FileManagerUploadSession
}();
var FileManagerUploadProgressPanel = function(_Widget2) {
    _inherits(FileManagerUploadProgressPanel, _Widget2);

    function FileManagerUploadProgressPanel() {
        _classCallCheck(this, FileManagerUploadProgressPanel);
        return _possibleConstructorReturn(this, (FileManagerUploadProgressPanel.__proto__ || Object.getPrototypeOf(FileManagerUploadProgressPanel)).apply(this, arguments))
    }
    _createClass(FileManagerUploadProgressPanel, [{
        key: "_init",
        value: function() {
            this._progressBoxCount = 0;
            _get(FileManagerUploadProgressPanel.prototype.__proto__ || Object.getPrototypeOf(FileManagerUploadProgressPanel.prototype), "_init", this).call(this)
        }
    }, {
        key: "_initMarkup",
        value: function() {
            this._popup = this._createComponent(this.$element(), _popup2.default, {
                width: 200,
                height: 145,
                position: "right bottom",
                showTitle: false,
                visible: false,
                shading: false,
                deferRendering: false,
                closeOnOutsideClick: false,
                contentTemplate: this._getPopupContentTemplate.bind(this)
            });
            _get(FileManagerUploadProgressPanel.prototype.__proto__ || Object.getPrototypeOf(FileManagerUploadProgressPanel.prototype), "_initMarkup", this).call(this)
        }
    }, {
        key: "addProgressBox",
        value: function(title, onCancel) {
            var progressBox = this._createComponent((0, _renderer2.default)("<div>"), FileManagerUploadProgressBox, {
                title: title,
                onCancel: onCancel
            });
            this._$container.append(progressBox.$element());
            if (0 === this._progressBoxCount) {
                this._popup.show()
            }
            this._progressBoxCount++;
            return progressBox
        }
    }, {
        key: "removeProgressBox",
        value: function(progressBox) {
            if (1 === this._progressBoxCount) {
                this._popup.hide()
            }
            this._progressBoxCount--;
            progressBox.dispose();
            progressBox.$element().remove()
        }
    }, {
        key: "_getPopupContentTemplate",
        value: function() {
            this._$container = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_PROGRESS_PANEL);
            return this._$container
        }
    }]);
    return FileManagerUploadProgressPanel
}(_ui2.default);
var FileManagerUploadProgressBox = function(_Widget3) {
    _inherits(FileManagerUploadProgressBox, _Widget3);

    function FileManagerUploadProgressBox() {
        _classCallCheck(this, FileManagerUploadProgressBox);
        return _possibleConstructorReturn(this, (FileManagerUploadProgressBox.__proto__ || Object.getPrototypeOf(FileManagerUploadProgressBox)).apply(this, arguments))
    }
    _createClass(FileManagerUploadProgressBox, [{
        key: "_initMarkup",
        value: function() {
            this._createOnCancelAction();
            var titleText = this.option("title");
            var $title = (0, _renderer2.default)("<span>").text(titleText).addClass(FILE_MANAGER_PROGRESS_BOX_TITLE);
            this._cancelButton = this._createComponent((0, _renderer2.default)("<div>"), _button2.default, {
                text: "Cancel",
                onClick: this._onCancelButtonClick.bind(this)
            });
            this._cancelButton.$element().addClass(FILE_MANAGER_PROGRESS_BOX_CANCEL_BUTTON);
            this._progressBar = this._createComponent((0, _renderer2.default)("<div>"), _progress_bar2.default, {
                min: 0,
                max: 100,
                width: "100%",
                showStatus: false
            });
            this._progressBar.$element().addClass(FILE_MANAGER_PROGRESS_BOX_PROGRESS_BAR);
            this.$element().addClass(FILE_MANAGER_PROGRESS_BOX);
            this.$element().append($title, this._progressBar.$element(), this._cancelButton.$element());
            _get(FileManagerUploadProgressBox.prototype.__proto__ || Object.getPrototypeOf(FileManagerUploadProgressBox.prototype), "_initMarkup", this).call(this)
        }
    }, {
        key: "updateProgress",
        value: function(value) {
            this._progressBar.option("value", value)
        }
    }, {
        key: "_onCancelButtonClick",
        value: function() {
            this._cancelButton.option({
                disabled: true,
                text: "Canceling..."
            });
            this._onCancelAction()
        }
    }, {
        key: "_createOnCancelAction",
        value: function() {
            this._onCancelAction = this._createActionByOption("onCancel")
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerUploadProgressBox.prototype.__proto__ || Object.getPrototypeOf(FileManagerUploadProgressBox.prototype), "_getDefaultOptions", this).call(this), {
                title: "",
                onCancel: null
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "title":
                    this.repaint();
                    break;
                case "onCancel":
                    this._createOnCancelAction();
                    break;
                default:
                    _get(FileManagerUploadProgressBox.prototype.__proto__ || Object.getPrototypeOf(FileManagerUploadProgressBox.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }]);
    return FileManagerUploadProgressBox
}(_ui2.default);
module.exports = FileManagerFileUploader;
