import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import { remoteDataRendererFactory } from './mimerenderer';

import '../style/index.css';

const fileTypes = [
  {
    name: 'Remote Data',
    displayName: 'Remote Data',
    fileFormat: 'string',
    mimeTypes: ['application/vnd.jupyter.dataset+json'],
    extensions: ['.big']
  }
];

/**
 * Initialization data for the jupyterlab-datarenderer extension.
 */
const mimeExtension: IRenderMime.IExtension = {
  id: 'jupyterlab-datarenderer',
  rendererFactory: remoteDataRendererFactory,
  dataType: 'json',
  fileTypes,
  documentWidgetFactoryOptions: {
    name: 'Remote Data',
    modelName: 'text',
    primaryFileType: 'Remote Data',
    defaultFor: ['Remote Data'],
    fileTypes: ['Remote Data']
  }
};

export default mimeExtension;
