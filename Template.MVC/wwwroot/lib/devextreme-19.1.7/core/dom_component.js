/**
 * DevExtreme (core/dom_component.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _events_engine = require("../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _window = require("../core/utils/window");
var _window2 = _interopRequireDefault(_window);
var _extend = require("./utils/extend");
var _config = require("./config");
var _config2 = _interopRequireDefault(_config);
var _errors = require("./errors");
var _errors2 = _interopRequireDefault(_errors);
var _dom = require("../core/utils/dom");
var _resize_callbacks = require("../core/utils/resize_callbacks");
var _resize_callbacks2 = _interopRequireDefault(_resize_callbacks);
var _common = require("./utils/common");
var _common2 = _interopRequireDefault(_common);
var _iterator = require("./utils/iterator");
var _type = require("./utils/type");
var _array = require("./utils/array");
var _public_component = require("./utils/public_component");
var _public_component2 = _interopRequireDefault(_public_component);
var _element_data = require("./element_data");
var _element_data2 = _interopRequireDefault(_element_data);
var _component = require("./component");
var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var abstract = _component2.default.abstract;
var RTL_DIRECTION_CLASS = "dx-rtl";
var VISIBILITY_CHANGE_CLASS = "dx-visibility-change-handler";
var VISIBILITY_CHANGE_EVENTNAMESPACE = "VisibilityChange";
var DOMComponent = _component2.default.inherit({
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            width: void 0,
            height: void 0,
            rtlEnabled: (0, _config2.default)().rtlEnabled,
            elementAttr: {},
            disabled: false,
            integrationOptions: {}
        })
    },
    ctor: function(element, options) {
        this._$element = (0, _renderer2.default)(element);
        _public_component2.default.attachInstanceToElement(this._$element, this, this._dispose);
        this.callBase(options)
    },
    _getSynchronizableOptionsForCreateComponent: function() {
        return ["rtlEnabled", "disabled", "templatesRenderAsynchronously"]
    },
    _visibilityChanged: abstract,
    _dimensionChanged: abstract,
    _init: function() {
        this.callBase();
        this._attachWindowResizeCallback()
    },
    _setOptionsByDevice: function(instanceCustomRules) {
        this.callBase([].concat(this.constructor._classCustomRules || [], instanceCustomRules || []))
    },
    _isInitialOptionValue: function(name) {
        var isCustomOption = this.constructor._classCustomRules && Object.prototype.hasOwnProperty.call(this._convertRulesToOptions(this.constructor._classCustomRules), name);
        return !isCustomOption && this.callBase(name)
    },
    _attachWindowResizeCallback: function() {
        if (this._isDimensionChangeSupported()) {
            var windowResizeCallBack = this._windowResizeCallBack = this._dimensionChanged.bind(this);
            _resize_callbacks2.default.add(windowResizeCallBack)
        }
    },
    _isDimensionChangeSupported: function() {
        return this._dimensionChanged !== abstract
    },
    _renderComponent: function() {
        this._initMarkup();
        if (_window2.default.hasWindow()) {
            this._render()
        }
    },
    _initMarkup: function() {
        this._renderElementAttributes();
        this._toggleRTLDirection(this.option("rtlEnabled"));
        this._renderVisibilityChange();
        this._renderDimensions()
    },
    _render: function() {
        this._attachVisibilityChangeHandlers()
    },
    _renderElementAttributes: function() {
        var attributes = (0, _extend.extend)({}, this.option("elementAttr")),
            classNames = attributes.class;
        delete attributes.class;
        this.$element().attr(attributes).addClass(classNames)
    },
    _renderVisibilityChange: function() {
        if (this._isDimensionChangeSupported()) {
            this._attachDimensionChangeHandlers()
        }
        if (!this._isVisibilityChangeSupported()) {
            return
        }
        this.$element().addClass(VISIBILITY_CHANGE_CLASS)
    },
    _renderDimensions: function() {
        var $element = this.$element();
        var element = $element.get(0);
        var width = this._getOptionValue("width", element);
        var height = this._getOptionValue("height", element);
        if (this._isCssUpdateRequired(element, height, width)) {
            $element.css({
                width: width,
                height: height
            })
        }
    },
    _isCssUpdateRequired: function(element, height, width) {
        return !!(width || height || element.style.width || element.style.height)
    },
    _attachDimensionChangeHandlers: function() {
        var that = this;
        var resizeEventName = "dxresize." + this.NAME + VISIBILITY_CHANGE_EVENTNAMESPACE;
        _events_engine2.default.off(that.$element(), resizeEventName);
        _events_engine2.default.on(that.$element(), resizeEventName, function() {
            that._dimensionChanged()
        })
    },
    _attachVisibilityChangeHandlers: function() {
        if (!this._isVisibilityChangeSupported()) {
            return
        }
        var that = this;
        var hidingEventName = "dxhiding." + this.NAME + VISIBILITY_CHANGE_EVENTNAMESPACE;
        var shownEventName = "dxshown." + this.NAME + VISIBILITY_CHANGE_EVENTNAMESPACE;
        that._isHidden = !that._isVisible();
        _events_engine2.default.off(that.$element(), hidingEventName);
        _events_engine2.default.on(that.$element(), hidingEventName, function() {
            that._checkVisibilityChanged("hiding")
        });
        _events_engine2.default.off(that.$element(), shownEventName);
        _events_engine2.default.on(that.$element(), shownEventName, function() {
            that._checkVisibilityChanged("shown")
        })
    },
    _isVisible: function() {
        return this.$element().is(":visible")
    },
    _checkVisibilityChanged: function(event) {
        if ("hiding" === event && this._isVisible() && !this._isHidden) {
            this._visibilityChanged(false);
            this._isHidden = true
        } else {
            if ("shown" === event && this._isVisible() && this._isHidden) {
                this._isHidden = false;
                this._visibilityChanged(true)
            }
        }
    },
    _isVisibilityChangeSupported: function() {
        return this._visibilityChanged !== abstract && _window2.default.hasWindow()
    },
    _clean: _common2.default.noop,
    _modelByElement: function() {
        var modelByElement = this.option("modelByElement") || _common2.default.noop;
        return modelByElement(this.$element())
    },
    _invalidate: function() {
        if (!this._updateLockCount) {
            throw _errors2.default.Error("E0007")
        }
        this._requireRefresh = true
    },
    _refresh: function() {
        this._clean();
        this._renderComponent()
    },
    _dispose: function() {
        this.callBase();
        this._clean();
        this._detachWindowResizeCallback()
    },
    _detachWindowResizeCallback: function() {
        if (this._isDimensionChangeSupported()) {
            _resize_callbacks2.default.remove(this._windowResizeCallBack)
        }
    },
    _toggleRTLDirection: function(rtl) {
        this.$element().toggleClass(RTL_DIRECTION_CLASS, rtl)
    },
    _createComponent: function(element, component, config) {
        var _this = this;
        var that = this;
        config = config || {};
        var synchronizableOptions = _common2.default.grep(this._getSynchronizableOptionsForCreateComponent(), function(value) {
            return !(value in config)
        });
        var nestedComponentOptions = that.option("nestedComponentOptions") || _common2.default.noop;
        var nestedComponentConfig = (0, _extend.extend)({
            integrationOptions: this.option("integrationOptions")
        }, nestedComponentOptions(this));
        synchronizableOptions.forEach(function(optionName) {
            nestedComponentConfig[optionName] = _this.option(optionName)
        });
        that._extendConfig(config, nestedComponentConfig);
        var instance;
        if ((0, _type.isString)(component)) {
            var $element = (0, _renderer2.default)(element)[component](config);
            instance = $element[component]("instance")
        } else {
            if (element) {
                instance = component.getInstance(element);
                if (instance) {
                    instance.option(config)
                } else {
                    instance = new component(element, config)
                }
            }
        }
        if (instance) {
            var optionChangedHandler = function(args) {
                if ((0, _array.inArray)(args.name, synchronizableOptions) >= 0) {
                    instance.option(args.name, args.value)
                }
            };
            that.on("optionChanged", optionChangedHandler);
            instance.on("disposing", function() {
                that.off("optionChanged", optionChangedHandler)
            })
        }
        return instance
    },
    _extendConfig: function(config, extendConfig) {
        (0, _iterator.each)(extendConfig, function(key, value) {
            config[key] = Object.prototype.hasOwnProperty.call(config, key) ? config[key] : value
        })
    },
    _defaultActionConfig: function() {
        return (0, _extend.extend)(this.callBase(), {
            context: this._modelByElement(this.$element())
        })
    },
    _defaultActionArgs: function() {
        var model = this._modelByElement(this.$element());
        return (0, _extend.extend)(this.callBase(), {
            element: this.element(),
            model: model
        })
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "width":
            case "height":
                this._renderDimensions();
                break;
            case "rtlEnabled":
                this._invalidate();
                break;
            case "elementAttr":
                this._renderElementAttributes();
                break;
            case "disabled":
            case "integrationOptions":
                break;
            default:
                this.callBase(args)
        }
    },
    _removeAttributes: function(element) {
        var i = element.attributes.length - 1;
        for (; i >= 0; i--) {
            var attribute = element.attributes[i];
            if (!attribute) {
                return
            }
            var attributeName = attribute.name;
            if (0 === attributeName.indexOf("aria-") || attributeName.indexOf("dx-") !== -1 || "role" === attributeName || "style" === attributeName || "tabindex" === attributeName) {
                element.removeAttribute(attributeName)
            }
        }
    },
    _removeClasses: function(element) {
        var classes = element.className.split(" ").filter(function(cssClass) {
            return 0 !== cssClass.lastIndexOf("dx-", 0)
        });
        element.className = classes.join(" ")
    },
    endUpdate: function() {
        var requireRender = !this._initializing && !this._initialized;
        this.callBase.apply(this, arguments);
        if (!this._updateLockCount) {
            if (requireRender) {
                this._renderComponent()
            } else {
                if (this._requireRefresh) {
                    this._requireRefresh = false;
                    this._refresh()
                }
            }
        }
    },
    $element: function() {
        return this._$element
    },
    element: function() {
        return (0, _dom.getPublicElement)(this.$element())
    },
    dispose: function() {
        var element = this.$element().get(0);
        _element_data2.default.cleanDataRecursive(element, true);
        element.textContent = "";
        this._removeAttributes(element);
        this._removeClasses(element)
    }
});
DOMComponent.getInstance = function(element) {
    return _public_component2.default.getInstanceByElement((0, _renderer2.default)(element), this)
};
DOMComponent.defaultOptions = function(rule) {
    this._classCustomRules = this._classCustomRules || [];
    this._classCustomRules.push(rule)
};
module.exports = DOMComponent;
module.exports.default = module.exports;
