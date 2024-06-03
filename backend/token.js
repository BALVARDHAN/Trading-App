const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const app = express();
app.use(cors());
app.use(express.json());

let access_token = "";

app.get("/", (req, res) => {
  const url = "https://api.upstox.com/v2/login/authorization/token";

  const headers = {
    accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = {
    code: req.query.code,
    client_id: "7b77e634-516a-472e-a9ff-512a2cc55496",
    client_secret: "28msb9z57y",
    redirect_uri: "http://localhost:8085/",
    grant_type: "authorization_code",
  };
  axios
    .post(url, new URLSearchParams(data), { headers })
    .then((response) => {
      console.log(response.status);
      access_token = response.data.access_token;
      fs.writeFile("access_token.txt", access_token, (err) => {
        if (err) throw err;
        console.log("WRITTEN");
      });
      res.redirect("/generated");
    })
    .catch((error) => {
      console.error(error.response.status);
      console.error(error.response.data);
    });
});

app.get("/token", (req, res) => {
  const url =
    "https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=7b77e634-516a-472e-a9ff-512a2cc55496&redirect_uri=http%3A%2F%2Flocalhost%3A8085%2F&state=RnJpIERlYyAxNiAyMDIyIDE1OjU4OjUxIEdNVCswNTMwIChJbmRpYSBTdGFuZGFyZCBUaW1lKQ%3D%3D";
  res.redirect(url);
});

app.get("/generated", (req, res) => {
  res.send(`<h3 style='width:500px;word-wrap:break-word'>${access_token}</h3>`);
});

app.listen(8085, () => {
  console.log("SERVER IS LISTENING at 8085");
});
