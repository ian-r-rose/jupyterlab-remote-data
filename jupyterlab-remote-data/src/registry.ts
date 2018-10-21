/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import { Widget } from '@phosphor/widgets';

import { defaultFactories } from './factories';

import { cloudOptimizedGeoTIFFFactory } from './cog';

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
 *
 * #### Notes
 *
 * This is distinct from, but similar to, the JupyterLab application
 * rendermime registry. That one is intended is for in-memory data,
 * and has a live data model which allows changes in multiple views
 * to be reflected in simultaneously.
 *
 * That model works less well when the data is large, and may need to
 * be streamed or otherwise chunked. That is what this registry is intended
 * for. All renderers are given an `IDataLocation`, which provides
 * a URL for interacting with remote data. It could be as simple as an
 * image, or as complex as a remote SQL server. All that is required
 * is that there is a base URL which can act as an entrypoint to the data.
 */
export class RemoteDataRendererRegistry {
  /**
   * Construct a new RemoteDataRendererRegistry.
   */
  constructor(options: RemoteDataRendererRegistry.IOptions = {}) {
    const initialFactories = options.initialFactories || defaultFactories;
    for (let factory of initialFactories) {
      this.addFactory(factory);
    }
    this.addFactory(cloudOptimizedGeoTIFFFactory);
  }

  /**
   * Add a new factory to the registry.
   *
   * @param factory - A factory that create renderers for a data source.
   */
  addFactory(factory: RemoteDataRendererRegistry.IRendererFactory): void {
    for (let mt of factory.mimeTypes) {
      this._factories[mt] = factory;
    }
  }

  /**
   * Remove a mimeType from the registry.
   *
   * @param mimeType - the type to remove.
   */
  removeMimeType(mimeType: string): void {
    delete this._factories[mimeType];
  }

  /**
   * Given a set of renderer options, create a renderer.
   * If the mimetype of the options cannot be found, an error is thrown.
   *
   * @param - The options for creating the renderer. Identical to those of the
   *   application rendermime registry.
   *
   * @returns a new renderer.
   */
  createRenderer(
    options: IRenderMime.IRendererOptions
  ): RemoteDataRendererRegistry.IRenderer {
    const mime = options.mimeType;
    if (!(mime in this._factories)) {
      throw Error(`MIME Type ${mime} is not known to the registry`);
    }
    const factory = this._factories[mime];
    return factory.createRenderer(options);
  }

  private _factories: {
    [key: string]: RemoteDataRendererRegistry.IRendererFactory;
  } = {};
}

/**
 * A namespace for RemoteDataRendererRegistry statics.
 */
export namespace RemoteDataRendererRegistry {
  /**
   * Options for creating a RemoteDataRendererRegistry.
   */
  export interface IOptions {
    /**
     * A list of initial factories for the registry.
     */
    initialFactories?: IRendererFactory[];
  }

  /**
   * An interface for a renderer factory.
   */
  export interface IRendererFactory {
    /**
     * A list of mime types that the factory can render.
     */
    readonly mimeTypes: string[];

    /**
     * A function to create a new renderer.
     *
     * @param options - the options for the renderer.
     *
     * @returns a new renderer.
     */
    createRenderer(options: IRenderMime.IRendererOptions): IRenderer;
  }

  /**
   * An interface for a data renderer.
   *
   * #### Notes
   * This is similar to the IRenderMime.IRenderer, but instead of
   * taking a mimebundle as its argument, it takes an `IDataLocation`.
   */
  export interface IRenderer extends Widget {
    render(data: IDataLocation): Promise<void>;
  }
}
