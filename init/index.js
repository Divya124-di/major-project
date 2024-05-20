const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("could not connect", err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const intDB = async ()=>
{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"6606b74a2676cd6a87151b32"}));
    await Listing.insertMany(initData.data);
    console.log("successful initialized");
}
intDB();
