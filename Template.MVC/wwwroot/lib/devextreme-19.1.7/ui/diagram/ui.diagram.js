/**
 * DevExtreme (ui/diagram/ui.diagram.js)
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
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _drawer = require("../drawer");
var _drawer2 = _interopRequireDefault(_drawer);
var _component_registrator = require("../../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _type2 = _interopRequireDefault(_type);
var _data = require("../../core/utils/data");
var _data2 = _interopRequireDefault(_data);
var _uiDiagram = require("./ui.diagram.toolbar");
var _uiDiagram2 = _interopRequireDefault(_uiDiagram);
var _uiDiagram3 = require("./ui.diagram.leftpanel");
var _uiDiagram4 = _interopRequireDefault(_uiDiagram3);
var _uiDiagram5 = require("./ui.diagram.rightpanel");
var _uiDiagram6 = _interopRequireDefault(_uiDiagram5);
var _uiDiagram7 = require("./ui.diagram.contextmenu");
var _uiDiagram8 = _interopRequireDefault(_uiDiagram7);
var _uiDiagram9 = require("./ui.diagram.nodes");
var _uiDiagram10 = _interopRequireDefault(_uiDiagram9);
var _uiDiagram11 = require("./ui.diagram.edges");
var _uiDiagram12 = _interopRequireDefault(_uiDiagram11);
var _tooltip = require("../tooltip");
var _tooltip2 = _interopRequireDefault(_tooltip);
var _diagram_importer = require("./diagram_importer");
var _window = require("../../core/utils/window");
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _utils = require("../../events/utils");
var _utils2 = _interopRequireDefault(_utils);

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
var DIAGRAM_CLASS = "dx-diagram";
var DIAGRAM_FULLSCREEN_CLASS = "dx-diagram-fullscreen";
var DIAGRAM_TOOLBAR_WRAPPER_CLASS = DIAGRAM_CLASS + "-toolbar-wrapper";
var DIAGRAM_CONTENT_WRAPPER_CLASS = DIAGRAM_CLASS + "-content-wrapper";
var DIAGRAM_DRAWER_WRAPPER_CLASS = DIAGRAM_CLASS + "-drawer-wrapper";
var DIAGRAM_CONTENT_CLASS = DIAGRAM_CLASS + "-content";
var DIAGRAM_KEY_FIELD = "id";
var DIAGRAM_TEXT_FIELD = "text";
var DIAGRAM_TYPE_FIELD = "type";
var DIAGRAM_PARENT_KEY_FIELD = "parentId";
var DIAGRAM_ITEMS_FIELD = "items";
var DIAGRAM_FROM_FIELD = "from";
var DIAGRAM_TO_FIELD = "to";
var DIAGRAM_CONNECTION_POINT_SIDES = ["north", "east", "south", "west"];
var DIAGRAM_NAMESPACE = "dxDiagramEvent";
var FULLSCREEN_CHANGE_EVENT_NAME = _utils2.default.addNamespace("fullscreenchange", DIAGRAM_NAMESPACE);
var IE_FULLSCREEN_CHANGE_EVENT_NAME = _utils2.default.addNamespace("msfullscreenchange", DIAGRAM_NAMESPACE);
var WEBKIT_FULLSCREEN_CHANGE_EVENT_NAME = _utils2.default.addNamespace("webkitfullscreenchange", DIAGRAM_NAMESPACE);
var MOZ_FULLSCREEN_CHANGE_EVENT_NAME = _utils2.default.addNamespace("mozfullscreenchange", DIAGRAM_NAMESPACE);
var Diagram = function(_Widget) {
    _inherits(Diagram, _Widget);

    function Diagram() {
        _classCallCheck(this, Diagram);
        return _possibleConstructorReturn(this, (Diagram.__proto__ || Object.getPrototypeOf(Diagram)).apply(this, arguments))
    }
    _createClass(Diagram, [{
        key: "_init",
        value: function() {
            this._updateDiagramLockCount = 0;
            _get(Diagram.prototype.__proto__ || Object.getPrototypeOf(Diagram.prototype), "_init", this).call(this);
            this._initDiagram()
        }
    }, {
        key: "_initMarkup",
        value: function() {
            _get(Diagram.prototype.__proto__ || Object.getPrototypeOf(Diagram.prototype), "_initMarkup", this).call(this);
            var isServerSide = !(0, _window.hasWindow)();
            this.$element().addClass(DIAGRAM_CLASS);
            this._renderToolbar();
            var $contentWrapper = (0, _renderer2.default)("<div>").addClass(DIAGRAM_CONTENT_WRAPPER_CLASS).appendTo(this.$element());
            this._renderLeftPanel($contentWrapper);
            var $drawerWrapper = (0, _renderer2.default)("<div>").addClass(DIAGRAM_DRAWER_WRAPPER_CLASS).appendTo($contentWrapper);
            var $drawer = (0, _renderer2.default)("<div>").appendTo($drawerWrapper);
            var $content = (0, _renderer2.default)("<div>").addClass(DIAGRAM_CONTENT_CLASS).appendTo($drawer);
            this._renderRightPanel($drawer);
            this._renderContextMenu($content);
            !isServerSide && this._diagramInstance.createDocument($content[0])
        }
    }, {
        key: "_renderToolbar",
        value: function() {
            var _this2 = this;
            var $toolbarWrapper = (0, _renderer2.default)("<div>").addClass(DIAGRAM_TOOLBAR_WRAPPER_CLASS).appendTo(this.$element());
            this._toolbarInstance = this._createComponent($toolbarWrapper, _uiDiagram2.default, {
                onContentReady: function(e) {
                    return _this2._diagramInstance.barManager.registerBar(e.component.bar)
                },
                onPointerUp: this._onPanelPointerUp.bind(this),
                "export": this.option("export")
            })
        }
    }, {
        key: "_renderLeftPanel",
        value: function($parent) {
            var _this3 = this;
            var isServerSide = !(0, _window.hasWindow)();
            var $leftPanel = (0, _renderer2.default)("<div>").appendTo($parent);
            this._leftPanel = this._createComponent($leftPanel, _uiDiagram4.default, {
                dataSources: this._getDataSources(),
                customShapes: this._getCustomShapes(),
                onShapeCategoryRendered: function(e) {
                    if (isServerSide) {
                        return
                    }
                    var $toolboxContainer = (0, _renderer2.default)(e.$element);
                    _this3._diagramInstance.createToolbox($toolboxContainer[0], 40, 8, {
                        "data-toggle": "shape-toolbox-tooltip"
                    }, e.category);
                    _this3._createTooltips($parent, $toolboxContainer.find('[data-toggle="shape-toolbox-tooltip"]'))
                },
                onDataToolboxRendered: function(e) {
                    return !isServerSide && _this3._diagramInstance.createDataSourceToolbox(e.key, e.$element[0])
                },
                onPointerUp: this._onPanelPointerUp.bind(this)
            })
        }
    }, {
        key: "_createTooltips",
        value: function($container, targets) {
            var _this4 = this;
            targets.each(function(index, element) {
                var $target = (0, _renderer2.default)(element);
                var $tooltip = (0, _renderer2.default)("<div>").html($target.attr("title")).appendTo($container);
                _this4._tooltipInstance = _this4._createComponent($tooltip, _tooltip2.default, {
                    target: $target,
                    showEvent: "mouseenter",
                    hideEvent: "mouseleave",
                    position: "top",
                    animation: {
                        show: {
                            type: "fade",
                            from: 0,
                            to: 1,
                            delay: 500
                        },
                        hide: {
                            type: "fade",
                            from: 1,
                            to: 0,
                            delay: 100
                        }
                    }
                })
            })
        }
    }, {
        key: "_invalidateLeftPanel",
        value: function() {
            if (this._leftPanel) {
                this._leftPanel.option({
                    dataSources: this._getDataSources(),
                    customShapes: this._getCustomShapes()
                })
            }
        }
    }, {
        key: "_renderRightPanel",
        value: function($parent) {
            var _this5 = this;
            var drawer = this._createComponent($parent, _drawer2.default, {
                closeOnOutsideClick: true,
                openedStateMode: "overlap",
                position: "right",
                template: function($options) {
                    _this5._createComponent($options, _uiDiagram6.default, {
                        onContentReady: function(e) {
                            return _this5._diagramInstance.barManager.registerBar(e.component.bar)
                        },
                        onPointerUp: _this5._onPanelPointerUp.bind(_this5)
                    })
                }
            });
            this._toolbarInstance.option("onWidgetCommand", function(e) {
                if ("options" === e.name) {
                    drawer.toggle()
                }
            })
        }
    }, {
        key: "_onPanelPointerUp",
        value: function() {
            this._diagramInstance.captureFocus()
        }
    }, {
        key: "_renderContextMenu",
        value: function($mainElement) {
            var _this6 = this;
            var $contextMenu = (0, _renderer2.default)("<div>").appendTo(this.$element());
            this._createComponent($contextMenu, _uiDiagram8.default, {
                container: $mainElement,
                onContentReady: function(_ref) {
                    var component = _ref.component;
                    return _this6._diagramInstance.barManager.registerBar(component.bar)
                },
                onVisibleChanged: function(_ref2) {
                    var component = _ref2.component;
                    return _this6._diagramInstance.barManager.updateBarItemsState(component.bar)
                }
            })
        }
    }, {
        key: "_initDiagram",
        value: function() {
            var _getDiagram = (0, _diagram_importer.getDiagram)(),
                DiagramControl = _getDiagram.DiagramControl;
            this._diagramInstance = new DiagramControl;
            this._diagramInstance.onChanged = this._raiseDataChangeAction.bind(this);
            this._diagramInstance.onEdgeInserted = this._raiseEdgeInsertedAction.bind(this);
            this._diagramInstance.onEdgeUpdated = this._raiseEdgeUpdatedAction.bind(this);
            this._diagramInstance.onEdgeRemoved = this._raiseEdgeRemovedAction.bind(this);
            this._diagramInstance.onNodeInserted = this._raiseNodeInsertedAction.bind(this);
            this._diagramInstance.onNodeUpdated = this._raiseNodeUpdatedAction.bind(this);
            this._diagramInstance.onNodeRemoved = this._raiseNodeRemovedAction.bind(this);
            this._diagramInstance.onToolboxDragStart = this._raiseToolboxDragStart.bind(this);
            this._diagramInstance.onToolboxDragEnd = this._raiseToolboxDragEnd.bind(this);
            this._diagramInstance.onToggleFullscreen = this._onToggleFullscreen.bind(this);
            this._updateCustomShapes(this._getCustomShapes());
            this._refreshDataSources()
        }
    }, {
        key: "_refreshDataSources",
        value: function() {
            this._beginUpdateDiagram();
            this._refreshNodesDataSource();
            this._refreshEdgesDataSource();
            this._endUpdateDiagram()
        }
    }, {
        key: "_refreshNodesDataSource",
        value: function() {
            if (this._nodesOption) {
                this._nodesOption._disposeDataSource();
                delete this._nodesOption;
                delete this._nodes
            }
            if (this.option("nodes.dataSource")) {
                this._nodesOption = new _uiDiagram10.default(this);
                this._nodesOption.option("dataSource", this.option("nodes.dataSource"));
                this._nodesOption._refreshDataSource()
            }
        }
    }, {
        key: "_refreshEdgesDataSource",
        value: function() {
            if (this._edgesOption) {
                this._edgesOption._disposeDataSource();
                delete this._edgesOption;
                delete this._edges
            }
            if (this.option("edges.dataSource")) {
                this._edgesOption = new _uiDiagram12.default(this);
                this._edgesOption.option("dataSource", this.option("edges.dataSource"));
                this._edgesOption._refreshDataSource()
            }
        }
    }, {
        key: "_getDiagramData",
        value: function() {
            var value = void 0;
            var _getDiagram2 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram2.DiagramCommand;
            this._diagramInstance.commandManager.getCommand(DiagramCommand.Export).execute(function(data) {
                value = data
            });
            return value
        }
    }, {
        key: "_setDiagramData",
        value: function(data, keepExistingItems) {
            var _getDiagram3 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram3.DiagramCommand;
            this._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute({
                data: data,
                keepExistingItems: keepExistingItems
            })
        }
    }, {
        key: "_getDataSources",
        value: function() {
            return this.option("dataSources") || {}
        }
    }, {
        key: "_createDiagramDataSource",
        value: function(parameters) {
            var key = parameters.key || "0";
            var title = parameters.title || "Data Source";
            var nodes = parameters.nodes || {};
            var edges = parameters.edges || {};
            var data = {
                key: key,
                title: title,
                nodeDataSource: nodes.dataSource,
                edgeDataSource: edges.dataSource,
                nodeDataImporter: {
                    getKey: this._createGetter(nodes.keyExpr || DIAGRAM_KEY_FIELD),
                    setKey: this._createSetter(nodes.keyExpr || DIAGRAM_KEY_FIELD),
                    getText: this._createGetter(nodes.textExpr || DIAGRAM_TEXT_FIELD),
                    setText: this._createSetter(nodes.textExpr || DIAGRAM_TEXT_FIELD),
                    getType: this._createGetter(nodes.typeExpr || DIAGRAM_TYPE_FIELD),
                    setType: this._createSetter(nodes.typeExpr || DIAGRAM_TYPE_FIELD),
                    getParentKey: this._createGetter(nodes.parentKeyExpr || DIAGRAM_PARENT_KEY_FIELD),
                    setParentKey: this._createSetter(nodes.parentKeyExpr || DIAGRAM_PARENT_KEY_FIELD),
                    getItems: this._createGetter(nodes.itemsExpr || DIAGRAM_ITEMS_FIELD),
                    setItems: this._createSetter(nodes.itemsExpr || DIAGRAM_ITEMS_FIELD)
                },
                edgeDataImporter: {
                    getKey: this._createGetter(edges.keyExpr || DIAGRAM_KEY_FIELD),
                    setKey: this._createSetter(edges.keyExpr || DIAGRAM_KEY_FIELD),
                    getFrom: this._createGetter(edges.fromExpr || DIAGRAM_FROM_FIELD),
                    setFrom: this._createSetter(edges.fromExpr || DIAGRAM_FROM_FIELD),
                    getTo: this._createGetter(edges.toExpr || DIAGRAM_TO_FIELD),
                    setTo: this._createSetter(edges.toExpr || DIAGRAM_TO_FIELD)
                },
                layoutType: this._getDataSourceLayoutType(parameters.layout)
            };
            var _getDiagram4 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram4.DiagramCommand;
            this._diagramInstance.commandManager.getCommand(DiagramCommand.ImportDataSource).execute(data);
            var dataSources = this._getDataSources();
            dataSources[key] = data;
            this.option("dataSources", dataSources)
        }
    }, {
        key: "_getDataSourceLayoutType",
        value: function(layout) {
            var _getDiagram5 = (0, _diagram_importer.getDiagram)(),
                DataLayoutType = _getDiagram5.DataLayoutType;
            switch (layout) {
                case "tree":
                    return DataLayoutType.Tree;
                case "sugiyama":
                    return DataLayoutType.Sugiyama
            }
        }
    }, {
        key: "_deleteDiagramDataSource",
        value: function(key) {
            var dataSources = this._getDataSources();
            if (dataSources[key]) {
                var _getDiagram6 = (0, _diagram_importer.getDiagram)(),
                    DiagramCommand = _getDiagram6.DiagramCommand;
                this._diagramInstance.commandManager.getCommand(DiagramCommand.CloseDataSource).execute(key);
                delete dataSources[key];
                this.option("dataSources", dataSources)
            }
        }
    }, {
        key: "_nodesDataSourceChanged",
        value: function(nodes) {
            this._nodes = nodes;
            this._bindDiagramData()
        }
    }, {
        key: "_edgesDataSourceChanged",
        value: function(edges) {
            this._edges = edges;
            this._bindDiagramData()
        }
    }, {
        key: "_createGetter",
        value: function(expr) {
            return _data2.default.compileGetter(expr)
        }
    }, {
        key: "_createSetter",
        value: function(expr) {
            if (_type2.default.isFunction(expr)) {
                return expr
            }
            return _data2.default.compileSetter(expr)
        }
    }, {
        key: "_createOptionGetter",
        value: function(optionName) {
            var expr = this.option(optionName);
            return this._createGetter(expr)
        }
    }, {
        key: "_createOptionSetter",
        value: function(optionName) {
            var expr = this.option(optionName);
            return this._createSetter(expr)
        }
    }, {
        key: "_bindDiagramData",
        value: function() {
            if (this._updateDiagramLockCount || !this._isBindingMode()) {
                return
            }
            var _getDiagram7 = (0, _diagram_importer.getDiagram)(),
                DiagramCommand = _getDiagram7.DiagramCommand;
            var data = {
                nodeDataSource: this._nodes,
                edgeDataSource: this._edges,
                nodeDataImporter: {
                    getKey: this._createOptionGetter("nodes.keyExpr"),
                    setKey: this._createOptionSetter("nodes.keyExpr"),
                    getText: this._createOptionGetter("nodes.textExpr"),
                    setText: this._createOptionSetter("nodes.textExpr"),
                    getType: this._createOptionGetter("nodes.typeExpr"),
                    setType: this._createOptionSetter("nodes.typeExpr"),
                    getParentKey: this._createOptionGetter("nodes.parentKeyExpr"),
                    setParentKey: this._createOptionSetter("nodes.parentKeyExpr"),
                    getItems: this._createOptionGetter("nodes.itemsExpr"),
                    setItems: this._createOptionSetter("nodes.itemsExpr")
                },
                edgeDataImporter: {
                    getKey: this._createOptionGetter("edges.keyExpr"),
                    setKey: this._createOptionSetter("edges.keyExpr"),
                    getFrom: this._createOptionGetter("edges.fromExpr"),
                    setFrom: this._createOptionSetter("edges.fromExpr"),
                    getTo: this._createOptionGetter("edges.toExpr"),
                    setTo: this._createOptionSetter("edges.toExpr")
                },
                layoutType: this._getDataBindingLayoutType()
            };
            this._diagramInstance.commandManager.getCommand(DiagramCommand.BindDocument).execute(data)
        }
    }, {
        key: "_getDataBindingLayoutType",
        value: function() {
            var _getDiagram8 = (0, _diagram_importer.getDiagram)(),
                DataLayoutType = _getDiagram8.DataLayoutType;
            switch (this.option("layout")) {
                case "sugiyama":
                    return DataLayoutType.Sugiyama;
                default:
                    return DataLayoutType.Tree
            }
        }
    }, {
        key: "_isBindingMode",
        value: function() {
            return this._nodes || this._edges
        }
    }, {
        key: "_beginUpdateDiagram",
        value: function() {
            this._updateDiagramLockCount++
        }
    }, {
        key: "_endUpdateDiagram",
        value: function() {
            this._updateDiagramLockCount = Math.max(this._updateDiagramLockCount - 1, 0);
            if (!this._updateDiagramLockCount) {
                this._bindDiagramData()
            }
        }
    }, {
        key: "_getCustomShapes",
        value: function() {
            return this.option("customShapes") || []
        }
    }, {
        key: "_updateCustomShapes",
        value: function(customShapes, prevCustomShapes) {
            if (Array.isArray(prevCustomShapes)) {
                this._diagramInstance.removeCustomShapes(customShapes.map(function(s) {
                    return s.id
                }))
            }
            if (Array.isArray(customShapes)) {
                this._diagramInstance.addCustomShapes(customShapes.map(function(s) {
                    return {
                        id: s.id,
                        title: s.title,
                        svgUrl: s.svgUrl,
                        svgLeft: s.svgLeft,
                        svgTop: s.svgTop,
                        svgWidth: s.svgWidth,
                        svgHeight: s.svgHeight,
                        defaultWidth: s.defaultWidth,
                        defaultHeight: s.defaultHeight,
                        defaultText: s.defaultText,
                        allowHasText: s.allowHasText,
                        textLeft: s.textLeft,
                        textTop: s.textTop,
                        textWidth: s.textWidth,
                        textHeight: s.textHeight,
                        connectionPoints: s.connectionPoints && s.connectionPoints.map(function(pt) {
                            return {
                                x: pt.x,
                                y: pt.y,
                                side: DIAGRAM_CONNECTION_POINT_SIDES.indexOf(pt.side)
                            }
                        })
                    }
                }))
            }
        }
    }, {
        key: "_onToggleFullscreen",
        value: function(fullscreen) {
            this._changeNativeFullscreen(fullscreen);
            this.$element().toggleClass(DIAGRAM_FULLSCREEN_CLASS, fullscreen);
            this._diagramInstance.updateLayout()
        }
    }, {
        key: "_changeNativeFullscreen",
        value: function(setModeOn) {
            var window = (0, _window.getWindow)();
            if (window.self === window.top || setModeOn === this._inNativeFullscreen()) {
                return
            }
            if (setModeOn) {
                this._subscribeFullscreenNativeChanged()
            } else {
                this._unsubscribeFullscreenNativeChanged()
            }
            this._setNativeFullscreen(setModeOn)
        }
    }, {
        key: "_setNativeFullscreen",
        value: function(on) {
            var window = (0, _window.getWindow)(),
                document = window.self.document,
                body = window.self.document.body;
            if (on) {
                if (body.requestFullscreen) {
                    body.requestFullscreen()
                } else {
                    if (body.mozRequestFullscreen) {
                        body.mozRequestFullscreen()
                    } else {
                        if (body.webkitRequestFullscreen) {
                            body.webkitRequestFullscreen()
                        } else {
                            if (body.msRequestFullscreen) {
                                body.msRequestFullscreen()
                            }
                        }
                    }
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else {
                    if (document.mozCancelFullscreen) {
                        document.mozCancelFullscreen()
                    } else {
                        if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen()
                        } else {
                            if (document.msExitFullscreen) {
                                document.msExitFullscreen()
                            }
                        }
                    }
                }
            }
        }
    }, {
        key: "_inNativeFullscreen",
        value: function() {
            var document = (0, _window.getWindow)().document,
                fullscreenElement = document.fullscreenElement || document.msFullscreenElement || document.webkitFullscreenElement,
                isInFullscreen = fullscreenElement === document.body || document.webkitIsFullscreen;
            return !!isInFullscreen
        }
    }, {
        key: "_subscribeFullscreenNativeChanged",
        value: function() {
            var document = (0, _window.getWindow)().document,
                handler = this._onNativeFullscreenChangeHandler.bind(this);
            _events_engine2.default.on(document, FULLSCREEN_CHANGE_EVENT_NAME, handler);
            _events_engine2.default.on(document, IE_FULLSCREEN_CHANGE_EVENT_NAME, handler);
            _events_engine2.default.on(document, WEBKIT_FULLSCREEN_CHANGE_EVENT_NAME, handler);
            _events_engine2.default.on(document, MOZ_FULLSCREEN_CHANGE_EVENT_NAME, handler)
        }
    }, {
        key: "_unsubscribeFullscreenNativeChanged",
        value: function() {
            var document = (0, _window.getWindow)().document;
            _events_engine2.default.off(document, FULLSCREEN_CHANGE_EVENT_NAME);
            _events_engine2.default.off(document, IE_FULLSCREEN_CHANGE_EVENT_NAME);
            _events_engine2.default.off(document, WEBKIT_FULLSCREEN_CHANGE_EVENT_NAME);
            _events_engine2.default.off(document, MOZ_FULLSCREEN_CHANGE_EVENT_NAME)
        }
    }, {
        key: "_onNativeFullscreenChangeHandler",
        value: function() {
            if (!this._inNativeFullscreen()) {
                this._unsubscribeFullscreenNativeChanged();
                this._setFullscreen(false)
            }
        }
    }, {
        key: "getData",
        value: function() {
            return this._getDiagramData()
        }
    }, {
        key: "setData",
        value: function(data, updateExistingItemsOnly) {
            this._setDiagramData(data, updateExistingItemsOnly);
            this._raiseDataChangeAction()
        }
    }, {
        key: "createDataSource",
        value: function(parameters) {
            this._createDiagramDataSource(parameters)
        }
    }, {
        key: "deleteDataSource",
        value: function(key) {
            this._deleteDiagramDataSource(key)
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(Diagram.prototype.__proto__ || Object.getPrototypeOf(Diagram.prototype), "_getDefaultOptions", this).call(this), {
                onDataChanged: null,
                nodes: {
                    dataSource: null,
                    keyExpr: DIAGRAM_KEY_FIELD,
                    textExpr: DIAGRAM_TEXT_FIELD,
                    typeExpr: DIAGRAM_TYPE_FIELD,
                    parentKeyExpr: DIAGRAM_PARENT_KEY_FIELD,
                    itemsExpr: DIAGRAM_ITEMS_FIELD
                },
                edges: {
                    dataSource: null,
                    keyExpr: DIAGRAM_KEY_FIELD,
                    fromExpr: DIAGRAM_FROM_FIELD,
                    toExpr: DIAGRAM_TO_FIELD
                },
                layout: "tree",
                customShapes: [],
                "export": {
                    fileName: "Diagram",
                    proxyUrl: void 0
                }
            })
        }
    }, {
        key: "_createDataChangeAction",
        value: function() {
            this._dataChangeAction = this._createActionByOption("onDataChanged")
        }
    }, {
        key: "_raiseDataChangeAction",
        value: function() {
            if (!this.option("onDataChanged")) {
                return
            }
            if (!this._dataChangeAction) {
                this._createDataChangeAction()
            }
            this._dataChangeAction({
                data: this.getData()
            })
        }
    }, {
        key: "_raiseEdgeInsertedAction",
        value: function(data, callback) {
            if (this._edgesOption) {
                this._edgesOption.insert(data, callback)
            }
        }
    }, {
        key: "_raiseEdgeUpdatedAction",
        value: function(key, data, callback) {
            if (this._edgesOption) {
                this._edgesOption.update(key, data, callback)
            }
        }
    }, {
        key: "_raiseEdgeRemovedAction",
        value: function(key, callback) {
            if (this._edgesOption) {
                this._edgesOption.remove(key, callback)
            }
        }
    }, {
        key: "_raiseNodeInsertedAction",
        value: function(data, callback) {
            if (this._nodesOption) {
                this._nodesOption.insert(data, callback)
            }
        }
    }, {
        key: "_raiseNodeUpdatedAction",
        value: function(key, data, callback) {
            if (this._nodesOption) {
                this._nodesOption.update(key, data, callback)
            }
        }
    }, {
        key: "_raiseNodeRemovedAction",
        value: function(key, callback) {
            if (this._nodesOption) {
                this._nodesOption.remove(key, callback)
            }
        }
    }, {
        key: "_raiseToolboxDragStart",
        value: function() {
            if (this._leftPanel) {
                this._leftPanel.$element().addClass("dx-skip-gesture-event")
            }
        }
    }, {
        key: "_raiseToolboxDragEnd",
        value: function() {
            if (this._leftPanel) {
                this._leftPanel.$element().removeClass("dx-skip-gesture-event")
            }
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            switch (args.name) {
                case "nodes":
                    this._refreshNodesDataSource();
                    break;
                case "edges":
                    this._refreshEdgesDataSource();
                    break;
                case "layout":
                    this._refreshDataSources();
                    break;
                case "customShapes":
                    this._updateCustomShapes(args.value, args.previousValue);
                    this._invalidateLeftPanel();
                    break;
                case "onDataChanged":
                    this._createDataChangeAction();
                    break;
                case "dataSources":
                    this._invalidateLeftPanel();
                    break;
                case "export":
                    this._toolbarInstance.option("export", this.option("export"));
                    break;
                default:
                    _get(Diagram.prototype.__proto__ || Object.getPrototypeOf(Diagram.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }]);
    return Diagram
}(_ui2.default);
(0, _component_registrator2.default)("dxDiagram", Diagram);
module.exports = Diagram;
