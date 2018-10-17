/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import { PanelLayout, Widget } from '@phosphor/widgets';

import { RemoteDataRendererRegistry, IDataLocation } from './registry';

export const JUPYTER_DATASET_MIMETYPE = 'application/vnd.jupyter.dataset+json';

/**
 * A widget factory for rendered remote datasets.
 */
export const remoteDataRendererFactory: IRenderMime.IRendererFactory = {
  safe: false,
  mimeTypes: [JUPYTER_DATASET_MIMETYPE],
  createRenderer: options => new RemoteDataMimeRenderer(options)
};

/**
 * A renderer that dispatches rendering to a remote data renderer
 * that is registered with the RemoteDataRendererRegistry.
 */
export class RemoteDataMimeRenderer extends Widget
  implements IRenderMime.IRenderer {
  /**
   * Construct a new RemoteDataMimeRenderer.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._options = options;
    this.layout = new PanelLayout();
    this._renderers = new RemoteDataRendererRegistry();
  }

  /**
   * Render the mime model. This uses the RemoteDataRendererRegistry
   * to create an instance of the appropriate mime type indicated
   * by the `IDataLocation` in the mime model.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    // Get the dataset from the mime model.
    const data = (model.data[
      JUPYTER_DATASET_MIMETYPE
    ] as unknown) as IDataLocation;
    if (!data) {
      return Promise.resolve(void 0);
    }

    // Possibly dispose of the old content.
    if (this._content) {
      this._content.parent = null;
      this._content.dispose();
    }
    /**
     * Create a new renderer with the right mime type.
     */
    this._content = this._renderers.createRenderer({
      ...this._options,
      mimeType: data.mimeType
    });
    (this.layout as PanelLayout).addWidget(this._content);

    // Render the data.
    return this._content.render((data as unknown) as IDataLocation);
  }

  private _options: IRenderMime.IRendererOptions;
  private _content: RemoteDataRendererRegistry.IRenderer | undefined;
  private _renderers: RemoteDataRendererRegistry;
}
