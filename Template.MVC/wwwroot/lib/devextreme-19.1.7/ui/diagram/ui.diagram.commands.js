/**
 * DevExtreme (ui/diagram/ui.diagram.commands.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _diagram_importer = require("./diagram_importer");
var _file_saver = require("../../exporter/file_saver");
var _type = require("../../core/utils/type");
var _window = require("../../core/utils/window");
var SEPARATOR = {
    widget: "separator"
};
var CSS_CLASSES = {
    SMALL_SELECT: "dx-diagram-select-sm",
    BUTTON_SELECT: "dx-diagram-select-b",
    BUTTON_COLOR: "dx-diagram-color-b"
};
var DiagramCommands = {
    getToolbar: function() {
        var _this = this;
        var _getDiagram = (0, _diagram_importer.getDiagram)(),
            DiagramCommand = _getDiagram.DiagramCommand;
        return [{
            command: DiagramCommand.Undo,
            hint: "Undo",
            icon: "undo",
            text: "Undo"
        }, {
            command: DiagramCommand.Redo,
            hint: "Redo",
            icon: "redo",
            text: "Redo"
        }, SEPARATOR, {
            command: DiagramCommand.FontName,
            beginGroup: true,
            widget: "dxSelectBox",
            items: ["Arial", "Arial Black", "Helvetica", "Times New Roman", "Courier New", "Courier", "Verdana", "Georgia", "Comic Sans MS", "Trebuchet MS"]
        }, {
            command: DiagramCommand.FontSize,
            widget: "dxSelectBox",
            items: ["8pt", "9pt", "10pt", "11pt", "12pt", "14pt", "16pt", "18pt", "20pt", "22pt", "24pt", "26pt", "28pt", "36pt", "48pt", "72pt"],
            cssClass: CSS_CLASSES.SMALL_SELECT
        }, SEPARATOR, {
            command: DiagramCommand.Bold,
            hint: "Bold",
            text: "Bold",
            icon: "bold"
        }, {
            command: DiagramCommand.Italic,
            hint: "Italic",
            text: "Italic",
            icon: "italic"
        }, {
            command: DiagramCommand.Underline,
            hint: "Underline",
            text: "Underline",
            icon: "underline"
        }, SEPARATOR, {
            command: DiagramCommand.FontColor,
            text: "Text Color",
            widget: "dxColorBox",
            icon: "dx-icon dx-icon-color",
            cssClass: CSS_CLASSES.BUTTON_COLOR
        }, {
            command: DiagramCommand.StrokeColor,
            text: "Line Color",
            widget: "dxColorBox",
            icon: "dx-icon dx-icon-background",
            cssClass: CSS_CLASSES.BUTTON_COLOR
        }, {
            command: DiagramCommand.FillColor,
            text: "Fill Color",
            widget: "dxColorBox",
            icon: "dx-diagram-i dx-diagram-i-button-fill",
            cssClass: CSS_CLASSES.BUTTON_COLOR
        }, SEPARATOR, {
            command: DiagramCommand.TextLeftAlign,
            hint: "Align Left",
            text: "Align Left",
            icon: "alignleft",
            beginGroup: true
        }, {
            command: DiagramCommand.TextCenterAlign,
            hint: "Align Center",
            text: "Center",
            icon: "aligncenter"
        }, {
            command: DiagramCommand.TextRightAlign,
            hint: "Align Right",
            text: "Align Right",
            icon: "alignright"
        }, SEPARATOR, {
            command: DiagramCommand.ConnectorLineOption,
            widget: "dxSelectBox",
            hint: "Line Type",
            items: [{
                value: 0,
                icon: "dx-diagram-i-connector-straight dx-diagram-i",
                hint: "Straight"
            }, {
                value: 1,
                icon: "dx-diagram-i-connector-orthogonal dx-diagram-i",
                hint: "Orthogonal"
            }],
            displayExpr: "name",
            valueExpr: "value",
            cssClass: CSS_CLASSES.BUTTON_SELECT
        }, {
            command: DiagramCommand.ConnectorStartLineEnding,
            widget: "dxSelectBox",
            items: [{
                value: 0,
                icon: "dx-diagram-i-connector-begin-none dx-diagram-i",
                hint: "None"
            }, {
                value: 1,
                icon: "dx-diagram-i-connector-begin-arrow dx-diagram-i",
                hint: "Arrow"
            }],
            displayExpr: "name",
            valueExpr: "value",
            hint: "Line Start",
            cssClass: CSS_CLASSES.BUTTON_SELECT
        }, {
            command: DiagramCommand.ConnectorEndLineEnding,
            widget: "dxSelectBox",
            items: [{
                value: 0,
                icon: "dx-diagram-i-connector-end-none dx-diagram-i",
                hint: "None"
            }, {
                value: 1,
                icon: "dx-diagram-i-connector-end-arrow dx-diagram-i",
                hint: "Arrow"
            }],
            displayExpr: "name",
            valueExpr: "value",
            hint: "Line End",
            cssClass: CSS_CLASSES.BUTTON_SELECT
        }, SEPARATOR, {
            widget: "dxButton",
            icon: "export",
            text: "Export",
            items: [{
                command: DiagramCommand.ExportSvg,
                text: "Export to SVG",
                getParameter: function(widget) {
                    return function(dataURI) {
                        return _this._exportTo(widget, dataURI, "SVG", "image/svg+xml")
                    }
                }
            }, {
                command: DiagramCommand.ExportPng,
                text: "Export to PNG",
                getParameter: function(widget) {
                    return function(dataURI) {
                        return _this._exportTo(widget, dataURI, "PNG", "image/png")
                    }
                }
            }, {
                command: DiagramCommand.ExportJpg,
                text: "Export to JPEG",
                getParameter: function(widget) {
                    return function(dataURI) {
                        return _this._exportTo(widget, dataURI, "JPEG", "image/jpeg")
                    }
                }
            }]
        }, {
            widget: "dxButton",
            text: "Auto Layout",
            showText: "always",
            items: [{
                text: "Tree",
                items: [{
                    command: DiagramCommand.AutoLayoutTreeVertical,
                    text: "Vertical"
                }, {
                    command: DiagramCommand.AutoLayoutTreeHorizontal,
                    text: "Horizontal"
                }]
            }, {
                text: "Layered",
                items: [{
                    command: DiagramCommand.AutoLayoutLayeredVertical,
                    text: "Vertical"
                }, {
                    command: DiagramCommand.AutoLayoutLayeredHorizontal,
                    text: "Horizontal"
                }]
            }]
        }, {
            command: DiagramCommand.Fullscreen,
            hint: "Fullscreen",
            text: "Fullscreen",
            icon: "dx-diagram-i dx-diagram-i-button-fullscreen",
            cssClass: CSS_CLASSES.BUTTON_COLOR
        }]
    },
    getOptions: function() {
        var _getDiagram2 = (0, _diagram_importer.getDiagram)(),
            DiagramCommand = _getDiagram2.DiagramCommand;
        return [{
            command: DiagramCommand.Units,
            text: "Units",
            widget: "dxSelectBox"
        }, {
            command: DiagramCommand.PageSize,
            text: "Page Size",
            widget: "dxSelectBox",
            getValue: function(v) {
                return JSON.parse(v)
            },
            setValue: function(v) {
                return JSON.stringify(v)
            }
        }, {
            command: DiagramCommand.PageLandscape,
            text: "Page Landscape",
            widget: "dxCheckBox"
        }, {
            command: DiagramCommand.PageColor,
            text: "Page Color",
            widget: "dxColorBox",
            beginGroup: true
        }, {
            command: DiagramCommand.ShowGrid,
            text: "Show Grid",
            widget: "dxCheckBox",
            beginGroup: true
        }, {
            command: DiagramCommand.SnapToGrid,
            text: "Snap to Grid",
            widget: "dxCheckBox"
        }, {
            command: DiagramCommand.GridSize,
            text: "Grid Size",
            widget: "dxSelectBox"
        }, {
            command: DiagramCommand.ZoomLevel,
            text: "Zoom Level",
            widget: "dxSelectBox",
            beginGroup: true
        }]
    },
    getContextMenu: function() {
        var _getDiagram3 = (0, _diagram_importer.getDiagram)(),
            DiagramCommand = _getDiagram3.DiagramCommand;
        return [{
            command: DiagramCommand.Cut,
            text: "Cut"
        }, {
            command: DiagramCommand.Copy,
            text: "Copy"
        }, {
            command: DiagramCommand.Paste,
            text: "Paste"
        }, {
            command: DiagramCommand.SelectAll,
            text: "Select All",
            beginGroup: true
        }, {
            command: DiagramCommand.Delete,
            text: "Delete",
            beginGroup: true
        }, {
            command: DiagramCommand.BringToFront,
            text: "Bring to Front",
            beginGroup: true
        }, {
            command: DiagramCommand.SendToBack,
            text: "Send to Back"
        }, {
            command: DiagramCommand.Lock,
            text: "Lock",
            beginGroup: true
        }, {
            command: DiagramCommand.Unlock,
            text: "Unlock"
        }]
    },
    _exportTo: function(widget, dataURI, format, mimeString) {
        var window = (0, _window.getWindow)();
        if (window && window.atob && (0, _type.isFunction)(window.Blob)) {
            var blob = this._getBlobByDataURI(window, dataURI, mimeString);
            var options = widget.option("export");
            _file_saver.fileSaver.saveAs(options.fileName || "foo", format, blob, options.proxyURL)
        }
    },
    _getBlobByDataURI: function(window, dataURI, mimeString) {
        var byteString = window.atob(dataURI.split(",")[1]);
        var arrayBuffer = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(arrayBuffer);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
        }
        var dataView = new DataView(arrayBuffer);
        return new window.Blob([dataView], {
            type: mimeString
        })
    }
};
module.exports = DiagramCommands;
