/**
 * DevExtreme (ui/drop_down_button.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _ui = require("./widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _function_template = require("./widget/function_template");
var _function_template2 = _interopRequireDefault(_function_template);
var _component_registrator = require("../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _button_group = require("./button_group");
var _button_group2 = _interopRequireDefault(_button_group);
var _popup = require("./popup");
var _popup2 = _interopRequireDefault(_popup);
var _list = require("./list");
var _list2 = _interopRequireDefault(_list);
var _data = require("../core/utils/data");
var _dom = require("../core/utils/dom");
var _dom2 = _interopRequireDefault(_dom);
var _icon = require("../core/utils/icon");
var _data_helper = require("../data_helper");
var _data_helper2 = _interopRequireDefault(_data_helper);
var _data_source = require("../data/data_source/data_source");
var _array_store = require("../data/array_store");
var _array_store2 = _interopRequireDefault(_array_store);
var _deferred = require("../core/utils/deferred");
var _extend = require("../core/utils/extend");
var _type = require("../core/utils/type");
var _common = require("../core/utils/common");
var _guid = require("../core/guid");
var _guid2 = _interopRequireDefault(_guid);
var _message = require("../localization/message");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var DROP_DOWN_BUTTON_CLASS = "dx-dropdownbutton";
var DROP_DOWN_BUTTON_CONTENT = "dx-dropdownbutton-content";
var DROP_DOWN_BUTTON_ACTION_CLASS = "dx-dropdownbutton-action";
var DROP_DOWN_BUTTON_TOGGLE_CLASS = "dx-dropdownbutton-toggle";
var DX_BUTTON_CONTENT_CLASS = "dx-button-content";
var DX_ICON_RIGHT_CLASS = "dx-icon-right";
var DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS = "dx-dropdownbutton-popup-wrapper";
var DropDownButton = _ui2.default.inherit({
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            itemTemplate: "item",
            keyExpr: "this",
            displayExpr: "this",
            selectedItem: null,
            selectedItemKey: null,
            stylingMode: "outlined",
            deferRendering: true,
            noDataText: (0, _message.format)("dxCollectionWidget-noDataText"),
            useSelectMode: false,
            splitButton: false,
            showArrowIcon: true,
            text: "",
            icon: void 0,
            onButtonClick: null,
            onSelectionChanged: null,
            onItemClick: null,
            opened: false,
            items: null,
            dataSource: null,
            focusStateEnabled: true,
            hoverStateEnabled: true,
            dropDownOptions: {},
            dropDownContentTemplate: "content",
            grouped: false,
            groupTemplate: "group",
            buttonGroupOptions: {}
        })
    },
    _setOptionsByReference: function() {
        this.callBase();
        (0, _extend.extend)(this._optionsByReference, {
            selectedItem: true
        })
    },
    _init: function() {
        this.callBase();
        this._createItemClickAction();
        this._createActionClickAction();
        this._createSelectionChangedAction();
        this._compileKeyGetter();
        this._compileDisplayGetter();
        this._initDataSource();
        this._itemsToDataSource();
        this._initInnerOptionCache("buttonGroupOptions");
        this._initInnerOptionCache("dropDownOptions")
    },
    _initTemplates: function() {
        var _this = this;
        this.callBase();
        this._defaultTemplates.content = new _function_template2.default(function(options) {
            var $popupContent = (0, _renderer2.default)(options.container);
            var $listContainer = (0, _renderer2.default)("<div>").appendTo($popupContent);
            _this._list = _this._createComponent($listContainer, _list2.default, _this._listOptions());
            _this._list.registerKeyHandler("escape", _this._escHandler.bind(_this));
            _this._list.registerKeyHandler("tab", _this._escHandler.bind(_this));
            _this._list.registerKeyHandler("leftArrow", _this._escHandler.bind(_this));
            _this._list.registerKeyHandler("rightArrow", _this._escHandler.bind(_this))
        })
    },
    _itemsToDataSource: function() {
        if (!this._dataSource) {
            this._dataSource = new _data_source.DataSource({
                store: new _array_store2.default(this.option("items")),
                pageSize: 0
            })
        }
    },
    _compileKeyGetter: function() {
        this._keyGetter = (0, _data.compileGetter)(this.option("keyExpr"))
    },
    _compileDisplayGetter: function() {
        this._displayGetter = (0, _data.compileGetter)(this.option("displayExpr"))
    },
    _initMarkup: function() {
        this.callBase();
        this.$element().addClass(DROP_DOWN_BUTTON_CLASS);
        this._renderButtonGroup();
        this._loadSelectedItem().done(this._updateActionButton.bind(this));
        if (!this.option("deferRendering") || this.option("opened")) {
            this._renderPopup()
        }
    },
    _loadSelectedItem: function() {
        var _this2 = this;
        var d = new _deferred.Deferred;
        if (this._list) {
            return d.resolve(this._list.option("selectedItem"))
        }
        var selectedItemKey = this.option("selectedItemKey");
        this._loadSingle(this.option("keyExpr"), selectedItemKey).done(d.resolve).fail(function() {
            d.resolve(_this2.option("selectedItem"))
        });
        return d.promise()
    },
    _createActionClickAction: function() {
        this._actionClickAction = this._createActionByOption("onButtonClick")
    },
    _createSelectionChangedAction: function() {
        this._selectionChangedAction = this._createActionByOption("onSelectionChanged")
    },
    _createItemClickAction: function() {
        this._itemClickAction = this._createActionByOption("onItemClick")
    },
    _fireSelectionChangedAction: function(_ref) {
        var previousValue = _ref.previousValue,
            value = _ref.value;
        this._selectionChangedAction({
            item: value,
            previousItem: previousValue
        })
    },
    _fireItemClickAction: function(_ref2) {
        var event = _ref2.event,
            itemElement = _ref2.itemElement,
            itemData = _ref2.itemData;
        return this._itemClickAction({
            event: event,
            itemElement: itemElement,
            itemData: this._actionItem || itemData
        })
    },
    _actionButtonConfig: function() {
        return {
            text: this.option("text"),
            icon: this.option("icon"),
            elementAttr: {
                "class": DROP_DOWN_BUTTON_ACTION_CLASS
            }
        }
    },
    _getButtonGroupItems: function() {
        var items = [];
        items.push(this._actionButtonConfig());
        if (this.option("splitButton")) {
            items.push({
                icon: "spindown",
                width: 26,
                elementAttr: {
                    "class": DROP_DOWN_BUTTON_TOGGLE_CLASS
                }
            })
        }
        return items
    },
    _buttonGroupItemClick: function(_ref3) {
        var event = _ref3.event,
            itemData = _ref3.itemData;
        var isActionButton = itemData.elementAttr.class === DROP_DOWN_BUTTON_ACTION_CLASS;
        var isToggleButton = itemData.elementAttr.class === DROP_DOWN_BUTTON_TOGGLE_CLASS;
        if (isToggleButton) {
            this.toggle()
        } else {
            if (isActionButton) {
                this._actionClickAction({
                    event: event,
                    selectedItem: this.option("selectedItem")
                });
                if (!this.option("splitButton")) {
                    this.toggle()
                }
            }
        }
    },
    _buttonGroupOptions: function() {
        return (0, _extend.extend)({
            items: this._getButtonGroupItems(),
            focusStateEnabled: this.option("focusStateEnabled"),
            hoverStateEnabled: this.option("hoverStateEnabled"),
            onItemClick: this._buttonGroupItemClick.bind(this),
            width: this.option("width"),
            height: this.option("height"),
            stylingMode: this.option("stylingMode"),
            selectionMode: "none"
        }, this._getInnerOptionsCache("buttonGroupOptions"))
    },
    _renderPopupContent: function() {
        var $content = this._popup.$content();
        var template = this._getTemplateByOption("dropDownContentTemplate");
        $content.empty();
        this._popupContentId = "dx-" + new _guid2.default;
        this.setAria("id", this._popupContentId, $content);
        return template.render({
            container: _dom2.default.getPublicElement($content),
            model: this.option("items") || this._dataSource
        })
    },
    _popupOptions: function() {
        var _this3 = this;
        return (0, _extend.extend)({
            dragEnabled: false,
            focusStateEnabled: false,
            deferRendering: this.option("deferRendering"),
            minWidth: function() {
                return _this3.$element().outerWidth()
            },
            closeOnOutsideClick: function(e) {
                var $element = _this3.$element();
                var $buttonClicked = (0, _renderer2.default)(e.target).closest("." + DROP_DOWN_BUTTON_CLASS);
                return !$buttonClicked.is($element)
            },
            showTitle: false,
            animation: {
                show: {
                    type: "fade",
                    duration: 0,
                    from: 0,
                    to: 1
                },
                hide: {
                    type: "fade",
                    duration: 400,
                    from: 1,
                    to: 0
                }
            },
            width: "auto",
            height: "auto",
            shading: false,
            visible: this.option("opened"),
            position: {
                of: this.$element(),
                collision: "flipfit",
                my: "top left",
                at: "bottom left",
                offset: {
                    y: -1
                }
            }
        }, this._getInnerOptionsCache("dropDownOptions"))
    },
    _listOptions: function() {
        var _this4 = this;
        var selectedItemKey = this.option("selectedItemKey");
        return {
            selectionMode: "single",
            focusStateEnabled: this.option("focusStateEnabled"),
            hoverStateEnabled: this.option("hoverStateEnabled"),
            selectedItemKeys: selectedItemKey ? [selectedItemKey] : [],
            grouped: this.option("grouped"),
            keyExpr: this.option("keyExpr"),
            noDataText: this.option("noDataText"),
            displayExpr: this.option("displayExpr"),
            itemTemplate: this.option("itemTemplate"),
            items: this.option("items"),
            dataSource: this._dataSource,
            onItemClick: function(e) {
                _this4.option("selectedItemKey", _this4._keyGetter(e.itemData));
                var actionResult = _this4._fireItemClickAction(e);
                if (false !== actionResult) {
                    _this4.toggle(false);
                    _this4._buttonGroup.focus()
                }
            }
        }
    },
    _upDownKeyHandler: function() {
        if (this._popup && this._popup.option("visible") && this._list) {
            this._list.focus()
        } else {
            this.open()
        }
    },
    _escHandler: function() {
        this.close();
        this._buttonGroup.focus()
    },
    _renderPopup: function() {
        var $popup = (0, _renderer2.default)("<div>");
        this.$element().append($popup);
        this._popup = this._createComponent($popup, _popup2.default, this._popupOptions());
        this._popup.$content().addClass(DROP_DOWN_BUTTON_CONTENT);
        this._popup._wrapper().addClass(DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS);
        this._popup.on("hiding", this._popupHidingHandler.bind(this));
        this._popup.on("showing", this._popupShowingHandler.bind(this));
        this._renderPopupContent();
        this._bindInnerWidgetOptions(this._popup, "dropDownOptions")
    },
    _popupHidingHandler: function() {
        this.option("opened", false);
        this.setAria({
            expanded: false,
            owns: void 0
        })
    },
    _popupShowingHandler: function() {
        this.option("opened", true);
        this.setAria({
            expanded: true,
            owns: this._popupContentId
        })
    },
    _renderAdditionalIcon: function() {
        if (this.option("splitButton") || !this.option("showArrowIcon")) {
            return
        }
        var $firstButtonContent = this._buttonGroup.$element().find("." + DX_BUTTON_CONTENT_CLASS).eq(0);
        var $iconElement = (0, _icon.getImageContainer)("spindown");
        $iconElement.addClass(DX_ICON_RIGHT_CLASS).appendTo($firstButtonContent)
    },
    _renderButtonGroup: function() {
        var $buttonGroup = this._buttonGroup && this._buttonGroup.$element() || (0, _renderer2.default)("<div>");
        if (!this._buttonGroup) {
            this.$element().append($buttonGroup)
        }
        this._buttonGroup = this._createComponent($buttonGroup, _button_group2.default, this._buttonGroupOptions());
        this._buttonGroup.registerKeyHandler("downArrow", this._upDownKeyHandler.bind(this));
        this._buttonGroup.registerKeyHandler("tab", this.close.bind(this));
        this._buttonGroup.registerKeyHandler("upArrow", this._upDownKeyHandler.bind(this));
        this._buttonGroup.registerKeyHandler("escape", this._escHandler.bind(this));
        this._renderAdditionalIcon();
        this._bindInnerWidgetOptions(this._buttonGroup, "buttonGroupOptions")
    },
    toggle: function(visible) {
        this._popup || this._renderPopup();
        return this._popup.toggle(visible)
    },
    open: function() {
        return this.toggle(true)
    },
    close: function() {
        return this.toggle(false)
    },
    _setListOption: function(name, value) {
        this._list && this._list.option(name, value)
    },
    _getDisplayValue: function(item) {
        var isPrimitiveItem = !(0, _type.isPlainObject)(item);
        var displayValue = isPrimitiveItem ? item : this._displayGetter(item);
        return !(0, _type.isPlainObject)(displayValue) ? String((0, _common.ensureDefined)(displayValue, "")) : ""
    },
    _updateActionButton: function(selectedItem) {
        if (this.option("useSelectMode")) {
            this.option({
                text: this._getDisplayValue(selectedItem),
                icon: (0, _type.isPlainObject)(selectedItem) ? selectedItem.icon : void 0
            })
        }
        this._setOptionSilent("selectedItem", selectedItem)
    },
    _clean: function() {
        this._list && this._list.$element().remove();
        this._popup && this._popup.$element().remove()
    },
    _selectedItemKeyChanged: function(value) {
        var _this5 = this;
        this._setListOption("selectedItemKeys", value ? [value] : []);
        var previousItem = this.option("selectedItem");
        this._loadSelectedItem().done(function(selectedItem) {
            _this5._updateActionButton(selectedItem);
            if (_this5._displayGetter(previousItem) !== _this5._displayGetter(selectedItem)) {
                _this5._fireSelectionChangedAction({
                    previousValue: previousItem,
                    value: selectedItem
                })
            }
        })
    },
    _updateItemCollection: function(optionName) {
        this._setWidgetOption("_list", [optionName]);
        this._setListOption("selectedItemKeys", []);
        this._loadSelectedItem().done(this._updateActionButton.bind(this))
    },
    _optionChanged: function(args) {
        var name = args.name,
            value = args.value;
        switch (args.name) {
            case "useSelectMode":
                break;
            case "splitButton":
                this._renderButtonGroup();
                break;
            case "displayExpr":
                this._compileDisplayGetter();
                break;
            case "keyExpr":
                this._compileKeyGetter();
                break;
            case "buttonGroupOptions":
                this._innerOptionChanged(this._buttonGroup, args);
                break;
            case "dropDownOptions":
                this._innerOptionChanged(this._popup, args);
                break;
            case "opened":
                this.toggle(value);
                break;
            case "focusStateEnabled":
            case "hoverStateEnabled":
                this._setListOption(name, value);
                this._buttonGroup.option(name, value);
                break;
            case "items":
                this._dataSource = null;
                this._itemsToDataSource();
                this._updateItemCollection(name);
                break;
            case "dataSource":
                this._initDataSource();
                this._updateItemCollection(name);
                break;
            case "icon":
                this._buttonGroup.option("items[0]", (0, _extend.extend)({}, this._actionButtonConfig(), {
                    icon: value
                }));
                this._renderAdditionalIcon();
                break;
            case "text":
                this._buttonGroup.option("items[0]", (0, _extend.extend)({}, this._actionButtonConfig(), {
                    text: value
                }));
                this._renderAdditionalIcon();
                break;
            case "showArrowIcon":
                if (!value) {
                    this._buttonGroup.$element().find("." + DX_ICON_RIGHT_CLASS).remove()
                }
                this._renderAdditionalIcon();
                break;
            case "stylingMode":
            case "width":
            case "height":
                this._buttonGroup.option(name, value);
                break;
            case "itemTemplate":
            case "grouped":
            case "noDataText":
            case "groupTemplate":
                this._setListOption(name, value);
                break;
            case "dropDownContentTemplate":
                this._popup && this._renderPopupContent();
                break;
            case "selectedItemKey":
                this._selectedItemKeyChanged(value);
                break;
            case "selectedItem":
                break;
            case "onItemClick":
                this._createItemClickAction();
                break;
            case "onButtonClick":
                this._createActionClickAction();
                break;
            case "onSelectionChanged":
                this._createSelectionChangedAction();
                break;
            case "deferRendering":
                if (!value && !this._popup) {
                    this._renderPopup()
                }
                break;
            default:
                this.callBase(args)
        }
    }
}).include(_data_helper2.default);
(0, _component_registrator2.default)("dxDropDownButton", DropDownButton);
module.exports = DropDownButton;
module.exports.default = module.exports;
