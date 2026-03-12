import express from "express";
import serverless from "serverless-http";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
const api = express();
const router = express.Router();
const API_KEY = process.env.FOOD_API_KEY; // Add your API key in .e
nv
router.get("/weather", async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "City is required"
    });
    try {
        const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}
        &appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        res.json({
        city: data.name,
        temperature: data.main.temp,
        weather: data.weather[0].description,
        });
    } 
    catch (error) {
    res.status(500).json({ error: "Server error" });
    }
});
api.use("/api/", router);
export const handler = serverless(api);