/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import { PanelLayout, Widget } from '@phosphor/widgets';

import { DataRendererRegistry, IDataLocation } from './registry';

export const JUPYTER_DATASET_MIMETYPE = 'application/vnd.jupyter.dataset+json';

/**
 * A widget factory for rendered datasets.
 */
export const dataMimeRendererFactory: IRenderMime.IRendererFactory = {
  safe: false,
  mimeTypes: [JUPYTER_DATASET_MIMETYPE],
  createRenderer: options => new DataMimeRenderer(options)
};

/**
 * A renderer that dispatches rendering to something registered with it.
 */
export class DataMimeRenderer extends Widget implements IRenderMime.IRenderer {
  /**
   * Construct a new DataRenderer.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._options = options;
    this.layout = new PanelLayout();
    this._renderers = new DataRendererRegistry();
  }

  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    // Get the dataset from the mime model.
    const data = (model.data[
      JUPYTER_DATASET_MIMETYPE
    ] as unknown) as IDataLocation;
    if (!data) {
      return Promise.resolve(void 0);
    }

    if (this._content) {
      this._content.parent = null;
      this._content.dispose();
    }
    this._content = this._renderers.createRenderer({
      ...this._options,
      mimeType: data.mimeType
    });
    (this.layout as PanelLayout).addWidget(this._content);
    return this._content.render((data as unknown) as IDataLocation);
  }

  private _options: IRenderMime.IRendererOptions;
  private _content: DataRendererRegistry.IRenderer | undefined;
  private _renderers: DataRendererRegistry;
}
