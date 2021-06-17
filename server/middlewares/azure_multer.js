const multer = require("multer");
const MulterAzureStorage = require("multer-azure-storage");
var upload = multer({
  storage: new MulterAzureStorage({
    azureStorageConnectionString: process.env.AZURE_CONNECTION,
    containerName: "uploads",
    containerSecurity: process.env.AZURE_CSECURITY,
    filename: (req, file, cb) => {
      let filename = file.fieldname + "-" + Date.now() + path.extname(file.originalname);

      cb(null, filename);
    },
  }),
  limits: { fileSize: 5000000 },
});

module.exports = upload;
