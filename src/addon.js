import { addonBuilder } from "npm:stremio-addon-sdk";
import needle from "npm:needle";
import { extractPostImages, extractTable } from "./utils.js";
import { request } from "./fetch.js";
import NodeCache from "npm:node-cache";
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
    },
  ],
  resources: ["catalog", "meta", "stream"],
  types: ["movie"],
  name: "lab-list",
  description: "heheheh",
});

const cookies =
  "bb_t=a%3A50%3A%7Bi%3A3023149%3Bi%3A1696435566%3Bi%3A3022572%3Bi%3A1696223871%3Bi%3A3017258%3Bi%3A1695066101%3Bi%3A3018748%3Bi%3A1695040531%3Bi%3A2295821%3Bi%3A1695017564%3Bi%3A3018693%3Bi%3A1695016757%3Bi%3A3018620%3Bi%3A1695003903%3Bi%3A3018567%3Bi%3A1694980846%3Bi%3A3018423%3Bi%3A1694971673%3Bi%3A2253441%3Bi%3A1694916988%3Bi%3A1797470%3Bi%3A1694862064%3Bi%3A2696539%3Bi%3A1694843464%3Bi%3A2754232%3Bi%3A1694843462%3Bi%3A2390612%3Bi%3A1694833437%3Bi%3A2386925%3Bi%3A1694833177%3Bi%3A2397126%3Bi%3A1694819616%3Bi%3A2891132%3Bi%3A1694802601%3Bi%3A3017881%3Bi%3A1694785595%3Bi%3A3005071%3Bi%3A1694768231%3Bi%3A3017279%3Bi%3A1694766264%3Bi%3A2577227%3Bi%3A1694752557%3Bi%3A3005076%3Bi%3A1694690114%3Bi%3A3010025%3Bi%3A1694639301%3Bi%3A2754742%3Bi%3A1694628851%3Bi%3A2690729%3Bi%3A1694628000%3Bi%3A2387738%3Bi%3A1694620269%3Bi%3A3017385%3Bi%3A1694614672%3Bi%3A2916164%3Bi%3A1694590887%3Bi%3A3017185%3Bi%3A1694590600%3Bi%3A3017268%3Bi%3A1694581307%3Bi%3A2510262%3Bi%3A1694497524%3Bi%3A3017054%3Bi%3A1694497477%3Bi%3A3016948%3Bi%3A1694453040%3Bi%3A3016602%3Bi%3A1694424177%3Bi%3A3016518%3Bi%3A1694314668%3Bi%3A3016516%3Bi%3A1694314227%3Bi%3A3016515%3Bi%3A1694313382%3Bi%3A3016508%3Bi%3A1694308940%3Bi%3A3015929%3Bi%3A1694243700%3Bi%3A3016197%3Bi%3A1694217318%3Bi%3A3016196%3Bi%3A1694216797%3Bi%3A3016195%3Bi%3A1694216728%3Bi%3A3016194%3Bi%3A1694216655%3Bi%3A3016193%3Bi%3A1694216305%3Bi%3A3016189%3Bi%3A1694215488%3Bi%3A3016188%3Bi%3A1694215482%3Bi%3A3016044%3Bi%3A1694172641%3Bi%3A3016042%3Bi%3A1694172353%3Bi%3A2544914%3Bi%3A1694155999%3Bi%3A2324872%3Bi%3A1694155946%3B%7D; testCookie=1; cookie_notice=1";

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

const getBody = (page, args) => request()(page, args);

builder.defineCatalogHandler(async ({ type, id, extra }) => {
  console.log("request for catalogs: " + type + " " + id);
  // Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineCatalogHandler.md
  if (type === "movie" && id === "plab") {
    const page = await request()(
      "tracker.php",
      "prev_my=0&prev_new=0&prev_oop=0&f%5B%5D=1715&o=1&s=2&tm=-1&pn=&nm="
    );

    console.log(page.body, "fetched");

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

    console.log("CATALOG", catalog);

    return {
      metas: catalog.map((item) => ({
        id: item.id,
        name: item.attr.name,
        type: "movie",
        poster: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
      })),
    };
  }

  const args =
    "prev_my=0&prev_new=0&prev_oop=0&f%5B%5D=1715&o=1&s=2&tm=-1&pn=&nm=";

  // const catalog = cache.get(args);

  console.log();

  const catalog = await extractTable(
    [
      ["Форум", "category"],
      ["Тема", "name"],
      ["Автор", "author"],
      ["Размер", "size"],
      ["Добавлен", "date_added"],
    ],
    getBody("tracker.php", args)
  );

  console.log(catalog);
  //.then((catalog) => cache.set(args, catalog, 300));

  return Promise.resolve({
    metas: catalog.map((item) => ({
      id: item.id,
      name: item.attr.name,
      type: "movie",
    })),
  });
});

builder.defineMetaHandler(({ type, id }) => {
  return Promise.resolve({ meta: { id } });
});

builder.defineStreamHandler(async ({ type, id }) => {
  console.log("request for streams: " + type + " " + id);
  // Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineStreamHandler.md
  // return no streams

  const torrentId = id.replace("pl", "");

  const torrentFile = await request("post")(`dl.php?t=${torrentId}`);

  const torrentInfo = await parseTorrent(torrentFile.body);

  console.log(torrentInfo)

  return Promise.resolve({ streams: [{ infoHash: torrentInfo.infoHash, name: "" }] });
});

export default builder.getInterface();
