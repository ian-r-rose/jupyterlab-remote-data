# Remote and large Data in Jupyter

This extension provide both a client-side and notebook server side extension to
deal with large or remote data. 


## installation

Python side:

```
pip install -e . 
```

set the following in your notebook config file

```
c.NotebookApp.contents_manager_class = RemoteContentmanager
```

This will treat any file which [Add heuristic there] as a large/remote file, and
send the representation as [TODO, decide of mimetype and info about this
mimetype]

