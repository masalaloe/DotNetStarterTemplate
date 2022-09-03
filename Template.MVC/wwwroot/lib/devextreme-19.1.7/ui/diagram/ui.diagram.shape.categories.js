/**
 * DevExtreme (ui/diagram/ui.diagram.shape.categories.js)
 * Version: 19.1.7
 * Build date: Fri Oct 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _diagram_importer = require("./diagram_importer");
var ShapeCategories = {
    load: function(showCustomShapes) {
        var ShapeCategory = (0, _diagram_importer.getDiagram)().ShapeCategory;
        var result = [{
            category: ShapeCategory.General,
            title: "General"
        }, {
            category: ShapeCategory.Flowchart,
            title: "Flow Chart"
        }];
        if (showCustomShapes) {
            result.push({
                category: ShapeCategory.Custom,
                title: "Custom"
            })
        }
        return result
    }
};
module.exports = ShapeCategories;
