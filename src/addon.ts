// @deno-types="npm:@types/stremio-addon-sdk"
import { Stream, addonBuilder } from "npm:stremio-addon-sdk";
import needle from "npm:needle";
import { extractPostImages, extractTable } from "./utils.js";
import { fetchPoster, request } from "./fetch.ts";
import NodeCache from "npm:node-cache";
// @deno-types="npm:@types/parse-torrent"
import parseTorrent from "npm:parse-torrent";

const cache = new NodeCache();

const builder = new addonBuilder({
  id: "community.lablist",
  version: "0.0.1",
  catalogs: [
    {
      type: "movie",
      id: "plab",
      name: "lab",
      extra: [{ name: "genre", isRequired: true, options: ["HD", "SD"] }],
    },
  ],
  resources: ["catalog", "meta", "stream"],
  types: ["movie"],
  name: "lab-list",
  description: "heheheh",
});

const login = async (user, pass) => {
  const res = await needle(
    "post",
    "http://pornolab.net/forum/login.php",
    "redirect=index.php&login_username=yawnred&login_password=yawnred&login=%C2%F5%EE%E4",
    {
      content_type: "application/x-www-form-urlencoded",
      headers: {
        Cookie: cookies,
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
      },
      follow: 5,
    }
  );
  console.log(res.cookies);
};

builder.defineCatalogHandler(async ({ type, id, extra }) => {
  console.log("request for catalogs: " + type + " " + id);
  // Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineCatalogHandler.md
  if (type === "movie" && id === "plab") {
    const quality = extra.genre === "HD" ? 1715 : 1680;

    const page = await request(
      "tracker.php",
      `prev_my=0&prev_new=0&prev_oop=0&f%5B%5D=${quality}&o=1&s=2&tm=-1&pn=&nm=`
    );

    const catalog = extractTable(
      [
        ["Форум", "category"],
        ["Тема", "name"],
        ["Автор", "author"],
        ["Размер", "size"],
        ["Добавлен", "date_added"],
      ],
      page.body
    );

    return {
      metas: catalog.map((item) => ({
        id: item.id,
        name: item.attr.name,
        type: "movie",
        poster: fetchPoster(item.thread.id)[0],
        description: `
          ${item.attr.name} ${item.attr.size}
        `,
      })),
    };
  }
});

builder.defineMetaHandler(({ type, id }) => {
  return Promise.resolve({ meta: { id } });
});

builder.defineStreamHandler(async ({ type, id }) => {
  console.log("request for streams: " + type + " " + id);
  // Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineStreamHandler.md
  // return no streams

  const torrentId = id.replace("pl", "");

  const torrentFile = await request(`dl.php?t=${torrentId}`);

  const { infoHash, name } = parseTorrent(torrentFile.body);

  return Promise.resolve({
    streams: [{ infoHash, name }] as Stream[],
  });
});

export default builder.getInterface();
