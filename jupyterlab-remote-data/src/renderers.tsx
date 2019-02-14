/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { Widget } from '@phosphor/widgets';

import { RemoteDataRendererRegistry, IDataLocation } from './registry';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

/**
 * A data renderer for images.
 */
export class ImageRenderer extends Widget
  implements RemoteDataRendererRegistry.IRenderer {
  constructor() {
    super();
    const image = document.createElement('img');
    this.node.appendChild(image);
  }

  /**
   * Render the data.
   */
  render(data: IDataLocation): Promise<void> {
    this.node.querySelector('img').setAttribute('src', data.url);
    return Promise.resolve(void 0);
  }
}

/**
 * A data renderer for PDFs.
 */
export class PDFRenderer extends Widget
  implements RemoteDataRendererRegistry.IRenderer {
  constructor() {
    super();
    this.addClass('jp-PDFContainer');
    const pdf = document.createElement('embed');
    pdf.className = 'jp-PDFViewer';
    pdf.setAttribute('type', 'application/pdf');
    this.node.appendChild(pdf);
  }

  /**
   * Render the data.
   */
  render(data: IDataLocation): Promise<void> {
    this.node.querySelector('embed').setAttribute('src', data.url);
    return Promise.resolve(void 0);
  }
}

/**
 * A data renderer for videos.
 */
export class VideoRenderer extends Widget
  implements RemoteDataRendererRegistry.IRenderer {
  constructor() {
    super();
    this.addClass('jp-VideoPlayer');
    const video = document.createElement('video');
    video.setAttribute('controls', '');
    this.node.appendChild(video);
  }

  /**
   * Render the data.
   */
  render(data: IDataLocation): Promise<void> {
    const video = this.node.querySelector('video')!;
    video.setAttribute('src', data.url);
    video.setAttribute('type', data.mimeType);
    return Promise.resolve(void 0);
  }
}

/**
 * A data renderer for audio.
 */
export class AudioRenderer extends Widget
  implements RemoteDataRendererRegistry.IRenderer {
  constructor() {
    super();
    this.addClass('jp-AudioPlayer');
    const video = document.createElement('audio');
    video.setAttribute('controls', '');
    this.node.appendChild(video);
  }

  /**
   * Render the data.
   */
  render(data: IDataLocation): Promise<void> {
    const audio = this.node.querySelector('audio')!;
    audio.setAttribute('src', data.url);
    audio.setAttribute('type', data.mimeType);
    return Promise.resolve(void 0);
  }
}

/**
 * A data renderer for HDF5 Metadata.
 */
export class HDF5Renderer extends Widget
  implements RemoteDataRendererRegistry.IRenderer {
  constructor() {
    super();
    this.addClass('jp-HDF5Renderer');
  }

  /**
   * Render the data.
   */
  render(data: IDataLocation): Promise<void> {
    const languages = Object.keys(data.url);
    const listing = languages.map(lang => {
      return (
        <div key={lang}>
          <h1>{lang}</h1>
          <pre>{(data.url as any)[lang]}</pre>
        </div>
      );
    });
    ReactDOM.render(<div>{listing}</div>, this.node);
    return Promise.resolve(void 0);
  }
}