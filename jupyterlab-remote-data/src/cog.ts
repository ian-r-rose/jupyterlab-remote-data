/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { Message } from '@phosphor/messaging';

import { Widget } from '@phosphor/widgets';

import { RemoteDataRendererRegistry, IDataLocation } from './registry';

import * as GeoTIFF from 'geotiff';

import * as plotty from 'plotty';

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
const URL_TEMPLATE =
  'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png';

const RADIANT_URL =
  'https://bstlgagxwg.execute-api.us-east-1.amazonaws.com/production';

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
export const GeoTiffLayer = leaflet.GridLayer.extend({
  options: {
    url: ''
  },
  initialize: function(name: string, options: any) {
    /*tslint:disable-next-line */
    this.name = name;
    /*tslint:disable-next-line */
    (leaflet as any).setOptions(this, options);
  },
  createTile: function(coords: any, done: () => void) {
    const tile = document.createElement('canvas');
    /*tslint:disable-next-line */
    const tileSize = this.getTileSize();
    tile.setAttribute('width', tileSize.x);
    tile.setAttribute('height', tileSize.y);

    /*tslint:disable-next-line */
    GeoTIFF.fromUrl(this.options.url).then(async (tiff: any) => {
      const image = await tiff.getImage();
      const raster = await image.readRasters();
      const plot = new plotty.plot({
        tile,
        data: raster[0],
        width: image.getWidth(),
        height: image.getHeight(),
        domain: [0, 256],
        colorScale: 'viridis'
      });
      plot.render();
      done();
    });
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
    // Add leaflet tile layer to map
    leaflet.tileLayer(URL_TEMPLATE, LAYER_OPTIONS).addTo(this._map);
    const url = encodeURI(data.url);
    leaflet
      .tileLayer(`${RADIANT_URL}/tiles/{z}/{x}/{y}.jpg?url=${url}`)
      .addTo(this._map);
    const response = await fetch(`${RADIANT_URL}/bounds?url=${url}`);
    const responseData = await response.json();
    const b = (this._bounds = responseData.bounds);
    this._map.fitBounds([[b[1], b[0]], [b[3], b[2]]]);
    this.update();
    return;
  }

  /**
   * A message hander to be invoked on `'resize'` messages.
   */
  protected onResize(msg: Message): void {
    this.update();
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
   * A message handler invoked on an `'update-request'` message.
   */
  protected onUpdateRequest(msg: Message): void {
    // Update map size after update
    if (this.isVisible) {
      this._map.invalidateSize();
    }
    const b = this._bounds;
    if (!b) {
      return;
    }
    this._map.fitBounds([[b[1], b[0]], [b[3], b[2]]]);
  }

  private _bounds: number[] | undefined;
  private _map: leaflet.Map;
}

/**
 * A mime renderer factory for GeoJSON data.
 */
export const cloudOptimizedGeoTIFFFactory: RemoteDataRendererRegistry.IRendererFactory = {
  mimeTypes: [MIME_TYPE],
  createRenderer: options => new CloudOptimizedGeoTIFFRenderer()
};
