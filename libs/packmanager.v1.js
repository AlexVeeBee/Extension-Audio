import { getRequestHeaders } from "../../../../../script.js";

let ambients = {};
let DEBUG_PREFIX_BASE = '[PackManagerBase]';
let DEBUG_PREFIX_V1 = '[PackManagerV1]';

class UIPackManager extends EventTarget {
    base = "assets/ui-packs/";
    baseManifest = "manifest.json";

    constructor() {
        super();
    }

    on(event, callback) {
        this.addEventListener(event, (event) => callback(event));
    }

    async getAssetsList() {
        const type = "ui-packs";
        console.debug(DEBUG_PREFIX_BASE, 'getting assets of type', type);

        try {
            const result = await fetch('/api/assets/get', {
                method: 'POST',
                headers: getRequestHeaders(),
            });
            const assets = result.ok ? (await result.json()) : { type: [] };
            console.debug(DEBUG_PREFIX_BASE, 'Found assets:', assets);

            const output = assets[type];
            for(const i in output) {
                output[i] = output[i].replaceAll('\\','/');
                console.debug(DEBUG_PREFIX_BASE,'DEBUG',output[i]);
            }

            return output;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
}

class PackManagerV1 extends UIPackManager {
    constructor() {
        super();
    }

    async getManifestName(pack)
    {
        try {
            const f = await fetch(
                `${this.base}${pack}/${this.baseManifest}`
            ).then(response => response.json());
            return f.name;
        } catch (error) {
            console.error(error);
            return {};
        }
    }

    async getManifest(pack) {
        try {
            const f = await fetch(
                `${this.base}${pack}/${this.baseManifest}`
            ).then(response => response.json());
            f.folder = `${this.base}${pack}/`;
            f.icon = `${this.base}${pack}/${f.icon}`;
            return f;
        } catch (error) {
            console.error(error);
            return {};
        }
    }
}

export { PackManagerV1 };
