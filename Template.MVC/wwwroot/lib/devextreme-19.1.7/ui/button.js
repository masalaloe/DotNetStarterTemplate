/**
 * DevExtreme (ui/button.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    iconUtils = require("../core/utils/icon"),
    domUtils = require("../core/utils/dom"),
    devices = require("../core/devices"),
    registerComponent = require("../core/component_registrator"),
    extend = require("../core/utils/extend").extend,
    ValidationMixin = require("./validation/validation_mixin"),
    ValidationEngine = require("./validation_engine"),
    Widget = require("./widget/ui.widget"),
    inkRipple = require("./widget/utils.ink_ripple"),
    eventUtils = require("../events/utils"),
    themes = require("./themes"),
    clickEvent = require("../events/click"),
    FunctionTemplate = require("./widget/function_template");
var BUTTON_CLASS = "dx-button",
    BUTTON_CONTENT_CLASS = "dx-button-content",
    BUTTON_HAS_TEXT_CLASS = "dx-button-has-text",
    BUTTON_HAS_ICON_CLASS = "dx-button-has-icon",
    BUTTON_ICON_RIGHT_CLASS = "dx-button-icon-right",
    ICON_RIGHT_CLASS = "dx-icon-right",
    BUTTON_STYLING_MODE_CLASS_PREFIX = "dx-button-mode-",
    ALLOWED_STYLE_CLASSES = [BUTTON_STYLING_MODE_CLASS_PREFIX + "contained", BUTTON_STYLING_MODE_CLASS_PREFIX + "text", BUTTON_STYLING_MODE_CLASS_PREFIX + "outlined"],
    TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper",
    BUTTON_TEXT_CLASS = "dx-button-text",
    ANONYMOUS_TEMPLATE_NAME = "content",
    BUTTON_LEFT_ICON_POSITION = "left",
    BUTTON_FEEDBACK_HIDE_TIMEOUT = 100;
var Button = Widget.inherit({
    _supportedKeys: function() {
        var that = this,
            click = function(e) {
                e.preventDefault();
                that._executeClickAction(e)
            };
        return extend(this.callBase(), {
            space: click,
            enter: click
        })
    },
    _setDeprecatedOptions: function() {
        this.callBase()
    },
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            hoverStateEnabled: true,
            onClick: null,
            type: "normal",
            text: "",
            icon: "",
            iconPosition: BUTTON_LEFT_ICON_POSITION,
            validationGroup: void 0,
            activeStateEnabled: true,
            template: "content",
            useSubmitBehavior: false,
            useInkRipple: false,
            stylingMode: "contained"
        })
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function() {
                return "desktop" === devices.real().deviceType && !devices.isSimulator()
            },
            options: {
                focusStateEnabled: true
            }
        }, {
            device: function() {
                var themeName = themes.current();
                return themes.isMaterial(themeName)
            },
            options: {
                useInkRipple: true
            }
        }])
    },
    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME
    },
    _feedbackHideTimeout: BUTTON_FEEDBACK_HIDE_TIMEOUT,
    _initTemplates: function() {
        this.callBase();
        var that = this;
        this._defaultTemplates.content = new FunctionTemplate(function(options) {
            var data = options.model,
                $iconElement = iconUtils.getImageContainer(data && data.icon),
                $textContainer = data && data.text ? $("<span>").text(data.text).addClass(BUTTON_TEXT_CLASS) : void 0,
                $container = $(options.container);
            $container.append($textContainer);
            if (that.option("iconPosition") === BUTTON_LEFT_ICON_POSITION) {
                $container.prepend($iconElement)
            } else {
                $iconElement.addClass(ICON_RIGHT_CLASS);
                $container.append($iconElement)
            }
        }, this)
    },
    _initMarkup: function() {
        this.$element().addClass(BUTTON_CLASS);
        this._renderType();
        this._renderStylingMode();
        this.option("useInkRipple") && this._renderInkRipple();
        this._renderClick();
        this.setAria("role", "button");
        this._updateAriaLabel();
        this.callBase();
        this._updateContent()
    },
    _renderInkRipple: function() {
        var isOnlyIconButton = !this.option("text") && this.option("icon") || "back" === this.option("type"),
            config = {};
        if (isOnlyIconButton) {
            extend(config, {
                waveSizeCoefficient: 1,
                useHoldAnimation: false,
                isCentered: true
            })
        }
        this._inkRipple = inkRipple.render(config)
    },
    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);
        if (!this._inkRipple) {
            return
        }
        var config = {
            element: this._$content,
            event: e
        };
        if (value) {
            this._inkRipple.showWave(config)
        } else {
            this._inkRipple.hideWave(config)
        }
    },
    _updateContent: function() {
        var $element = this.$element(),
            data = this._getContentData();
        if (this._$content) {
            this._$content.empty()
        } else {
            this._$content = $("<div>").addClass(BUTTON_CONTENT_CLASS).appendTo($element)
        }
        $element.toggleClass(BUTTON_HAS_ICON_CLASS, !!data.icon).toggleClass(BUTTON_ICON_RIGHT_CLASS, !!data.icon && this.option("iconPosition") !== BUTTON_LEFT_ICON_POSITION).toggleClass(BUTTON_HAS_TEXT_CLASS, !!data.text);
        var transclude = this._getAnonymousTemplateName() === this.option("template"),
            template = this._getTemplateByOption("template"),
            $result = $(template.render({
                model: data,
                container: domUtils.getPublicElement(this._$content),
                transclude: transclude
            }));
        if ($result.hasClass(TEMPLATE_WRAPPER_CLASS)) {
            this._$content.replaceWith($result);
            this._$content = $result;
            this._$content.addClass(BUTTON_CONTENT_CLASS)
        }
        if (this.option("useSubmitBehavior")) {
            this._renderSubmitInput()
        }
    },
    _renderSubmitInput: function() {
        var submitAction = this._createAction(function(args) {
            var e = args.event,
                validationGroup = ValidationEngine.getGroupConfig(args.component._findGroup());
            if (validationGroup && !validationGroup.validate().isValid) {
                e.preventDefault()
            }
            e.stopPropagation()
        });
        this._$submitInput = $("<input>").attr("type", "submit").attr("tabindex", -1).addClass("dx-button-submit-input").appendTo(this._$content);
        eventsEngine.on(this._$submitInput, "click", function(e) {
            submitAction({
                event: e
            })
        })
    },
    _getContentData: function() {
        var icon = this.option("icon"),
            text = this.option("text"),
            back = "back" === this.option("type");
        if (back && !icon) {
            icon = "back"
        }
        return {
            icon: icon,
            text: text
        }
    },
    _renderClick: function() {
        var that = this,
            eventName = eventUtils.addNamespace(clickEvent.name, this.NAME),
            actionConfig = {
                excludeValidators: ["readOnly"]
            };
        if (this.option("useSubmitBehavior")) {
            actionConfig.afterExecute = function(e) {
                setTimeout(function() {
                    e.component._$submitInput.get(0).click()
                })
            }
        }
        this._clickAction = this._createActionByOption("onClick", actionConfig);
        eventsEngine.off(this.$element(), eventName);
        eventsEngine.on(this.$element(), eventName, function(e) {
            that._executeClickAction(e)
        })
    },
    _executeClickAction: function(e) {
        this._clickAction({
            event: e,
            validationGroup: ValidationEngine.getGroupConfig(this._findGroup())
        })
    },
    _updateAriaLabel: function() {
        var icon = this.option("icon"),
            text = this.option("text");
        if ("image" === iconUtils.getImageSourceType(icon)) {
            if (icon.indexOf("base64") === -1) {
                icon = icon.replace(/.+\/([^.]+)\..+$/, "$1")
            } else {
                icon = "Base64"
            }
        }
        var ariaLabel = text || icon || "";
        ariaLabel = ariaLabel.toString().trim();
        this.setAria("label", ariaLabel.length ? ariaLabel : null)
    },
    _renderType: function() {
        var type = this.option("type");
        if (type) {
            this.$element().addClass("dx-button-" + type)
        }
    },
    _renderStylingMode: function() {
        var _this = this;
        var optionName = "stylingMode";
        ALLOWED_STYLE_CLASSES.forEach(function(className) {
            return _this.$element().removeClass(className)
        });
        var stylingModeClass = BUTTON_STYLING_MODE_CLASS_PREFIX + this.option(optionName);
        if (ALLOWED_STYLE_CLASSES.indexOf(stylingModeClass) === -1) {
            var defaultOptionValue = this._getDefaultOptions()[optionName];
            stylingModeClass = BUTTON_STYLING_MODE_CLASS_PREFIX + defaultOptionValue
        }
        this.$element().addClass(stylingModeClass)
    },
    _refreshType: function(prevType) {
        var type = this.option("type");
        prevType && this.$element().removeClass("dx-button-" + prevType).addClass("dx-button-" + type);
        if (!this.$element().hasClass(BUTTON_HAS_ICON_CLASS) && "back" === type) {
            this._updateContent()
        }
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "onClick":
                this._renderClick();
                break;
            case "icon":
            case "text":
                this._updateContent();
                this._updateAriaLabel();
                break;
            case "type":
                this._refreshType(args.previousValue);
                this._updateContent();
                this._updateAriaLabel();
                break;
            case "template":
            case "iconPosition":
                this._updateContent();
                break;
            case "stylingMode":
                this._renderStylingMode();
                break;
            case "useInkRipple":
            case "useSubmitBehavior":
                this._invalidate();
                break;
            default:
                this.callBase(args)
        }
    },
    _clean: function() {
        delete this._inkRipple;
        this.callBase();
        delete this._$content
    }
}).include(ValidationMixin);
registerComponent("dxButton", Button);
module.exports = Button;
module.exports.default = module.exports;
