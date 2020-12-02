import { createReadStream, existsSync } from 'fs';
import * as mime from 'mime';
import fetch, { Response } from 'node-fetch';

export default function platform(paths) {
   /**
     * 
     * @param {string} filename 
     * @returns {Response}
     */
    function fetch_file(pathname) {

        file = paths.static + pathname;
        if (existsSync(file)) {
            return new Response(createReadStream(file), {
                headers: {
                    'content-type': mime.getType(file)
                }
            });
        }
    }

    function create_response(body, options) {
        return new Response(body, options);
    }

    return {
        fetch,
        fetch_file,
        create_response
    }
}