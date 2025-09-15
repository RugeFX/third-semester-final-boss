import "dotenv/config";
import express from "express";

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
  return res.send("Hello Sigma!");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
