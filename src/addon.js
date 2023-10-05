import { addonBuilder } from "stremio-addon-sdk";
import needle from "needle";
import { extractPostImages, extractTable } from "./utils";
import { mock } from "./mock";
import { request } from "./fetch";
import NodeCache from "node-cache";
import parseTorrent from "./lib/parseTor"

const cache = new NodeCache();

const builder = new addonBuilder({
  id: "community.lablist",
  version: "0.0.1",
  catalogs: [
    {
      type: "movie",
      id: "top",
      name: "lab",
    },
  ],
  resources: ["catalog", "stream"],
  types: ["channel"],
  name: "lab-list",
  description: "",
});

const domain = "http://pornolab.net/forum/login.php";

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

const search = (
  args = "prev_my=0&prev_new=0&prev_oop=0&f%5B%5D=1715&o=1&s=2&tm=-1&pn=&nm="
) => {};

async function* generateIndexWithDelay(delay, max) {
  for (let i = 0; i <= max; i++) {
    yield i;
    // Wait for 1 second before yielding the next number
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

// const getMeta = async () => {
//   const list = await search();

//   const metas = [];

//   for await (const itemIdx of generateIndexWithDelay(50, list.length)) {
//     if (itemIdx === list.) break;
//     const item = list[itemIdx];

//     const page = await request("get")(item.thread.url);

//     console.log("FETCHING THREADS: %d", itemIdx, "/", list.length);

//     metas.push({
//       ...item,
//       images: extractPostImages(page.body, item.thread.id),
//     });
//   }

//   console.log(metas);

//   return metas;
// };

// (async () => {
//   await getMeta();
// })();

// const search = (cb) =>
//   needle.post(
//     "http://pornolab.net/forum/tracker.php",
//     "prev_my=0&prev_new=0&prev_oop=0&f%5B%5D=1715&o=1&s=2&tm=-1&pn=&nm=",
//     {
//       headers: {
//         accept:
//           "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//         "accept-language": "en-US,en;q=0.9",
//         "cache-control": "max-age=0",
//         "content-type": "application/x-www-form-urlencoded",
//         "upgrade-insecure-requests": "1",
//         cookie:
//           "bb_t=a%3A50%3A%7Bi%3A3023149%3Bi%3A1696435566%3Bi%3A3022572%3Bi%3A1696223871%3Bi%3A3017258%3Bi%3A1695066101%3Bi%3A3018748%3Bi%3A1695040531%3Bi%3A2295821%3Bi%3A1695017564%3Bi%3A3018693%3Bi%3A1695016757%3Bi%3A3018620%3Bi%3A1695003903%3Bi%3A3018567%3Bi%3A1694980846%3Bi%3A3018423%3Bi%3A1694971673%3Bi%3A2253441%3Bi%3A1694916988%3Bi%3A1797470%3Bi%3A1694862064%3Bi%3A2696539%3Bi%3A1694843464%3Bi%3A2754232%3Bi%3A1694843462%3Bi%3A2390612%3Bi%3A1694833437%3Bi%3A2386925%3Bi%3A1694833177%3Bi%3A2397126%3Bi%3A1694819616%3Bi%3A2891132%3Bi%3A1694802601%3Bi%3A3017881%3Bi%3A1694785595%3Bi%3A3005071%3Bi%3A1694768231%3Bi%3A3017279%3Bi%3A1694766264%3Bi%3A2577227%3Bi%3A1694752557%3Bi%3A3005076%3Bi%3A1694690114%3Bi%3A3010025%3Bi%3A1694639301%3Bi%3A2754742%3Bi%3A1694628851%3Bi%3A2690729%3Bi%3A1694628000%3Bi%3A2387738%3Bi%3A1694620269%3Bi%3A3017385%3Bi%3A1694614672%3Bi%3A2916164%3Bi%3A1694590887%3Bi%3A3017185%3Bi%3A1694590600%3Bi%3A3017268%3Bi%3A1694581307%3Bi%3A2510262%3Bi%3A1694497524%3Bi%3A3017054%3Bi%3A1694497477%3Bi%3A3016948%3Bi%3A1694453040%3Bi%3A3016602%3Bi%3A1694424177%3Bi%3A3016518%3Bi%3A1694314668%3Bi%3A3016516%3Bi%3A1694314227%3Bi%3A3016515%3Bi%3A1694313382%3Bi%3A3016508%3Bi%3A1694308940%3Bi%3A3015929%3Bi%3A1694243700%3Bi%3A3016197%3Bi%3A1694217318%3Bi%3A3016196%3Bi%3A1694216797%3Bi%3A3016195%3Bi%3A1694216728%3Bi%3A3016194%3Bi%3A1694216655%3Bi%3A3016193%3Bi%3A1694216305%3Bi%3A3016189%3Bi%3A1694215488%3Bi%3A3016188%3Bi%3A1694215482%3Bi%3A3016044%3Bi%3A1694172641%3Bi%3A3016042%3Bi%3A1694172353%3Bi%3A2544914%3Bi%3A1694155999%3Bi%3A2324872%3Bi%3A1694155946%3B%7D; bb_data=1-33083461-0Ok8JHnvNthxgHBaI8SM-2996289554-1696456824-1696467430-212777405-1; testCookie=1; cookie_notice=1",
//         Referer: "http://pornolab.net/forum/tracker.php",
//         "Referrer-Policy": "strict-origin-when-cross-origin",
//       },
//     },
//     (err, resp) => {
//       const html = mock.html; //resp.body;

//       const headers = ["Форум", "Тема", "Автор", "Размер", "Добавлен"];

//       cb(extractDataFromTable(html, headers));
//     }
//   );

// search((list) =>
//   list.map((thread) => {
//     thread.threadId;
//   })
// );
// login("yawnred", "yawnred");

builder.defineCatalogHandler(async ({ type, id, extra }) => {
  console.log("request for catalogs: " + type + " " + id);
  // Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineCatalogHandler.md

  const args =
    "prev_my=0&prev_new=0&prev_oop=0&f%5B%5D=1715&o=1&s=2&tm=-1&pn=&nm=";

  const catalog: any[] = cache.get(args);

  if (!catalog) {
    extractTable(
      [
        ["Форум", "category"],
        ["Тема", "name"],
        ["Автор", "author"],
        ["Размер", "size"],
        ["Добавлен", "date_added"],
      ],
      getBody("tracker.php", args)
    ).then((catalog) => cache.set(args, catalog, 300));
  }

  return Promise.resolve({
    metas: catalog.map((item) => ({
      id: item.id,
      name: item.attr.name,
      type: "movie",
    })),
  });
});

request("post")("dl.php?t=3006295").then((res) => {
  parseTorrent(res.body);
});

// builder.defineMetaHandler(({ type, id }) => {
//   return Promise.resolve({ meta: { id } });
// });

builder.defineStreamHandler(async ({ type, id }) => {
  console.log("request for streams: " + type + " " + id);
  // Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineStreamHandler.md
  // return no streams

  const file = await request("post")(`dl.php?t=${id}`);
  const { infoHash = "" } = {}; //parseTorrent(file.body);

  return Promise.resolve({ streams: [{ infoHash }] });
});

export default builder.getInterface();
 