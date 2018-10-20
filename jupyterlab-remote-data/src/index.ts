import { JupyterLab, JupyterLabPlugin } from '@jupyterlab/application';

import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

import { remoteDataRendererFactory } from './mimerenderer';

import '../style/index.css';

/**
 * Initialization data for the jupyterlab-datarenderer extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-remote-data',
  autoStart: true,
  requires: [IRenderMimeRegistry],
  activate: (app: JupyterLab, rendermime: IRenderMimeRegistry) => {
    rendermime.addFactory(remoteDataRendererFactory);
  }
};

export default extension;
