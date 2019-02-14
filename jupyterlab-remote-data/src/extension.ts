import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

import { IDocumentManager } from '@jupyterlab/docmanager';

/**
 * The JupyterLab plugin for the GitHub Filebrowser.
 */
const browserMonkeyPatch: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-remote-data:browser-monkey-patch',
  requires: [IDocumentManager, IFileBrowserFactory],
  activate: activateMonkeyPatch,
  autoStart: true
};

/**
 * Activate the file browser.
 */
function activateMonkeyPatch(
  app: JupyterFrontEnd,
  manager: IDocumentManager,
  factory: IFileBrowserFactory
): void {
  console.log('Activated');
}

export default browserMonkeyPatch;
