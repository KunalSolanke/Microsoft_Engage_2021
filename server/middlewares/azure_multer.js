const multer = require("multer");
const path = require("path");
const MulterAzureStorage = require("multer-azure-storage");
var upload = multer({
  storage: new MulterAzureStorage({
    azureStorageConnectionString: process.env.AZURE_CONNECTION,
    containerName: "uploads",
  }),
  limits: { fileSize: 5000000 },
});

module.exports = upload;
