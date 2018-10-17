/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { DataRendererRegistry } from './registry';

import {
  AudioRenderer,
  ImageRenderer,
  PDFRenderer,
  VideoRenderer
} from './renderers';

export const audioRendererFactory: DataRendererRegistry.IRendererFactory = {
  mimeTypes: ['audio/ogg', 'audio/webm', 'audio/mp3'],
  createRenderer: options => new AudioRenderer()
};

export const imageRendererFactory: DataRendererRegistry.IRendererFactory = {
  mimeTypes: [
    'image/png',
    'image/svg',
    'image/gif',
    'image/jpeg',
    'image/bmp',
    'image/tiff'
  ],
  createRenderer: options => new ImageRenderer()
};

export const pdfRendererFactory: DataRendererRegistry.IRendererFactory = {
  mimeTypes: ['application/pdf'],
  createRenderer: options => new PDFRenderer()
};

export const videoRendererFactory: DataRendererRegistry.IRendererFactory = {
  mimeTypes: ['video/mp4', 'video/ogg', 'video/webm'],
  createRenderer: options => new VideoRenderer()
};

export const defaultFactories = [
  audioRendererFactory,
  imageRendererFactory,
  pdfRendererFactory,
  videoRendererFactory
];
