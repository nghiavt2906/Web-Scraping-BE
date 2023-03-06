const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./uploads/");
  },
  filename: (req, file, callBack) => {
    const newDate = new Date();
    const fileName = path.parse(file.originalname).name;
    const currentDateString = newDate.toLocaleDateString().replaceAll("/", "_");
    const currentTimeString = newDate
      .toLocaleTimeString("en-IT")
      .replaceAll(":", "_");
    const fileExt = path.extname(file.originalname);

    callBack(
      null,
      `${fileName}-${currentDateString}-${currentTimeString}${fileExt}`
    );
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
