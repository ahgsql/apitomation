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

const { keyboard, Key, clipboard } = require("@nut-tree/nut-js");
keyboard.config.autoDelayMs = 20;
const bekle = (t) => new Promise((resolve) => setTimeout(resolve, t));

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

app.post("/type", async (req, res) => {
  let tip = req.body.tip;
  let icerik = req.body.icerik;
  console.log(icerik + " gönderildi.");
  if (tip == "string") {
    //await keyboard.type(icerik);
    await clipboard.copy(icerik);
    //keyboard.pressKey(Key.LeftSuper, Key.V); // macOS
    // keyboard.releaseKey(Key.LeftSuper, Key.V); // macOS
    await keyboard.pressKey(Key.LeftControl, Key.V); // For Windows and Linux
    await keyboard.releaseKey(Key.LeftControl, Key.V); // For Windows and Linux
  } else if (tip == "special") {
    await keyboard.type(eval(icerik)); // "Key.Enter, Key.Up Key.Space ..."
  }
  await bekle(500);
  res.json({ done: true });
});
app.listen(port, () => {
  console.log(`Klavye Sunucusu ${port} nolu portta çalışıyor.`);
});
