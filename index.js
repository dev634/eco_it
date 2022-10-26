require("./extensions/array.js");
const express = require("express");
const { engine } = require("express-handlebars");
const hbsSettings = require("./constantes/hbsSettings");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { testErrors } = require("./helpers/errors");

//routes
const rootRouter = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("tiny"));
app.use("/js", express.static(path.join(__dirname + "/public/assets/js")));
app.use("/img", express.static(path.join(__dirname + "/public/assets/img")));
app.use("/dist", express.static("dist"));
app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    partialsDir: hbsSettings.partialsPath,
  })
);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rootRouter);

app.listen(PORT, function () {
  console.log(`Listen on port ${PORT}`);
});

process.on("uncaughtException", function (err) {
  console.log(err);
  process.exit(1);
});
