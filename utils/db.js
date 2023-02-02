const mongoose = require("mongoose");

const url = "mongodb://localhost/studentsDB";
const url2 =
  "mongodb+srv://newStudent:newStudent@cluster0.gkpjkup.mongodb.net/studentDB07?retryWrites=true&w=majority";
const url3 =
  "mongodb+srv://PeterPan:PeterPan@codelab.eqkgv.mongodb.net/studentDB07?retryWrites=true&w=majority";

mongoose.connect(url3).then(() => {
  console.log("database now connected");
});

module.exports = mongoose;
