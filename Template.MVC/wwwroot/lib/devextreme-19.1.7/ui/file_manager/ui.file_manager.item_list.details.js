/**
 * DevExtreme (ui/file_manager/ui.file_manager.item_list.details.js)
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
var _type = require("../../core/utils/type");
var _type2 = _interopRequireDefault(_type);
var _ui = require("../data_grid/ui.data_grid");
var _ui2 = _interopRequireDefault(_ui);
var _custom_store = require("../../data/custom_store");
var _custom_store2 = _interopRequireDefault(_custom_store);
var _uiFile_manager = require("./ui.file_manager.item_list");
var _uiFile_manager2 = _interopRequireDefault(_uiFile_manager);
var _uiFile_manager3 = require("./ui.file_manager.file_actions_button");
var _uiFile_manager4 = _interopRequireDefault(_uiFile_manager3);
var _uiFile_managerUtils = require("./ui.file_manager.utils.js");

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
var FILE_MANAGER_DETAILS_ITEM_LIST_CLASS = "dx-filemanager-details";
var FILE_MANAGER_DETAILS_ITEM_THUMBNAIL_CLASS = "dx-filemanager-details-item-thumbnail";
var FILE_MANAGER_DETAILS_ITEM_NAME_CLASS = "dx-filemanager-details-item-name";
var FILE_MANAGER_DETAILS_ITEM_NAME_WRAPPER_CLASS = "dx-filemanager-details-item-name-wrapper";
var DATA_GRID_DATA_ROW_CLASS = "dx-data-row";
var PREDEFINED_COLUMN_NAMES = ["name", "isDirectory", "size", "thumbnail", "dateModified"];
var FileManagerDetailsItemList = function(_FileManagerItemListB) {
    _inherits(FileManagerDetailsItemList, _FileManagerItemListB);

    function FileManagerDetailsItemList() {
        _classCallCheck(this, FileManagerDetailsItemList);
        return _possibleConstructorReturn(this, (FileManagerDetailsItemList.__proto__ || Object.getPrototypeOf(FileManagerDetailsItemList)).apply(this, arguments))
    }
    _createClass(FileManagerDetailsItemList, [{
        key: "_initMarkup",
        value: function() {
            var _this2 = this;
            this._createFilesView();
            this._contextMenu.option("onContextMenuHidden", function() {
                return _this2._onContextMenuHidden()
            });
            _get(FileManagerDetailsItemList.prototype.__proto__ || Object.getPrototypeOf(FileManagerDetailsItemList.prototype), "_initMarkup", this).call(this)
        }
    }, {
        key: "_createFilesView",
        value: function() {
            var selectionMode = this.option("selectionMode");
            this._filesView = this._createComponent("<div>", _ui2.default, {
                hoverStateEnabled: true,
                selection: {
                    mode: selectionMode
                },
                allowColumnResizing: true,
                scrolling: {
                    mode: "virtual"
                },
                showColumnLines: false,
                showRowLines: false,
                columnHidingEnabled: true,
                columns: this._createColumns(),
                onRowPrepared: this._onRowPrepared.bind(this),
                onContextMenuPreparing: this._onContextMenuPreparing.bind(this),
                onSelectionChanged: this._raiseSelectionChanged.bind(this)
            });
            this.$element().addClass(FILE_MANAGER_DETAILS_ITEM_LIST_CLASS).append(this._filesView.$element());
            this._loadFilesViewData()
        }
    }, {
        key: "_createFilesViewStore",
        value: function() {
            return new _custom_store2.default({
                key: "relativeName",
                load: this._getItems.bind(this)
            })
        }
    }, {
        key: "_loadFilesViewData",
        value: function() {
            this._filesView.option("dataSource", {
                store: this._createFilesViewStore()
            })
        }
    }, {
        key: "_createColumns",
        value: function() {
            var columns = [{
                dataField: "thumbnail",
                caption: "",
                width: 64,
                alignment: "center",
                cellTemplate: this._createThumbnailColumnCell.bind(this)
            }, {
                dataField: "name",
                cellTemplate: this._createNameColumnCell.bind(this)
            }, {
                dataField: "dateModified",
                caption: "Date Modified",
                width: 110,
                hidingPriority: 1
            }, {
                dataField: "size",
                caption: "File Size",
                width: 90,
                alignment: "right",
                hidingPriority: 0,
                calculateCellValue: this._calculateSizeColumnCellValue.bind(this)
            }];
            var customizeDetailColumns = this.option("customizeDetailColumns");
            if (_type2.default.isFunction(customizeDetailColumns)) {
                columns = customizeDetailColumns(columns);
                for (var i = 0; i < columns.length; i++) {
                    if (PREDEFINED_COLUMN_NAMES.indexOf(columns[i].dataField) < 0) {
                        columns[i].dataField = "dataItem." + columns[i].dataField
                    }
                }
            }
            return columns
        }
    }, {
        key: "_onFileItemActionButtonClick",
        value: function(_ref) {
            var component = _ref.component,
                element = _ref.element,
                event = _ref.event;
            event.stopPropagation();
            var $row = component.$element().closest(this._getItemSelector());
            var item = $row.data("item");
            this._ensureItemSelected(item);
            this._showContextMenu(this.getSelectedItems(), element);
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
        key: "_getItemThumbnailCssClass",
        value: function() {
            return FILE_MANAGER_DETAILS_ITEM_THUMBNAIL_CLASS
        }
    }, {
        key: "_getItemSelector",
        value: function() {
            return "." + DATA_GRID_DATA_ROW_CLASS
        }
    }, {
        key: "_onItemDblClick",
        value: function(e) {
            var $row = (0, _renderer2.default)(e.currentTarget);
            var item = $row.data("item");
            this._raiseSelectedItemOpened(item)
        }
    }, {
        key: "_onRowPrepared",
        value: function(e) {
            if ("data" === e.rowType) {
                (0, _renderer2.default)(e.rowElement).data("item", e.data)
            }
        }
    }, {
        key: "_onContextMenuPreparing",
        value: function(e) {
            var fileItems = null;
            if (e.row && "data" === e.row.rowType) {
                var item = e.row.data;
                this._ensureItemSelected(item);
                fileItems = this.getSelectedItems()
            }
            e.items = this._contextMenu.createContextMenuItems(fileItems)
        }
    }, {
        key: "_createThumbnailColumnCell",
        value: function(container, cellInfo) {
            this._getItemThumbnailContainer(cellInfo.data).appendTo(container)
        }
    }, {
        key: "_createNameColumnCell",
        value: function(container, cellInfo) {
            var _this3 = this;
            var $button = (0, _renderer2.default)("<div>");
            var $name = (0, _renderer2.default)("<span>").text(cellInfo.data.name).addClass(FILE_MANAGER_DETAILS_ITEM_NAME_CLASS);
            var $wrapper = (0, _renderer2.default)("<div>").append($name, $button).addClass(FILE_MANAGER_DETAILS_ITEM_NAME_WRAPPER_CLASS);
            (0, _renderer2.default)(container).append($wrapper);
            this._createComponent($button, _uiFile_manager4.default, {
                onClick: function(e) {
                    return _this3._onFileItemActionButtonClick(e)
                }
            })
        }
    }, {
        key: "_calculateSizeColumnCellValue",
        value: function(rowData) {
            return rowData.isDirectory ? "" : (0, _uiFile_managerUtils.getDisplayFileSize)(rowData.size)
        }
    }, {
        key: "_ensureItemSelected",
        value: function(item) {
            if (!this._filesView.isRowSelected(item.relativeName)) {
                var selectionController = this._filesView.getController("selection");
                var preserve = selectionController.isSelectionWithCheckboxes();
                this._filesView.selectRows([item.relativeName], preserve)
            }
        }
    }, {
        key: "refreshData",
        value: function() {
            this._loadFilesViewData()
        }
    }, {
        key: "clearSelection",
        value: function() {
            this._filesView.clearSelection()
        }
    }, {
        key: "getSelectedItems",
        value: function() {
            return this._filesView.getSelectedRowsData()
        }
    }]);
    return FileManagerDetailsItemList
}(_uiFile_manager2.default);
module.exports = FileManagerDetailsItemList;
