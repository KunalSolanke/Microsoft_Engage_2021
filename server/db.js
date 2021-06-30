const mongoose = require("mongoose");

const configure_db = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    useFindAndModify: false,
  });
  const conn = mongoose.connection;
  conn.on("error", (err) => {
    console.log(err);
  });
  conn.on("open", () => {
    console.log("Db is connected");
  });
  return mongoose;
};

module.exports = configure_db;
