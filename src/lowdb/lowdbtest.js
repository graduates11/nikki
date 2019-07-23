const low = require("lowdb");
const shortid = require("shortid");
const moment = require("moment");
const faker = require("faker");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);
//Run node lowdbtest to create a mock database
// Set some defaults (required if your JSON file is empty)
db.defaults({ entries: [] }).write();
db.defaults({ tags: [] }).write();

//moke tags
let tagnumbers = db
  .get("tags")
  .orderBy("id", "desc")
  .take(1)
  .map("id")
  .value();

for (let i = 0; i <= 5; i++) {
  tagnumbers = db
    .get("tags")
    .orderBy("id", "desc")
    .take(1)
    .map("id")
    .value();

  tagnumbers[0] === undefined ? (tagnumbers[0] = 0) : null;

  db.get("tags")
    .push({
      id: tagnumbers[0] + 1,
      text: faker.lorem.word(),
      entries: []
    })
    .write();
}

//moke entries
moment.locale("de");

for (let i = 0; i <= 10; i++) {
  var arr = [];
  while (arr.length < 3) {
    var r = Math.floor(Math.random() * tagnumbers) + 1;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  db.get("entries")
    .push({
      id: shortid.generate(),
      title: faker.lorem.sentence(),
      text: faker.lorem.paragraph(),
      date: faker.date.recent(),
      tags: arr,
      attachments: [faker.image.imageUrl()]
    })
    .write();
}

//add entries id to tags

let tagslist = db.get("tags").value();
let entrieslist = db.get("entries").value();

for (let i = 0; i < tagslist.length; i++) {
  for (let j = 0; j < entrieslist.length; j++) {
    if (entrieslist[j].tags.includes(tagslist[i].id)) {
      tagslist[i].entries.push(entrieslist[j].id);
    }
  }
}

db.get("tags").write({ tags: [...tagslist] });

//CRUD tests
/*
db.get("entries")
  .push(
    {
      id: shortid.generate(),
      title: "this is a title",
      text: "this is a text hahaha",
      date: moment().format("L"),
      tags: [1, 2, 3],
      attachments: ["this is a path", "this is another path"]
    },
    {
      id: shortid.generate(),
      title: "this is another title",
      text: "this is another text hahaha",
      date: moment().format("L"),
      tags: [4, 5, 6],
      attachments: ["this is a path", "this is another path"]
    }
  )
  .write();

db.get("tags")
  .push(
    {
      id: 1,
      text: "fun",
      entries: []
    },
    {
      id: 2,
      text: "dog",
      entries: []
    },
    {
      id: 3,
      text: "react",
      entries: []
    },
    {
      id: 4,
      text: "money",
      entries: []
    },
    {
      id: 5,
      text: "cat",
      entries: []
    },
    {
      id: 6,
      text: "node",
      entries: []
    }
  )
  .write();

const lon = db
  .get("tags")
  .orderBy("id", "desc")
  .take(1)
  .map("id")
  .value();

db.get("tags")
  .push({
    id: lon[0] + 1,
    text: "haha"
  })
  .write();

const tags = db.get("tags").value();
const tagarray = new Set([]);

const newtag = "banana";

for (let i = 0; i < tags.length; i++) {
  tagarray.add(tags[i].text);
}

if (tagarray.has(newtag)) {
  console.log("Tag already exist");
} else {
  db.get("tags")
    .push({
      id: lon[0] + 1,
      text: newtag,
      entries: []
    })
    .write();
}

console.log(lon[0]);
*/
