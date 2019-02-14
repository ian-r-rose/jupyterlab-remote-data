import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

import { IDocumentManager } from '@jupyterlab/docmanager';

const FACTORY = 'Remote Data';
const DATA_MIME = 'application/vnd.jupyter.dataset+json';

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
  const browser = factory.defaultBrowser;
  const handleEvent = async (evt: Event): Promise<void> => {
    const event = evt as MouseEvent;
    // Do nothing if it's not a left mouse press.
    if (event.button !== 0) {
      return;
    }

    // Do nothing if any modifier keys are pressed.
    if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
      return;
    }

    // Stop the event propagation.
    event.preventDefault();
    event.stopPropagation();

    const item = browser.modelForClick(event);
    console.log(item);
    if (!item) {
      return;
    }
    if (item.type === 'directory') {
      browser.model.cd(item.name).catch(error => console.error(error));
    } else {
      const factory = item.mimetype === DATA_MIME ? FACTORY : 'default';
      manager.openOrReveal(item.path, factory);
    }
  };

  browser.node.addEventListener('dblclick', handleEvent, true);
}

export default browserMonkeyPatch;
