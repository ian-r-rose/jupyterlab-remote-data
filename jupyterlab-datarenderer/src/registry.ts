/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import { Widget } from '@phosphor/widgets';

import { defaultFactories } from './factories';

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
  constructor(options: DataRendererRegistry.IOptions = {}) {
    const initialFactories = options.initialFactories || defaultFactories;
    for (let factory of initialFactories) {
      this.addFactory(factory);
    }
  }

  addFactory(factory: DataRendererRegistry.IRendererFactory): void {
    for (let mt of factory.mimeTypes) {
      this._factories[mt] = factory;
    }
  }
  removeMimeType(mimeType: string): void {
    delete this._factories[mimeType];
  }

  createRenderer(
    options: IRenderMime.IRendererOptions
  ): DataRendererRegistry.IRenderer {
    const mime = options.mimeType;
    if (!(mime in this._factories)) {
      throw Error(`MIME Type ${mime} is not known to the registry`);
    }
    const factory = this._factories[mime];
    return factory.createRenderer(options);
  }

  private _factories: {
    [key: string]: DataRendererRegistry.IRendererFactory;
  } = {};
}

export namespace DataRendererRegistry {
  export interface IOptions {
    initialFactories?: IRendererFactory[];
  }

  export interface IRendererFactory {
    readonly mimeTypes: string[];
    createRenderer(options: IRenderMime.IRendererOptions): IRenderer;
  }

  export interface IRenderer extends Widget {
    render(data: IDataLocation): Promise<void>;
  }
}
