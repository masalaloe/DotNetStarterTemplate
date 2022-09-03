/**
* DevExtreme (ui/gallery.d.ts)
* Version: 19.1.7
* Build date: Fri Oct 11 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxGallery(): JQuery;
    dxGallery(options: "instance"): DevExpress.ui.dxGallery;
    dxGallery(options: string): any;
    dxGallery(options: string, ...params: any[]): any;
    dxGallery(options: DevExpress.ui.dxGalleryOptions): JQuery;
}
}
export default DevExpress.ui.dxGallery;
export type Options = DevExpress.ui.dxGalleryOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.ui.dxGalleryOptions;