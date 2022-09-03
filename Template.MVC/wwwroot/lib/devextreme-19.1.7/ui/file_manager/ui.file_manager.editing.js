/**
 * DevExtreme (ui/file_manager/ui.file_manager.editing.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _slicedToArray = function() {
    function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = void 0;
        try {
            for (var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i) {
                    break
                }
            }
        } catch (err) {
            _d = true;
            _e = err
        } finally {
            try {
                if (!_n && _i.return) {
                    _i.return()
                }
            } finally {
                if (_d) {
                    throw _e
                }
            }
        }
        return _arr
    }
    return function(arr, i) {
        if (Array.isArray(arr)) {
            return arr
        } else {
            if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i)
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        }
    }
}();
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
var _deferred = require("../../core/utils/deferred");
var _type = require("../../core/utils/type");
var _common = require("../../core/utils/common");
var _iterator = require("../../core/utils/iterator");
var _message = require("../../localization/message");
var _message2 = _interopRequireDefault(_message);
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _uiFile_manager = require("./ui.file_manager.common");
var _uiFile_manager2 = _interopRequireDefault(_uiFile_manager);
var _uiFile_managerDialog = require("./ui.file_manager.dialog.name_editor");
var _uiFile_managerDialog2 = _interopRequireDefault(_uiFile_managerDialog);
var _uiFile_managerDialog3 = require("./ui.file_manager.dialog.folder_chooser");
var _uiFile_managerDialog4 = _interopRequireDefault(_uiFile_managerDialog3);
var _uiFile_manager3 = require("./ui.file_manager.file_uploader");
var _uiFile_manager4 = _interopRequireDefault(_uiFile_manager3);
var _uiFile_manager5 = require("./ui.file_manager.messages");

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
var FileManagerEditingControl = function(_Widget) {
    _inherits(FileManagerEditingControl, _Widget);

    function FileManagerEditingControl() {
        _classCallCheck(this, FileManagerEditingControl);
        return _possibleConstructorReturn(this, (FileManagerEditingControl.__proto__ || Object.getPrototypeOf(FileManagerEditingControl)).apply(this, arguments))
    }
    _createClass(FileManagerEditingControl, [{
        key: "_initMarkup",
        value: function() {
            _get(FileManagerEditingControl.prototype.__proto__ || Object.getPrototypeOf(FileManagerEditingControl.prototype), "_initMarkup", this).call(this);
            this._model = this.option("model");
            this._provider = this._model.provider;
            this._initActions();
            this._renameItemDialog = this._createEnterNameDialog("Rename", "Save");
            this._createFolderDialog = this._createEnterNameDialog("New folder", "Create");
            var $chooseFolderDialog = (0, _renderer2.default)("<div>").appendTo(this.$element());
            this._chooseFolderDialog = this._createComponent($chooseFolderDialog, _uiFile_managerDialog4.default, {
                provider: this._provider,
                getItems: this._model.getFolders,
                onClosed: this._onDialogClosed.bind(this)
            });
            this._confirmationDialog = this._createConfirmationDialog();
            this._fileUploader = this._createFileUploader();
            this._createEditActions()
        }
    }, {
        key: "_createFileUploader",
        value: function() {
            var _this2 = this;
            var $fileUploader = (0, _renderer2.default)("<div>").appendTo(this.$element());
            return this._createComponent($fileUploader, _uiFile_manager4.default, {
                getController: this._getFileUploaderController.bind(this),
                onFilesUploaded: function(result) {
                    return _this2._raiseOnSuccess("Files uploaded", true)
                },
                onErrorOccurred: function(_ref) {
                    var info = _ref.info;
                    var title = "Upload failed for the '" + info.fileName + "' file";
                    _this2._raiseOnError(title, info.error)
                }
            })
        }
    }, {
        key: "_getFileUploaderController",
        value: function() {
            var destinationFolder = this._uploadFolder;
            var that = this;
            return {
                chunkSize: this._provider.getFileUploadChunkSize(),
                initiateUpload: function(state) {
                    state.destinationFolder = destinationFolder;
                    return (0, _deferred.when)(that._provider.initiateFileUpload(state))
                },
                uploadChunk: function(state, chunk) {
                    return (0, _deferred.when)(that._provider.uploadFileChunk(state, chunk))
                },
                finalizeUpload: function(state) {
                    return (0, _deferred.when)(that._provider.finalizeFileUpload(state))
                },
                abortUpload: function(state) {
                    return (0, _deferred.when)(that._provider.abortFileUpload(state))
                }
            }
        }
    }, {
        key: "_createEnterNameDialog",
        value: function(title, buttonText) {
            var $dialog = (0, _renderer2.default)("<div>").appendTo(this.$element());
            return this._createComponent($dialog, _uiFile_managerDialog2.default, {
                title: title,
                buttonText: buttonText,
                onClosed: this._onDialogClosed.bind(this)
            })
        }
    }, {
        key: "_createConfirmationDialog",
        value: function() {
            var _this3 = this;
            return {
                show: function() {
                    setTimeout(function() {
                        _this3._onDialogClosed({
                            dialogResult: {}
                        })
                    })
                }
            }
        }
    }, {
        key: "_createEditActions",
        value: function() {
            var _this4 = this;
            this._editActions = {
                create: {
                    useCurrentFolder: true,
                    affectsAllItems: true,
                    dialog: this._createFolderDialog,
                    getDialogArgument: function() {
                        return _message2.default.format("dxFileManager-newFolderName")
                    },
                    action: function(_ref2, _ref3) {
                        var _ref4 = _slicedToArray(_ref2, 1),
                            item = _ref4[0];
                        var name = _ref3.name;
                        return _this4._provider.createFolder(item, name)
                    },
                    getSuccessMessage: function(items) {
                        return "Folder created"
                    }
                },
                rename: {
                    dialog: this._renameItemDialog,
                    getDialogArgument: function(_ref5) {
                        var _ref6 = _slicedToArray(_ref5, 1),
                            name = _ref6[0].name;
                        return name
                    },
                    action: function(_ref7, _ref8) {
                        var _ref9 = _slicedToArray(_ref7, 1),
                            item = _ref9[0];
                        var name = _ref8.name;
                        return _this4._provider.renameItem(item, name)
                    },
                    getSuccessMessage: function(items) {
                        return "Item renamed"
                    }
                },
                "delete": {
                    dialog: this._confirmationDialog,
                    getDialogArgument: function(_ref10) {
                        var _ref11 = _slicedToArray(_ref10, 1),
                            name = _ref11[0].name;
                        return name
                    },
                    action: function(items, arg) {
                        return _this4._provider.deleteItems(items)
                    },
                    getSuccessMessage: function(items) {
                        return "Items deleted"
                    }
                },
                move: {
                    dialog: this._chooseFolderDialog,
                    action: function(items, arg) {
                        return _this4._provider.moveItems(items, arg.folder)
                    },
                    getSuccessMessage: function(items) {
                        return "Items moved"
                    }
                },
                copy: {
                    dialog: this._chooseFolderDialog,
                    action: function(items, arg) {
                        return _this4._provider.copyItems(items, arg.folder)
                    },
                    getSuccessMessage: function(items) {
                        return "Items copied"
                    }
                },
                upload: this._tryUpload.bind(this),
                download: function() {}
            }
        }
    }, {
        key: "getCommandActions",
        value: function() {
            var _this5 = this;
            var result = {};
            (0, _iterator.each)(this._editActions, function(name, action) {
                if (Object.prototype.hasOwnProperty.call(_this5._editActions, name)) {
                    result[name] = function(arg) {
                        return _this5._executeAction(name, arg)
                    }
                }
            });
            return result
        }
    }, {
        key: "_executeAction",
        value: function(actionName, arg) {
            var action = this._editActions[actionName];
            if (!action) {
                return
            }
            if ((0, _type.isFunction)(action)) {
                action(arg)
            } else {
                this._tryEditAction(action, arg)
            }
        }
    }, {
        key: "_tryEditAction",
        value: function(action, arg) {
            var _this6 = this;
            var items = arg;
            if (!items || 0 === items.length) {
                items = action.useCurrentFolder ? [this._model.getCurrentFolder()] : this._model.getMultipleSelectedItems()
            }
            var onlyFiles = !action.affectsAllItems && items.every(function(item) {
                return !item.isDirectory
            });
            var dialogArgumentGetter = action.getDialogArgument || _common.noop;
            this._showDialog(action.dialog, dialogArgumentGetter(items)).then(function(dialogResult) {
                return action.action(items, dialogResult)
            }).then(function(result) {
                (0, _uiFile_manager2.default)(result, function() {
                    return _this6._raiseOnSuccess(action.getSuccessMessage(items), onlyFiles)
                }, function(info) {
                    return _this6._onFileProviderError(info, items)
                })
            }, function(info) {
                return _this6._onFileProviderError(info, items)
            })
        }
    }, {
        key: "_onFileProviderError",
        value: function(errorInfo, fileItems) {
            var fileItem = fileItems[errorInfo.index];
            this._raiseOnError(errorInfo.errorId, fileItem)
        }
    }, {
        key: "_tryUpload",
        value: function(destinationFolder) {
            this._uploadFolder = destinationFolder && destinationFolder[0] || this._model.getCurrentFolder();
            this._fileUploader.tryUpload()
        }
    }, {
        key: "_showDialog",
        value: function(dialog, dialogArgument) {
            this._dialogDeferred = new _deferred.Deferred;
            dialog.show(dialogArgument);
            return this._dialogDeferred.promise()
        }
    }, {
        key: "_onDialogClosed",
        value: function(e) {
            var result = e.dialogResult;
            if (result) {
                this._dialogDeferred.resolve(result)
            } else {
                this._dialogDeferred.reject()
            }
        }
    }, {
        key: "_initActions",
        value: function() {
            this._actions = {
                onSuccess: this._createActionByOption("onSuccess"),
                onError: this._createActionByOption("onError"),
                onCreating: this._createActionByOption("onCreating")
            }
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerEditingControl.prototype.__proto__ || Object.getPrototypeOf(FileManagerEditingControl.prototype), "_getDefaultOptions", this).call(this), {
                model: {
                    provider: null,
                    getFolders: null,
                    getCurrentFolder: null,
                    getMultipleSelectedItems: null
                },
                onSuccess: null,
                onError: null,
                onCreating: null
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "model":
                    this.repaint();
                    break;
                case "onSuccess":
                case "onError":
                case "onCreating":
                    this._actions[name] = this._createActionByOption(name);
                    break;
                default:
                    _get(FileManagerEditingControl.prototype.__proto__ || Object.getPrototypeOf(FileManagerEditingControl.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "_raiseOnSuccess",
        value: function(message, updatedOnlyFiles) {
            this._actions.onSuccess({
                message: message,
                updatedOnlyFiles: updatedOnlyFiles
            })
        }
    }, {
        key: "_raiseOnError",
        value: function(errorId, fileItem) {
            var fileItemName = fileItem ? fileItem.name : null;
            var message = _uiFile_manager5.FileManagerMessages.get(errorId, fileItemName);
            this._actions.onError({
                message: message
            })
        }
    }]);
    return FileManagerEditingControl
}(_ui2.default);
module.exports = FileManagerEditingControl;
