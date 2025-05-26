import { Server } from "@hocuspocus/server";

// Configure the server …
const server = new Server({
  port: 1234,
  // extensions: [
  //   new SQLite({
  //     database: 'db.sqlite',
  //   }),
  // ],
});

// … and run it!
server.listen();
