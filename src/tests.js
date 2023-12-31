import { request, fetchPoster } from "./fetch.ts";
import { extractTable } from "./utils.js";
import parseTorrent from "npm:parse-torrent";

(async () => {
    const page = await request(
      "tracker.php",
      "prev_my=0&prev_new=0&prev_oop=0&f%5B%5D=1715&o=1&s=2&tm=-1&pn=&nm="
    );

//   console.log("data")

  const fPage = await fetch("http://pornolab.net/forum/tracker.php", {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "upgrade-insecure-requests": "1",
      cookie:
        "bb_t=a%3A50%3A%7Bi%3A3023149%3Bi%3A1696435566%3Bi%3A3022572%3Bi%3A1696223871%3Bi%3A3017258%3Bi%3A1695066101%3Bi%3A3018748%3Bi%3A1695040531%3Bi%3A2295821%3Bi%3A1695017564%3Bi%3A3018693%3Bi%3A1695016757%3Bi%3A3018620%3Bi%3A1695003903%3Bi%3A3018567%3Bi%3A1694980846%3Bi%3A3018423%3Bi%3A1694971673%3Bi%3A2253441%3Bi%3A1694916988%3Bi%3A1797470%3Bi%3A1694862064%3Bi%3A2696539%3Bi%3A1694843464%3Bi%3A2754232%3Bi%3A1694843462%3Bi%3A2390612%3Bi%3A1694833437%3Bi%3A2386925%3Bi%3A1694833177%3Bi%3A2397126%3Bi%3A1694819616%3Bi%3A2891132%3Bi%3A1694802601%3Bi%3A3017881%3Bi%3A1694785595%3Bi%3A3005071%3Bi%3A1694768231%3Bi%3A3017279%3Bi%3A1694766264%3Bi%3A2577227%3Bi%3A1694752557%3Bi%3A3005076%3Bi%3A1694690114%3Bi%3A3010025%3Bi%3A1694639301%3Bi%3A2754742%3Bi%3A1694628851%3Bi%3A2690729%3Bi%3A1694628000%3Bi%3A2387738%3Bi%3A1694620269%3Bi%3A3017385%3Bi%3A1694614672%3Bi%3A2916164%3Bi%3A1694590887%3Bi%3A3017185%3Bi%3A1694590600%3Bi%3A3017268%3Bi%3A1694581307%3Bi%3A2510262%3Bi%3A1694497524%3Bi%3A3017054%3Bi%3A1694497477%3Bi%3A3016948%3Bi%3A1694453040%3Bi%3A3016602%3Bi%3A1694424177%3Bi%3A3016518%3Bi%3A1694314668%3Bi%3A3016516%3Bi%3A1694314227%3Bi%3A3016515%3Bi%3A1694313382%3Bi%3A3016508%3Bi%3A1694308940%3Bi%3A3015929%3Bi%3A1694243700%3Bi%3A3016197%3Bi%3A1694217318%3Bi%3A3016196%3Bi%3A1694216797%3Bi%3A3016195%3Bi%3A1694216728%3Bi%3A3016194%3Bi%3A1694216655%3Bi%3A3016193%3Bi%3A1694216305%3Bi%3A3016189%3Bi%3A1694215488%3Bi%3A3016188%3Bi%3A1694215482%3Bi%3A3016044%3Bi%3A1694172641%3Bi%3A3016042%3Bi%3A1694172353%3Bi%3A2544914%3Bi%3A1694155999%3Bi%3A2324872%3Bi%3A1694155946%3B%7D; bb_data=1-33083461-0Ok8JHnvNthxgHBaI8SM-2996289554-1696456824-1696503819-212777405-1; testCookie=1; cookie_notice=1",
      Referer: "http://pornolab.net/forum/tracker.php?f=1715&nm=tgirls.porn",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: "prev_my=0&prev_new=0&prev_oop=0&f%5B%5D=1715&o=1&s=2&tm=-1&pn=&nm=",
    method: "POST",
  });

  console.log(page)

//   const page = await fPage.text();

  console.log(page, "fetched");
  //   console.log(, "fetched");

  const catalog = extractTable(
    [
      ["Форум", "category"],
      ["Тема", "name"],
      ["Автор", "author"],
      ["Размер", "size"],
      ["Добавлен", "date_added"],
    ],
    page
  );

  console.log("CATALOG", catalog);

  const id = "pl3022761";

  const torrentId = id.replace("pl", "");

  console.log("ITEM POSTER", fetchPoster(torrentId)[0]);

  const torrentFile = await request(`dl.php?t=${torrentId}`);

  const info = await parseTorrent(torrentFile.body);

  console.log("TORRENT", info);
})();
