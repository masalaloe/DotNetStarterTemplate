/**
* DevExtreme (ui/drop_down_button.d.ts)
* Version: 19.1.7
* Build date: Fri Oct 11 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxDropDownButton(): JQuery;
    dxDropDownButton(options: "instance"): DevExpress.ui.dxDropDownButton;
    dxDropDownButton(options: string): any;
    dxDropDownButton(options: string, ...params: any[]): any;
    dxDropDownButton(options: DevExpress.ui.dxDropDownButtonOptions): JQuery;
}
}
export default DevExpress.ui.dxDropDownButton;
export type Options = DevExpress.ui.dxDropDownButtonOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.ui.dxDropDownButtonOptions;