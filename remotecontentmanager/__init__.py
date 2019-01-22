"""
This module contain example content manager for the Jupyter notebook server in
order to manage "remote" content. 

Despite it's name "remote" content characterise any content that need to be
accessed via an API and http-range request or similar instead of being delivered
"as a whole".

This can for example include large local file that you wish to consider "remote", 
but could include things like a s3 bucket, or an IPFS filesystem. 

The whole point being that yo uusually don't want to get the full dataset, but
require enough metatata in order to present something to the user.
"""

__version__ = "0.0.1"

import mimetypes
import json
from notebook.services.contents.largefilemanager import LargeFileManager

MIMETYPE = "application/vnd.jupyter.dataset+json"


def size_heuristic(model) -> bool:
    """
    Given a partial file model (see implementation for now)
    Return whether the file should be returned as a streamable content.

    This heuristic test the file size and automatically streams large content (>500 MB)
    """
    return model["size"] >= 500_000_000

def extension_heuristic(model) -> bool:
    """
    Given a partial file model (see implementation for now)
    Return whether the file should be returned as a streamable content.

    This heuristic check the file extension to know whether it should be streamed

    So far only implement it for mp4.
    """
    return model['path'].endswith("mp4")

class RemoteLocalFileManager(LargeFileManager):

    # is_hidden
    # file_exists
    # dir_exists
    # exists
    # _base_model <- maybe
    # def _dir_model( <- seem to call get under the hood, so that should be
    # fine. The question maybe is what do we do if 1000ds of file ?

    heuristics = [extension_heuristic, size_heuristic]

    def _file_model(self, path, content=True, format=None):
        """
        Unlike the normal file model, here if the file is above a threshold,
        we're going to return a custom mimetype.
        """

        model = self._base_model(path)
        # model.name
        # model.path
        # model.last_modified
        # model.created
        # model.size # may be None....
        # model.writable #bool
        model["type"] = "file"

        os_path = self._get_os_path(path)
        model["mimetype"] = mimetypes.guess_type(os_path)[0]

        # this is new. Let's include it in all our responses to simplify
        # handling on the other side
        model["streamable"] = True
        model["api_type"] = "Range-Request"
        model["http_range_url"] = "figure it out"
        model[
            "metadata"
        ] = {}  # nothign for now, should we inject some things like how to load it with dask, S3 or other ?

        if model["size"] is None:
            raise ValueError(
                "could not stat `{}`, not risking to send a loarge amount of data to the frontend."
            )
        if any([h(model) for h in self.heuristics]):
            model["inner_mimetype"] = model["mimetype"]
            model["mimetype"] = MIMETYPE
            model['content'] = json.dumps({
                'stream_url':'/files/'+path
                                           
                                           })
            model['format'] = MIMETYPE
            return model

        # default logic.
        # we could re-call super but that would-re-start the file which is less than optimal
        if content:
            content, format = self._read_file(os_path, format)
            if model["mimetype"] is None:
                default_mime = {
                    "text": "text/plain",
                    "base64": "application/octet-stream",
                }[format]
                model["mimetype"] = default_mime

            model.update(content=content, format=format)

        return model
