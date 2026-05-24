const createCsvWriter =
  require("csv-writer")
  .createObjectCsvWriter;



async function exportCSV(
  data,
  filename
) {

  const csvWriter =
    createCsvWriter({

    path: filename,

    header: [

      {
        id: "filename",
        title: "Filename",
      },

      {
        id: "title",
        title: "Title",
      },

      {
        id: "keywords",
        title: "Keywords",
      },

      {
        id: "description",
        title: "Description",
      },

    ],
  });

  await csvWriter.writeRecords(data);
}

module.exports = exportCSV;