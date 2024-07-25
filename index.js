import express from "express";
import axios from "axios";
import dotenv from "dotenv"

dotenv.config();

const app = express();
const port = 3000;
const API_URL = process.env.API_URL;

const yourUsername = process.env.API_USERNAME;
const yourPassword = process.env.API_PASSWORD;
const yourAPIKey = process.env.API_KEY;
const yourBearerToken = process.env.BEARER_TOKEN;

const fetchData = async (url, options = {}) => {
  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  try{
    const result = await axios.get(API_URL + "/random")
    res.render("index.ejs", { content: JSON.stringify(result.data)})
  } catch(error){
    res.status(404).send(error.message)
  }
});

app.get("/basicAuth", async (req, res) => {
  try{
    const result = await axios.get(API_URL + "/all?page=2", {
      auth: {
        username: yourUsername,
        password: yourPassword,
      },
    })
    res.render("index.ejs", {content: JSON.stringify(result.data)})
  } catch(error){
    res.status(404).send(error.message)
  }
});

app.get("/apiKey", async(req, res) => {
  try{
    const result = await axios.get(API_URL + "/filter", {
      params: {
        score: 5,
        apiKey: yourAPIKey,
      },
    })
    res.render("index.ejs", {content: JSON.stringify(result.data)})
  } catch(error){
    res.status(404).send(error.message)
  }
});

app.get("/bearerToken", async (req, res) => {
  try {
    const data = await fetchData(`${API_URL}/secrets/2`, {
      headers: { Authorization: `Bearer ${yourBearerToken}` },
    });
    res.render("index.ejs", { content: JSON.stringify(data) });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
