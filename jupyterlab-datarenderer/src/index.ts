import { JupyterLab, JupyterLabPlugin } from '@jupyterlab/application';

import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

import { dataMimeRendererFactory } from './mimerenderer';

import '../style/index.css';

/**
 * Initialization data for the jupyterlab-datarenderer extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-datarenderer',
  autoStart: true,
  requires: [IRenderMimeRegistry],
  activate: (app: JupyterLab, rendermime: IRenderMimeRegistry) => {
    rendermime.addFactory(dataMimeRendererFactory);
  }
};

export default extension;
