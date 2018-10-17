/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import { Widget } from '@phosphor/widgets';

/**
 * An interface describing a dataset and a url for accessing it.
 */
export interface IDataLocation {
  /**
   * A mimetype for the dataset. This acts as the primary key for deciding
   * which renderer to dispatch.
   */
  mimeType: string;

  /**
   * A URL to access the dataset. It may be a URL to a static
   * file, or it may be an API endpoint with the ability to do
   * complex queries/operations.
   */
  url: string;
}

/**
 * A registry for renderers that know how to render remote
 * (potentially large) data.
 */
export class DataRendererRegistry {
  createRenderer(
    options: IRenderMime.IRendererOptions
  ): DataRendererRegistry.IRenderer {
    return new Private.ImageRenderer();
  }
}

export namespace DataRendererRegistry {
  export interface IRenderer extends Widget {
    render(data: IDataLocation): Promise<void>;
  }
}

namespace Private {
  export class ImageRenderer extends Widget {
    constructor() {
      super();
      let image = document.createElement('img');
      this.node.appendChild(image);
    }

    render(data: IDataLocation): Promise<void> {
      (this.node.children[0] as HTMLImageElement).src = data.url;
      return Promise.resolve(void 0);
    }
  }
}
