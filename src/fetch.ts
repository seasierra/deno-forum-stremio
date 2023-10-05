// @deno-types="npm:@types/needle"
import needle from "npm:needle";
import "../.deno.env.js";


import { pipe, pipeline } from "https://deno.land/x/compose@1.0.0/index.js";
import { extractPostImages } from "./utils.js";

const headers = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "accept-language": "en-US,en;q=0.9",
  "cache-control": "max-age=0",
  "content-type": "application/x-www-form-urlencoded",
  "upgrade-insecure-requests": "1",
  cookie: Deno.env.get("COOKIE"),
  Referer: "http://pornolab.net/forum/tracker.php",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

export const request = (path: string, args = "") =>
  needle("post", `http://pornolab.net/forum/${path}`, args, {
    headers,
  });

export const fetchItemPage = (id: string | number) =>
  needle("get", `http://pornolab.net/forum/viewtopic.php?t=${id}`, {
    headers,
  }).then((page) => page.body);

export const fetchPoster = pipeline(fetchItemPage, extractPostImages);
