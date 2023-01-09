const express = require("express");
const app = express();
const port = 5555;
var cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "5mb" }));
app.use(
  cors({
    origin: "*",
  })
);
let currentOs = process.platform;
if (currentOs == "darwin") {
  currentOs = "mac";
} else if (currentOs == "win32" || currentOs == "win64") {
  currentOs = "win";
} else if (currentOs == "linux") {
  currentOs = "linux";
}
const { keyboard, Key, clipboard } = require("@nut-tree/nut-js");
const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

app.post("/type/instant", async (req, res) => {
  let text = req.body.text;
  await clipboard.copy(text);
  if (currentOs == "mac") {
    await keyboard.pressKey(Key.LeftSuper, Key.V);
    await keyboard.releaseKey(Key.LeftSuper, Key.V);
  } else {
    await keyboard.pressKey(Key.LeftControl, Key.V);
    await keyboard.releaseKey(Key.LeftControl, Key.V);
  }
  await sleep(200);
  res.json({ done: true });
});

app.post("/type/natural", async (req, res) => {
  let text = req.body.text;
  let backup = keyboard.config.autoDelayMs;
  keyboard.config.autoDelayMs = req.body.delay;
  await keyboard.type(text);
  await sleep(200);
  keyboard.config.autoDelayMs = backup;
  res.json({ done: true });
});
app.post("/type/special", async (req, res) => {
  let command = req.body.command;
  await keyboard.type(eval(command)); // "Key.Enter, Key.Up Key.Space ..."
  await sleep(200);
  res.json({ done: true });
});
app.post("/type/press", async (req, res) => {
  let command = req.body.command;
  await keyboard.pressKey(eval(command)); // "Key.LeftControl, Key.LeftShift, Key.A"
  await sleep(200);
  res.json({ done: true });
});
app.post("/type/release", async (req, res) => {
  let command = req.body.command;
  await keyboard.releaseKey(eval(command)); // "Key.LeftControl, Key.LeftShift, Key.A"
  await sleep(200);
  res.json({ done: true });
});
app.post("/type/combination", async (req, res) => {
  let command = req.body.command;
  await keyboard.releaseKey(eval(command)); // "Key.LeftControl, Key.LeftShift, Key.A"
  await keyboard.releaseKey(eval(command)); // "Key.LeftControl, Key.LeftShift, Key.A"
  await sleep(200);
  res.json({ done: true });
});
app.listen(port, () => {
  console.log(`Automation  Sunucusu ${port} nolu portta çalışıyor.`);
});
setTimeout(() => {
  (async () => {
    await keyboard.pressKey(Key.LeftControl, Key.LeftShift, Key.A);
    await keyboard.releaseKey(Key.LeftControl, Key.LeftShift, Key.A);
  })();
}, 1555);
