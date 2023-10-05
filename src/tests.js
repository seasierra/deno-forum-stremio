import { request } from "./fetch.js";
import { extractTable } from "./utils.js";
import parseTorrent from "npm:parse-torrent";

(async () => {
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

  const id = "pl3022761";

  const torrentId = id.replace("pl", "");

  const torrentFile = await request("post")(`dl.php?t=${torrentId}`);

  const info = await parseTorrent(torrentFile.body);

  console.log("TORRENT", info);
})();
