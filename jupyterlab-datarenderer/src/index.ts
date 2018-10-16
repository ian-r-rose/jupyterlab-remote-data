import { JupyterLab, JupyterLabPlugin } from '@jupyterlab/application';

import '../style/index.css';

/**
 * Initialization data for the jupyterlab-datarenderer extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-datarenderer',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension jupyterlab-datarenderer is activated!');
  }
};

export default extension;
