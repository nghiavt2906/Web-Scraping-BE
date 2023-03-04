const fs = require("fs");
const csv = require("fast-csv");

const readCsv = (csvPath) =>
  new Promise((resolve, reject) => {
    const stream = fs.createReadStream(csvPath);
    const collectionCsv = [];

    const csvFileStream = csv
      .parse()
      .on("data", (data) => {
        collectionCsv.push(data[0]);
      })
      .on("end", () => {
        collectionCsv.shift();
        resolve(collectionCsv);
      });

    stream.pipe(csvFileStream);
  });

module.exports = readCsv;
