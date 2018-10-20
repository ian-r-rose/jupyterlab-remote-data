/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { Message } from '@phosphor/messaging';

import { Widget } from '@phosphor/widgets';

import { RemoteDataRendererRegistry, IDataLocation } from './registry';

import leaflet from 'leaflet';

import 'leaflet/dist/leaflet.css';

/**
 * The CSS class to add to the GeoJSON Widget.
 */
const CSS_CLASS = 'jp-COGViewer';

/**
 * The url template that leaflet tile layers.
 * See http://leafletjs.com/reference-1.0.3.html#tilelayer
 */
const URL_TEMPLATE: string =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const MIME_TYPE = 'image/geotiff';

/**
 * The options for leaflet tile layers.
 * See http://leafletjs.com/reference-1.0.3.html#tilelayer
 */
const LAYER_OPTIONS: leaflet.TileLayerOptions = {
  attribution:
    'Map data (c) <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  minZoom: 0,
  maxZoom: 18
};

/*tslint:disable-next-line */
const GeoTiffLayer = leaflet.GridLayer.extend({
  createTile: function(coords: any) {
    const tile = document.createElement('canvas');
    /*tslint:disable-next-line */
    const tileSize = this.getTileSize();
    tile.setAttribute('width', tileSize.x);
    tile.setAttribute('height', tileSize.y);
    const ctx = tile.getContext('2d');

    ctx.beginPath();
    ctx.arc(
      tileSize.x / 2,
      tileSize.x / 2,
      4 + coords.z * 4,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
    return tile;
  }
});

/**
 * A data renderer for images.
 */
export class CloudOptimizedGeoTIFFRenderer extends Widget
  implements RemoteDataRendererRegistry.IRenderer {
  constructor() {
    super();
    this.addClass(CSS_CLASS);
    // Create leaflet map object
    // trackResize option set to false as it is not needed to track
    // window.resize events since we have individual phosphor resize
    // events.
    this._map = leaflet.map(this.node, {
      trackResize: false
    });
  }

  /**
   * Dispose of the widget.
   */
  dispose(): void {
    // Dispose of leaflet map
    this._map.remove();
    this._map = null;
    super.dispose();
  }

  /**
   * Render GeoJSON into this widget's node.
   */
  async render(data: IDataLocation): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Add leaflet tile layer to map
      leaflet.tileLayer(URL_TEMPLATE, LAYER_OPTIONS).addTo(this._map);
      const layer = new GeoTiffLayer();
      layer.addTo(this._map);
      this.update();
      resolve();
    });
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    if (this.parent.hasClass('jp-OutputArea-child')) {
      // Disable scroll zoom by default to avoid conflicts with notebook scroll
      this._map.scrollWheelZoom.disable();
      // Enable scroll zoom on map focus
      this._map.on('blur', () => {
        this._map.scrollWheelZoom.disable();
      });
      // Disable scroll zoom on blur
      this._map.on('focus', () => {
        this._map.scrollWheelZoom.enable();
      });
    }
    this.update();
  }

  /**
   * A message handler invoked on an `'after-show'` message.
   */
  protected onAfterShow(msg: Message): void {
    this.update();
  }

  /**
   * A message handler invoked on a `'resize'` message.
   */
  protected onResize(msg: Widget.ResizeMessage): void {
    this.update();
  }

  /**
   * A message handler invoked on an `'update-request'` message.
   */
  protected onUpdateRequest(msg: Message): void {
    // Update map size after update
    if (this.isVisible) {
      this._map.invalidateSize();
    }
    this._map.fitBounds([[40.712, -74.227], [40.774, -74.125]]);
  }

  private _map: leaflet.Map;
}

/**
 * A mime renderer factory for GeoJSON data.
 */
export const cloudOptimizedGeoTIFFFactory: RemoteDataRendererRegistry.IRendererFactory = {
  mimeTypes: [MIME_TYPE],
  createRenderer: options => new CloudOptimizedGeoTIFFRenderer()
};
