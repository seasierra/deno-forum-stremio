import "./.deno.env.js";


import { serveHTTP, publishToCentral } from "npm:stremio-addon-sdk";
import addonInterface from "./src/addon.ts";
serveHTTP(addonInterface, { port: Deno.env.get("PORT") || 57647 });

// when you've deployed your addon, un-comment this line
// publishToCentral("https://my-addon.awesome/manifest.json")
// for more information on deploying, see: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/deploying/README.md
