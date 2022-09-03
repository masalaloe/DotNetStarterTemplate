/**
* DevExtreme (ui/diagram.d.ts)
* Version: 19.1.7
* Build date: Fri Oct 11 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxDiagram(): JQuery;
    dxDiagram(options: "instance"): DevExpress.ui.dxDiagram;
    dxDiagram(options: string): any;
    dxDiagram(options: string, ...params: any[]): any;
    dxDiagram(options: DevExpress.ui.dxDiagramOptions): JQuery;
}
}
export default DevExpress.ui.dxDiagram;
export type Options = DevExpress.ui.dxDiagramOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.ui.dxDiagramOptions;