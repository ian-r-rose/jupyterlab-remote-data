/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { RemoteDataRendererRegistry } from './registry';

import {
  AudioRenderer,
  ImageRenderer,
  PDFRenderer,
  VideoRenderer
} from './renderers';

/**
 * Audio data renderer factory.
 */
export const audioRendererFactory: RemoteDataRendererRegistry.IRendererFactory = {
  mimeTypes: ['audio/ogg', 'audio/webm', 'audio/mp3'],
  createRenderer: options => new AudioRenderer()
};

/**
 * Image data renderer factory.
 */
export const imageRendererFactory: RemoteDataRendererRegistry.IRendererFactory = {
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

/**
 * PDF data renderer factory.
 */
export const pdfRendererFactory: RemoteDataRendererRegistry.IRendererFactory = {
  mimeTypes: ['application/pdf'],
  createRenderer: options => new PDFRenderer()
};

/**
 * Video data renderer factory.
 */
export const videoRendererFactory: RemoteDataRendererRegistry.IRendererFactory = {
  mimeTypes: ['video/mp4', 'video/ogg', 'video/webm'],
  createRenderer: options => new VideoRenderer()
};

/**
 * A set of default data renderer factories.
 */
export const defaultFactories = [
  audioRendererFactory,
  imageRendererFactory,
  pdfRendererFactory,
  videoRendererFactory
];
