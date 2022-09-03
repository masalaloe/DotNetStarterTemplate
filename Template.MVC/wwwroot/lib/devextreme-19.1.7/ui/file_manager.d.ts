/**
* DevExtreme (ui/file_manager.d.ts)
* Version: 19.1.7
* Build date: Fri Oct 11 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxFileManager(): JQuery;
    dxFileManager(options: "instance"): DevExpress.ui.dxFileManager;
    dxFileManager(options: string): any;
    dxFileManager(options: string, ...params: any[]): any;
    dxFileManager(options: DevExpress.ui.dxFileManagerOptions): JQuery;
}
}
export default DevExpress.ui.dxFileManager;
export type Options = DevExpress.ui.dxFileManagerOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.ui.dxFileManagerOptions;