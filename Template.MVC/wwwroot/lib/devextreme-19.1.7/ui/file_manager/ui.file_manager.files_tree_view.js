/**
 * DevExtreme (ui/file_manager/ui.file_manager.files_tree_view.js)
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
var _deferred = require("../../core/utils/deferred");
var _extend = require("../../core/utils/extend");
var _icon = require("../../core/utils/icon");
var _common = require("../../core/utils/common");
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _uiTree_view = require("../tree_view/ui.tree_view.search");
var _uiTree_view2 = _interopRequireDefault(_uiTree_view);
var _file_provider = require("./file_provider/file_provider");
var _uiFile_manager = require("./ui.file_manager.common");
var _uiFile_manager2 = _interopRequireDefault(_uiFile_manager);
var _uiFile_manager3 = require("./ui.file_manager.utils");
var _uiFile_manager4 = require("./ui.file_manager.file_actions_button");
var _uiFile_manager5 = _interopRequireDefault(_uiFile_manager4);

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
var FILE_MANAGER_DIRS_TREE_CLASS = "dx-filemanager-dirs-tree";
var FILE_MANAGER_DIRS_TREE_FOCUSED_ITEM_CLASS = "dx-filemanager-focused-item";
var FILE_MANAGER_DIRS_TREE_ITEM_TEXT_CLASS = "dx-filemanager-dirs-tree-item-text";
var TREE_VIEW_ITEM_CLASS = "dx-treeview-item";
var FileManagerFilesTreeView = function(_Widget) {
    _inherits(FileManagerFilesTreeView, _Widget);

    function FileManagerFilesTreeView() {
        _classCallCheck(this, FileManagerFilesTreeView);
        return _possibleConstructorReturn(this, (FileManagerFilesTreeView.__proto__ || Object.getPrototypeOf(FileManagerFilesTreeView)).apply(this, arguments))
    }
    _createClass(FileManagerFilesTreeView, [{
        key: "_initMarkup",
        value: function() {
            var _this2 = this;
            this._initActions();
            this._setSelectedItem();
            this._createFileActionsButton = _common.noop;
            this._model = new FilesTreeViewModel({
                rootItemText: this.option("rootFolderDisplayName"),
                initialDir: this.option("initialFolder"),
                getItems: this.option("getItems"),
                onSelectedItemLoaded: function(item) {
                    return _this2._onModelSelectedItemLoaded(item)
                }
            });
            var $treeView = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_DIRS_TREE_CLASS).appendTo(this.$element());
            var treeViewOptions = {
                dataStructure: "plain",
                rootValue: "",
                createChildren: this._onFilesTreeViewCreateChildren.bind(this),
                itemTemplate: this._createFilesTreeViewItemTemplate.bind(this),
                hasItemsExpr: "dataItem.hasSubDirs",
                onItemClick: this._onFilesTreeViewItemClick.bind(this),
                onItemExpanded: function(_ref) {
                    var itemData = _ref.itemData;
                    return _this2._model.changeItemExpandState(itemData, true)
                },
                onItemCollapsed: function(_ref2) {
                    var itemData = _ref2.itemData;
                    return _this2._model.changeItemExpandState(itemData, false)
                },
                onItemRendered: function(e) {
                    return _this2._onFilesTreeViewItemRendered(e)
                }
            };
            if (this._contextMenu) {
                this._contextMenu.option("onContextMenuHidden", function() {
                    return _this2._onContextMenuHidden()
                });
                treeViewOptions.onItemContextMenu = function(e) {
                    return _this2._onFilesTreeViewItemContextMenu(e)
                };
                this._createFileActionsButton = function(element, options) {
                    return _this2._createComponent(element, _uiFile_manager5.default, options)
                }
            }
            this._filesTreeView = this._createComponent($treeView, _uiTree_view2.default, treeViewOptions);
            _events_engine2.default.on($treeView, "click", this._raiseClick.bind(this))
        }
    }, {
        key: "_onFilesTreeViewCreateChildren",
        value: function(parent) {
            return this._model.expandAndGetChildren(parent && parent.itemData)
        }
    }, {
        key: "_onFilesTreeViewItemClick",
        value: function(_ref3) {
            var itemElement = _ref3.itemElement,
                itemData = _ref3.itemData;
            if (this._selectedItem && this._selectedItem.dataItem.equals(itemData.dataItem)) {
                return
            }
            this._model.selectItem(itemData);
            this._changeSelectedItem(itemData, (0, _renderer2.default)(itemElement))
        }
    }, {
        key: "_onFilesTreeViewItemRendered",
        value: function(_ref4) {
            var itemElement = _ref4.itemElement,
                itemData = _ref4.itemData;
            var focused = this._selectedItem && this._selectedItem.dataItem.equals(itemData.dataItem);
            if (focused) {
                this._updateFocusedElement((0, _renderer2.default)(itemElement))
            }
        }
    }, {
        key: "_createFilesTreeViewItemTemplate",
        value: function(itemData, itemIndex, itemElement) {
            var _this3 = this;
            var $itemElement = (0, _renderer2.default)(itemElement);
            var $itemWrapper = $itemElement.closest(this._filesTreeViewItemSelector);
            $itemWrapper.data("item", itemData);
            var $image = (0, _icon.getImageContainer)(itemData.icon);
            var $text = (0, _renderer2.default)("<span>").text(itemData.text).addClass(FILE_MANAGER_DIRS_TREE_ITEM_TEXT_CLASS);
            var $button = (0, _renderer2.default)("<div>");
            $itemElement.append($image, $text, $button);
            this._createFileActionsButton($button, {
                onClick: function(e) {
                    return _this3._onFileItemActionButtonClick(e)
                }
            })
        }
    }, {
        key: "_onFilesTreeViewItemContextMenu",
        value: function(_ref5) {
            var itemElement = _ref5.itemElement,
                event = _ref5.event;
            event.preventDefault();
            var itemData = (0, _renderer2.default)(itemElement).data("item");
            this._contextMenu.showAt([itemData.dataItem], itemElement, event)
        }
    }, {
        key: "_onFileItemActionButtonClick",
        value: function(_ref6) {
            var component = _ref6.component,
                element = _ref6.element,
                event = _ref6.event;
            event.stopPropagation();
            var $item = component.$element().closest(this._filesTreeViewItemSelector);
            var item = $item.data("item");
            this._contextMenu.showAt([item.dataItem], element);
            this._activeFileActionsButton = component;
            this._activeFileActionsButton.setActive(true)
        }
    }, {
        key: "_onContextMenuHidden",
        value: function() {
            if (this._activeFileActionsButton) {
                this._activeFileActionsButton.setActive(false)
            }
        }
    }, {
        key: "_onModelSelectedItemLoaded",
        value: function(item) {
            var _this4 = this;
            if (this._filesTreeView) {
                this._handleModelSelectedItemLoaded(item)
            } else {
                setTimeout(function() {
                    return _this4._handleModelSelectedItemLoaded(item)
                })
            }
        }
    }, {
        key: "_handleModelSelectedItemLoaded",
        value: function(item) {
            var $element = this._getItemElement(item);
            this._changeSelectedItem(item, $element)
        }
    }, {
        key: "_changeSelectedItem",
        value: function(item, $element) {
            this._setSelectedItem(item, $element);
            this._raiseCurrentFolderChanged()
        }
    }, {
        key: "_setSelectedItem",
        value: function(item, $element) {
            this._selectedItem = item || null;
            this._updateFocusedElement($element)
        }
    }, {
        key: "_updateFocusedElement",
        value: function($element) {
            if (this._$focusedElement) {
                this._$focusedElement.toggleClass(FILE_MANAGER_DIRS_TREE_FOCUSED_ITEM_CLASS, false)
            }
            this._$focusedElement = $element || (0, _renderer2.default)();
            this._$focusedElement.toggleClass(FILE_MANAGER_DIRS_TREE_FOCUSED_ITEM_CLASS, true)
        }
    }, {
        key: "_getItemElement",
        value: function(item) {
            var node = this._filesTreeView._dataAdapter.getNodeByKey(item.id);
            if (node) {
                var $node = this._filesTreeView._getNodeElement(node);
                if ($node) {
                    return $node.children(this._filesTreeViewItemSelector)
                }
            }
            return null
        }
    }, {
        key: "_raiseCurrentFolderChanged",
        value: function() {
            this._actions.onCurrentFolderChanged()
        }
    }, {
        key: "_raiseClick",
        value: function() {
            this._actions.onClick()
        }
    }, {
        key: "_initActions",
        value: function() {
            this._actions = {
                onCurrentFolderChanged: this._createActionByOption("onCurrentFolderChanged"),
                onClick: this._createActionByOption("onClick")
            }
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerFilesTreeView.prototype.__proto__ || Object.getPrototypeOf(FileManagerFilesTreeView.prototype), "_getDefaultOptions", this).call(this), {
                rootFolderDisplayName: "Files",
                initialFolder: null,
                contextMenu: null,
                getItems: null,
                onCurrentFolderChanged: null,
                onClick: null
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "getItems":
                case "rootFolderDisplayName":
                case "initialFolder":
                case "contextMenu":
                    this.repaint();
                    break;
                case "onCurrentFolderChanged":
                case "onClick":
                    this._actions[name] = this._createActionByOption(name);
                    break;
                default:
                    _get(FileManagerFilesTreeView.prototype.__proto__ || Object.getPrototypeOf(FileManagerFilesTreeView.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "refreshData",
        value: function() {
            var oldPath = this.getCurrentFolderPath();
            this._setSelectedItem();
            this._model.refresh();
            this._filesTreeView.option("dataSource", []);
            var currentFolderChanged = this.getCurrentFolderPath() !== oldPath;
            if (currentFolderChanged) {
                this._raiseCurrentFolderChanged()
            }
        }
    }, {
        key: "setCurrentFolderPath",
        value: function(path) {
            var _this5 = this;
            if (path === this.getCurrentFolderPath()) {
                return
            }
            var folder = new _file_provider.FileManagerItem((0, _uiFile_manager3.getParentPath)(path), (0, _uiFile_manager3.getName)(path), true);
            var parentFolder = folder.getParent();
            var item = this._model.getItemByDataItem(folder);
            var parentItem = parentFolder ? this._model.getItemByDataItem(parentFolder) : null;
            this._model.selectItem(item);
            if (!parentItem || parentItem.childrenLoaded) {
                this._onModelSelectedItemLoaded(item)
            } else {
                this._model.expandAndGetChildren(parentItem).done(function() {
                    parentItem.expanded = false;
                    _this5._filesTreeView.expandItem(parentItem)
                })
            }
        }
    }, {
        key: "getCurrentFolderPath",
        value: function() {
            return this.getCurrentFolder() ? this.getCurrentFolder().relativeName : null
        }
    }, {
        key: "getCurrentFolder",
        value: function() {
            return this._selectedItem ? this._selectedItem.dataItem : null
        }
    }, {
        key: "_filesTreeViewItemSelector",
        get: function() {
            return "." + TREE_VIEW_ITEM_CLASS
        }
    }, {
        key: "_contextMenu",
        get: function() {
            return this.option("contextMenu")
        }
    }]);
    return FileManagerFilesTreeView
}(_ui2.default);
var FilesTreeViewModel = function() {
    function FilesTreeViewModel(options) {
        _classCallCheck(this, FilesTreeViewModel);
        this._options = options;
        this._expandedDataItems = {};
        this._selectedDataItem = null;
        this._initState();
        var initialDir = this._options.initialDir;
        if (initialDir) {
            this._selectedDataItem = initialDir;
            this._setTreeLineExpandState(initialDir)
        }
    }
    _createClass(FilesTreeViewModel, [{
        key: "selectItem",
        value: function(item) {
            this._selectedDataItem = item.dataItem
        }
    }, {
        key: "expandAndGetChildren",
        value: function(item) {
            if (!item) {
                this._onItemLoaded(this._rootItem);
                return (new _deferred.Deferred).resolve([this._rootItem]).promise()
            } else {
                if (item.isRoot) {
                    return this._expandAndGetChildrenForRootItem()
                } else {
                    return this._expandAndGetChildrenForGeneralItem(item)
                }
            }
        }
    }, {
        key: "refresh",
        value: function() {
            this._initState()
        }
    }, {
        key: "changeItemExpandState",
        value: function(item, expanded) {
            if (expanded) {
                this._expandedDataItems[item.dataKey] = item.dataItem
            } else {
                delete this._expandedDataItems[item.dataKey]
            }
            item.expanded = expanded
        }
    }, {
        key: "getItemByDataItem",
        value: function(dataItem, updateIfExists) {
            var result = this._itemMap[dataItem.relativeName];
            if (!result) {
                result = this._createItem(dataItem)
            } else {
                if (updateIfExists) {
                    result.dataItem = dataItem
                }
            }
            return result
        }
    }, {
        key: "_expandAndGetChildrenForRootItem",
        value: function() {
            var _this6 = this;
            var dataItems = Object.keys(this._expandedDataItems).filter(function(key) {
                return _this6._isVisibleAndExpandedItem(key)
            }).map(function(key) {
                return _this6._expandedDataItems[key]
            });
            var deferreds = dataItems.map(function(dataItem) {
                var item = _this6.getItemByDataItem(dataItem);
                return _this6._expandAndGetChildrenForGeneralItem(item)
            });
            return (0, _uiFile_manager2.default)(deferreds).then(function() {
                _this6._ensureSelectedItemLoaded();
                return _this6._rootItem.children
            })
        }
    }, {
        key: "_expandAndGetChildrenForGeneralItem",
        value: function(item) {
            var _this7 = this;
            if (item.expanded && item.childrenLoaded) {
                return (new _deferred.Deferred).resolve(item.children).promise()
            }
            var result = this._loadMap[item.id];
            if (result) {
                return result
            }
            this.changeItemExpandState(item, true);
            if (item.isRoot) {
                result = (new _deferred.Deferred).resolve().promise()
            } else {
                var parentData = item.dataItem.getParent();
                var parentItem = this.getItemByDataItem(parentData);
                result = this._expandAndGetChildrenForGeneralItem(parentItem)
            }
            result = result.then(function(items) {
                if (!items || items.some(function(i) {
                        return item.dataItem.equals(i.dataItem)
                    })) {
                    return _this7._loadChildren(item)
                } else {
                    _this7._onItemNotFound(item);
                    return []
                }
            });
            this._loadMap[item.id] = result;
            var deleteLoadAction = function() {
                delete _this7._loadMap[item.id]
            };
            result.done(deleteLoadAction).fail(deleteLoadAction);
            return result
        }
    }, {
        key: "_loadChildren",
        value: function(item) {
            var _this8 = this;
            var dataResult = this._options.getItems(item.dataItem);
            return (0, _deferred.when)(dataResult).then(function(dataItems) {
                item.children = [];
                dataItems.forEach(function(dataItem) {
                    var childItem = _this8.getItemByDataItem(dataItem, true);
                    item.children.push(childItem);
                    _this8._onItemLoaded(childItem)
                });
                item.childrenLoaded = true;
                return item.children
            })
        }
    }, {
        key: "_isVisibleAndExpandedItem",
        value: function(dataKey) {
            var dataItem = this._expandedDataItems[dataKey];
            if (!dataItem) {
                return false
            } else {
                if (dataItem.isRoot()) {
                    return true
                }
            }
            var parentKey = (0, _uiFile_manager3.getParentPath)(dataItem.relativeName);
            return this._isVisibleAndExpandedItem(parentKey)
        }
    }, {
        key: "_setTreeLineExpandState",
        value: function(dataItem) {
            var item = this.getItemByDataItem(dataItem);
            this.changeItemExpandState(item, true);
            if (!item.isRoot) {
                var parentData = dataItem.getParent();
                this._setTreeLineExpandState(parentData)
            }
        }
    }, {
        key: "_ensureSelectedItemLoaded",
        value: function() {
            var selectedItem = this._getSelectedItem();
            if (selectedItem.isRoot || selectedItem.childrenLoaded) {
                return
            }
            for (var key in this._itemMap) {
                if (!Object.prototype.hasOwnProperty.call(this._itemMap, key)) {
                    continue
                }
                var item = this._itemMap[key];
                if (item.childrenLoaded && item.children.indexOf(selectedItem) !== -1) {
                    return
                }
            }
            this._selectedDataItem = selectedItem.dataItem.getParent();
            selectedItem = this._getSelectedItem();
            this._raiseSelectedItemLoaded(selectedItem)
        }
    }, {
        key: "_onItemLoaded",
        value: function(item) {
            if (this._isSelectedItem(item)) {
                this._raiseSelectedItemLoaded(item)
            }
        }
    }, {
        key: "_onItemNotFound",
        value: function(item) {
            this.changeItemExpandState(item, false);
            if (0 === this._selectedDataItem.relativeName.indexOf(item.dataItem.relativeName)) {
                this._selectedDataItem = item.dataItem.getParent();
                var selectedItem = this._getSelectedItem();
                this._raiseSelectedItemLoaded(selectedItem)
            }
        }
    }, {
        key: "_getSelectedItem",
        value: function() {
            return this.getItemByDataItem(this._selectedDataItem)
        }
    }, {
        key: "_isSelectedItem",
        value: function(item) {
            return item === this._getSelectedItem()
        }
    }, {
        key: "_initState",
        value: function() {
            this._itemMap = {};
            this._loadMap = {};
            var rootData = new _file_provider.FileManagerItem("", "", true);
            rootData.name = this._options.rootItemText;
            this._rootItem = this.getItemByDataItem(rootData);
            this.changeItemExpandState(this._rootItem, true);
            if (!this._selectedDataItem) {
                this._selectedDataItem = rootData
            }
        }
    }, {
        key: "_createItem",
        value: function(dataItem) {
            var dataKey = dataItem.relativeName;
            var isRoot = !dataItem.relativeName;
            var parentId = isRoot ? "" : this._getTreeItemKey(dataItem.parentPath);
            var expanded = !!this._expandedDataItems[dataKey];
            var result = {
                dataKey: dataKey,
                childrenLoaded: false,
                dataItem: dataItem,
                isRoot: isRoot,
                id: this._getTreeItemKey(dataItem.relativeName),
                parentId: parentId,
                text: dataItem.name,
                expanded: expanded,
                icon: "folder"
            };
            this._itemMap[result.dataKey] = result;
            return result
        }
    }, {
        key: "_getTreeItemKey",
        value: function(dataKey) {
            return "TVK_" + dataKey
        }
    }, {
        key: "_raiseSelectedItemLoaded",
        value: function(item) {
            this._options.onSelectedItemLoaded(item)
        }
    }]);
    return FilesTreeViewModel
}();
module.exports = FileManagerFilesTreeView;
