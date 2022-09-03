/**
 * DevExtreme (ui/file_manager/ui.file_manager.js)
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
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _type2 = _interopRequireDefault(_type);
var _deferred = require("../../core/utils/deferred");
var _component_registrator = require("../../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _notify = require("../notify");
var _notify2 = _interopRequireDefault(_notify);
var _uiFile_manager = require("./ui.file_manager.command_manager");
var _uiFile_manager2 = require("./ui.file_manager.context_menu");
var _uiFile_manager3 = _interopRequireDefault(_uiFile_manager2);
var _uiFile_manager4 = require("./ui.file_manager.files_tree_view");
var _uiFile_manager5 = _interopRequireDefault(_uiFile_manager4);
var _uiFile_managerItem_list = require("./ui.file_manager.item_list.details");
var _uiFile_managerItem_list2 = _interopRequireDefault(_uiFile_managerItem_list);
var _uiFile_managerItem_list3 = require("./ui.file_manager.item_list.thumbnails");
var _uiFile_managerItem_list4 = _interopRequireDefault(_uiFile_managerItem_list3);
var _uiFile_manager6 = require("./ui.file_manager.toolbar");
var _uiFile_manager7 = _interopRequireDefault(_uiFile_manager6);
var _uiFile_manager8 = require("./ui.file_manager.editing");
var _uiFile_manager9 = _interopRequireDefault(_uiFile_manager8);
var _uiFile_manager10 = require("./ui.file_manager.breadcrumbs");
var _uiFile_manager11 = _interopRequireDefault(_uiFile_manager10);
var _uiFile_manager12 = require("./ui.file_manager.adaptivity");
var _uiFile_manager13 = _interopRequireDefault(_uiFile_manager12);
var _uiFile_manager14 = require("./ui.file_manager.utils");
var _file_provider = require("./file_provider/file_provider");
var _array = require("./file_provider/array");
var _array2 = _interopRequireDefault(_array);
var _ajax = require("./file_provider/ajax");
var _ajax2 = _interopRequireDefault(_ajax);
var _onedrive = require("./file_provider/onedrive");
var _onedrive2 = _interopRequireDefault(_onedrive);
var _webapi = require("./file_provider/webapi");
var _webapi2 = _interopRequireDefault(_webapi);

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
var FILE_MANAGER_CLASS = "dx-filemanager";
var FILE_MANAGER_CONTAINER_CLASS = FILE_MANAGER_CLASS + "-container";
var FILE_MANAGER_DIRS_PANEL_CLASS = FILE_MANAGER_CLASS + "-dirs-panel";
var FILE_MANAGER_INACTIVE_AREA_CLASS = FILE_MANAGER_CLASS + "-inactive-area";
var FILE_MANAGER_EDITING_CONTAINER_CLASS = FILE_MANAGER_CLASS + "-editing-container";
var FILE_MANAGER_ITEMS_PANEL_CLASS = FILE_MANAGER_CLASS + "-items-panel";
var FILE_MANAGER_ITEM_CUSTOM_THUMBNAIL_CLASS = FILE_MANAGER_CLASS + "-item-custom-thumbnail";
var FileManager = function(_Widget) {
    _inherits(FileManager, _Widget);

    function FileManager() {
        _classCallCheck(this, FileManager);
        return _possibleConstructorReturn(this, (FileManager.__proto__ || Object.getPrototypeOf(FileManager)).apply(this, arguments))
    }
    _createClass(FileManager, [{
        key: "_initTemplates",
        value: function() {}
    }, {
        key: "_initMarkup",
        value: function() {
            _get(FileManager.prototype.__proto__ || Object.getPrototypeOf(FileManager.prototype), "_initMarkup", this).call(this);
            this._onSelectedFileOpenedAction = this._createActionByOption("onSelectedFileOpened");
            this._provider = this._getFileProvider();
            this._currentFolder = null;
            this._commandManager = new _uiFile_manager.FileManagerCommandManager(this.option("permissions"));
            this.$element().addClass(FILE_MANAGER_CLASS);
            var $toolbar = (0, _renderer2.default)("<div>").appendTo(this.$element());
            this._toolbar = this._createComponent($toolbar, _uiFile_manager7.default, {
                commandManager: this._commandManager,
                itemViewMode: this.option("itemView").mode
            });
            this._createAdaptivityControl();
            this._createEditing();
            this._initCommandManager();
            this._setItemsViewAreaActive(false)
        }
    }, {
        key: "_createAdaptivityControl",
        value: function() {
            var _this2 = this;
            var $container = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_CONTAINER_CLASS).appendTo(this.$element());
            this._adaptivityControl = this._createComponent($container, _uiFile_manager13.default, {
                drawerTemplate: function(container) {
                    return _this2._createFilesTreeView(container)
                },
                contentTemplate: function(container) {
                    return _this2._createItemsPanel(container)
                },
                onAdaptiveStateChanged: function(e) {
                    return _this2._onAdaptiveStateChanged(e)
                }
            })
        }
    }, {
        key: "_createEditing",
        value: function() {
            var _this3 = this;
            var $editingContainer = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_EDITING_CONTAINER_CLASS).appendTo(this.$element());
            this._editing = this._createComponent($editingContainer, _uiFile_manager9.default, {
                model: {
                    provider: this._provider,
                    getFolders: this._getFilesTreeViewItems.bind(this),
                    getCurrentFolder: this.getCurrentFolder.bind(this),
                    getMultipleSelectedItems: this._getMultipleSelectedItems.bind(this)
                },
                onSuccess: function(_ref) {
                    var message = _ref.message,
                        updatedOnlyFiles = _ref.updatedOnlyFiles;
                    _this3._showSuccess(message);
                    _this3._refreshData(updatedOnlyFiles)
                },
                onError: function(_ref2) {
                    var message = _ref2.message;
                    return _this3._showError(message)
                },
                onCreating: function() {
                    return _this3._setItemsViewAreaActive(false)
                }
            })
        }
    }, {
        key: "_createItemsPanel",
        value: function($container) {
            this._$itemsPanel = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_ITEMS_PANEL_CLASS).appendTo($container);
            this._createBreadcrumbs(this._$itemsPanel);
            this._createItemView(this._$itemsPanel)
        }
    }, {
        key: "_createFilesTreeView",
        value: function(container) {
            var _this4 = this;
            var $filesTreeView = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_DIRS_PANEL_CLASS).appendTo(container);
            this._filesTreeView = this._createComponent($filesTreeView, _uiFile_manager5.default, {
                contextMenu: this._createContextMenu(),
                getItems: this._getFilesTreeViewItems.bind(this),
                onCurrentFolderChanged: this._onFilesTreeViewCurrentFolderChanged.bind(this),
                onClick: function() {
                    return _this4._setItemsViewAreaActive(false)
                }
            })
        }
    }, {
        key: "_createItemView",
        value: function($container, viewMode) {
            var _this5 = this;
            var itemViewOptions = this.option("itemView");
            var options = {
                selectionMode: this.option("selectionMode"),
                contextMenu: this._createContextMenu(),
                getItems: this._getItemViewItems.bind(this),
                onError: function(_ref3) {
                    var error = _ref3.error;
                    return _this5._showError(error)
                },
                onSelectionChanged: this._onItemViewSelectionChanged.bind(this),
                onSelectedItemOpened: this._onSelectedItemOpened.bind(this),
                onSelectedFileOpened: this._createActionByOption("onSelectedFileOpened"),
                getItemThumbnail: this._getItemThumbnailInfo.bind(this),
                customizeDetailColumns: this.option("customizeDetailColumns")
            };
            var $itemView = (0, _renderer2.default)("<div>").appendTo($container);
            viewMode = viewMode || itemViewOptions.mode;
            var widgetClass = "thumbnails" === viewMode ? _uiFile_managerItem_list4.default : _uiFile_managerItem_list2.default;
            this._itemView = this._createComponent($itemView, widgetClass, options);
            _events_engine2.default.on($itemView, "click", this._onItemViewClick.bind(this))
        }
    }, {
        key: "_createBreadcrumbs",
        value: function($container) {
            var _this6 = this;
            var $breadcrumbs = (0, _renderer2.default)("<div>").appendTo($container);
            this._breadcrumbs = this._createComponent($breadcrumbs, _uiFile_manager11.default, {
                path: "",
                onPathChanged: function(e) {
                    return _this6.setCurrentFolderPath(e.newPath)
                },
                onOutsideClick: function() {
                    return _this6._clearSelection()
                }
            })
        }
    }, {
        key: "_createContextMenu",
        value: function() {
            var $contextMenu = (0, _renderer2.default)("<div>").appendTo(this.$element());
            return this._createComponent($contextMenu, _uiFile_manager3.default, {
                commandManager: this._commandManager
            })
        }
    }, {
        key: "_initCommandManager",
        value: function() {
            var _this7 = this;
            var actions = (0, _extend.extend)(this._editing.getCommandActions(), {
                refresh: function() {
                    return _this7._refreshData()
                },
                thumbnails: function() {
                    return _this7._switchView("thumbnails")
                },
                details: function() {
                    return _this7._switchView("details")
                },
                clear: function() {
                    return _this7._clearSelection()
                },
                showDirsPanel: function() {
                    return _this7._adaptivityControl.toggleDrawer()
                }
            });
            this._commandManager.registerActions(actions)
        }
    }, {
        key: "_onFilesTreeViewCurrentFolderChanged",
        value: function(e) {
            this.setCurrentFolder(this._filesTreeView.getCurrentFolder())
        }
    }, {
        key: "_onItemViewSelectionChanged",
        value: function() {
            this._updateToolbar()
        }
    }, {
        key: "_onAdaptiveStateChanged",
        value: function(_ref4) {
            var enabled = _ref4.enabled;
            this._commandManager.setCommandEnabled("showDirsPanel", enabled);
            this._updateToolbar()
        }
    }, {
        key: "_updateToolbar",
        value: function() {
            var items = this.getSelectedItems();
            this._toolbar.update(items)
        }
    }, {
        key: "_setItemsViewAreaActive",
        value: function(active) {
            if (this._itemsViewAreaActive === active) {
                return
            }
            this._itemsViewAreaActive = active;
            var $activeArea = null;
            var $inactiveArea = null;
            if (active) {
                $activeArea = this._itemView.$element();
                $inactiveArea = this._filesTreeView.$element()
            } else {
                $activeArea = this._filesTreeView.$element();
                $inactiveArea = this._itemView.$element()
            }
            $activeArea.removeClass(FILE_MANAGER_INACTIVE_AREA_CLASS);
            $inactiveArea.addClass(FILE_MANAGER_INACTIVE_AREA_CLASS);
            if (!active) {
                this._clearSelection()
            }
        }
    }, {
        key: "_tryOpen",
        value: function(item) {
            if (!item) {
                var items = this.getSelectedItems();
                if (items.length > 0) {
                    item = items[0]
                }
            }
            if (!item || !item.isDirectory) {
                return
            }
            var folder = item.createClone();
            if (item.isParentFolder) {
                folder.name = (0, _uiFile_manager14.getName)(item.relativeName);
                folder.relativeName = item.relativeName
            }
            this.setCurrentFolder(folder)
        }
    }, {
        key: "_switchView",
        value: function(viewMode) {
            this._disposeWidget(this._itemView.option("contextMenu"));
            this._disposeWidget(this._itemView);
            this._createItemView(this._$itemsPanel, viewMode)
        }
    }, {
        key: "_disposeWidget",
        value: function(widget) {
            widget.dispose();
            widget.$element().remove()
        }
    }, {
        key: "_clearSelection",
        value: function() {
            this._itemView.clearSelection()
        }
    }, {
        key: "_getMultipleSelectedItems",
        value: function() {
            return this._itemsViewAreaActive ? this.getSelectedItems() : [this.getCurrentFolder()]
        }
    }, {
        key: "_showSuccess",
        value: function(message) {
            this._showNotification(message, true)
        }
    }, {
        key: "_showError",
        value: function(message) {
            this._showNotification(message, false)
        }
    }, {
        key: "_showNotification",
        value: function(message, isSuccess) {
            (0, _notify2.default)({
                message: message,
                width: 450
            }, isSuccess ? "success" : "error", 5e3)
        }
    }, {
        key: "_loadItemViewData",
        value: function() {
            this._itemView.refreshData()
        }
    }, {
        key: "_refreshData",
        value: function(onlyItems) {
            if (!onlyItems) {
                this._filesTreeView.refreshData()
            }
            this._loadItemViewData()
        }
    }, {
        key: "_getFilesTreeViewItems",
        value: function(parent) {
            var path = parent ? parent.relativeName : "";
            return this._provider.getFolders(path)
        }
    }, {
        key: "_getItemViewItems",
        value: function() {
            var path = this.getCurrentFolderPath();
            if (null === path) {
                return (new _deferred.Deferred).promise()
            }
            var options = this.option("itemView");
            var itemType = options.showFolders ? "" : "file";
            var result = this._provider.getItems(path, itemType);
            if (options.showParentFolder && path) {
                var parentPath = (0, _uiFile_manager14.getParentPath)(path);
                var parentFolder = this._createFolderItemByPath(parentPath);
                parentFolder.isParentFolder = true;
                parentFolder.name = "..";
                result = (0, _deferred.when)(result).done(function(items) {
                    return items.unshift(parentFolder)
                })
            }
            return result
        }
    }, {
        key: "_onItemViewClick",
        value: function() {
            this._setItemsViewAreaActive(true)
        }
    }, {
        key: "_getFileProvider",
        value: function() {
            var fileProvider = this.option("fileProvider");
            if (!fileProvider) {
                fileProvider = []
            }
            if (Array.isArray(fileProvider)) {
                return new _array2.default({
                    data: fileProvider
                })
            }
            if ("string" === typeof fileProvider) {
                return new _ajax2.default({
                    url: fileProvider
                })
            }
            if (fileProvider instanceof _file_provider.FileProvider) {
                return fileProvider
            }
            if (fileProvider.type) {
                switch (fileProvider.type) {
                    case "webapi":
                        return new _webapi2.default(fileProvider);
                    case "onedrive":
                        return new _onedrive2.default(fileProvider)
                }
            }
            return new _array2.default(fileProvider)
        }
    }, {
        key: "_getItemThumbnailInfo",
        value: function(item) {
            var func = this.option("customizeThumbnail");
            var thumbnail = _type2.default.isFunction(func) ? func(item) : item.thumbnail;
            if (thumbnail) {
                return {
                    thumbnail: thumbnail,
                    cssClass: FILE_MANAGER_ITEM_CUSTOM_THUMBNAIL_CLASS
                }
            }
            return {
                thumbnail: this._getPredefinedThumbnail(item)
            }
        }
    }, {
        key: "_getPredefinedThumbnail",
        value: function(item) {
            if (item.isDirectory) {
                return "folder"
            }
            var extension = item.getExtension();
            switch (extension) {
                case ".txt":
                    return "doc";
                case ".rtf":
                case ".doc":
                case ".docx":
                case ".odt":
                    return "doc";
                case ".xls":
                case ".xlsx":
                case ".ods":
                    return "exportxlsx";
                case ".ppt":
                case ".pptx":
                case ".odp":
                    return "doc";
                case ".pdf":
                    return "exportpdf";
                case ".png":
                case ".gif":
                case ".jpg":
                case ".jpeg":
                case ".ico":
                case ".bmp":
                    return "image";
                default:
                    return "doc"
            }
        }
    }, {
        key: "_createFolderItemByPath",
        value: function(path) {
            var parentPath = (0, _uiFile_manager14.getParentPath)(path);
            var name = (0, _uiFile_manager14.getName)(path);
            return new _file_provider.FileManagerItem(parentPath, name, true)
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManager.prototype.__proto__ || Object.getPrototypeOf(FileManager.prototype), "_getDefaultOptions", this).call(this), {
                fileProvider: null,
                selectionMode: "multiple",
                itemView: {
                    mode: "details",
                    showFolders: true,
                    showParentFolder: true
                },
                customizeThumbnail: null,
                customizeDetailColumns: null,
                onSelectedFileOpened: null,
                permissions: {
                    create: false,
                    copy: false,
                    move: false,
                    remove: false,
                    rename: false,
                    upload: false
                }
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "fileProvider":
                case "selectionMode":
                case "itemView":
                case "customizeThumbnail":
                case "customizeDetailColumns":
                case "permissions":
                    this.repaint();
                    break;
                case "onSelectedFileOpened":
                    this._onSelectedFileOpenedAction = this._createActionByOption("onSelectedFileOpened");
                    break;
                default:
                    _get(FileManager.prototype.__proto__ || Object.getPrototypeOf(FileManager.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "executeCommand",
        value: function(commandName) {
            this._commandManager.executeCommand(commandName)
        }
    }, {
        key: "setCurrentFolderPath",
        value: function(path) {
            var folder = this._createFolderItemByPath(path);
            this.setCurrentFolder(folder)
        }
    }, {
        key: "getCurrentFolderPath",
        value: function() {
            return this.getCurrentFolder() ? this.getCurrentFolder().relativeName : null
        }
    }, {
        key: "setCurrentFolder",
        value: function(folder) {
            var newPath = folder ? folder.relativeName : null;
            if (newPath === this.getCurrentFolderPath()) {
                return
            }
            this._currentFolder = folder;
            this._filesTreeView.setCurrentFolderPath(newPath);
            this._loadItemViewData();
            this._breadcrumbs.option("path", newPath || "")
        }
    }, {
        key: "getCurrentFolder",
        value: function() {
            return this._currentFolder
        }
    }, {
        key: "getSelectedItems",
        value: function() {
            return this._itemView.getSelectedItems()
        }
    }, {
        key: "_onSelectedItemOpened",
        value: function(_ref5) {
            var item = _ref5.item;
            if (!item.isDirectory) {
                this._onSelectedFileOpenedAction({
                    fileItem: item
                })
            }
            this._tryOpen(item)
        }
    }]);
    return FileManager
}(_ui2.default);
(0, _component_registrator2.default)("dxFileManager", FileManager);
module.exports = FileManager;
