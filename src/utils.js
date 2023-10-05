import cheerio from "cheerio";


export async function extractTable(headerPairs, html) {
  const $ = cheerio.load(await html);
  const tableData = [];

  const tableRows = $("#tor-tbl tbody tr");
  const tableHd = $("#tor-tbl thead tr")
    .children()
    .map((_, el) => $(el).text().trim())
    .toArray();

  tableRows.each((_index, row) => {
    const tableCells = $(row).find("td");

    const [threadUrl, threadId] = $(tableCells)
      .find("[href^=./viewtopic.php]")
      .attr("href")
      .match(/.*=([\d]*)$/);

    const rowData = {
      id: `pl${threadId}`,
      thread: {
        id: threadId,
        url: threadUrl,
      },
      attr: {},
    };

    headerPairs.forEach(([header, key]) => {
      const index = tableHd.findIndex((value) => value === header);

      rowData.attr[key] = tableCells
        .eq(index)
        .children()
        .not("u")
        .text()
        .trim();
    });

    tableData.push(rowData);
  });

  return tableData;
}

export const extractPostImages = (html, _id) => {
  const $ = cheerio.load(html);

  const topic = $("#topic_main var.postImg");

  const links = [];

  topic.each((_i, img) => {
    links.push($(img).attr("title"));
  });

  // console.log("POST IMAGE", id, links);

  return links;
};
