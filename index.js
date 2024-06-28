const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, Model, DataTypes } = require("sequelize");

const app = express();
const port = 8000;

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

class Player extends Model {}
Player.init(
  {
    name: DataTypes.STRING,
    link: DataTypes.STRING,
    singer: DataTypes.STRING,
  },
  { sequelize, modelName: "player" }
);

sequelize.sync();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/players", async (req, res) => {
  const players = await Player.findAll();
  res.json({ data: players });
});

app.get("/players/:id", async (req, res) => {
  const player = await Player.findByPk(req.params.id);
  res.json({ data: player });
});

app.post("/players", async (req, res) => {
  const player = await Player.create(req.body);
  res.json({ data: player });
});

app.put("/players/:id", async (req, res) => {
  const player = await Player.findByPk(req.params.id);
  if (player) {
    await player.update(req.body);
    res.json({ data: player });
  } else {
    res.status(404).json({ message: "Player not found" });
  }
});

app.delete("/players/:id", async (req, res) => {
  const player = await Player.findByPk(req.params.id);
  if (player) {
    await player.destroy();
    res.json({ message: "Player deleted" });
  } else {
    res.status(404).json({ message: "Player not found" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
