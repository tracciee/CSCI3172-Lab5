const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const port = 8000;

//API for Contacting Spoonacular API

app.use(express.static(path.join(__dirname)));

app.get("/api/recipes", async (req, res) => {
    const query = req.query.query;
    
    //error checking
    if(!query){
        return res.status(400).json({ error: "Missing search query" });
    }
    if(!/^[a-zA-Z\s]+$/.test(query)){
        return res.status(400).json({ error: "Invalid search query" });
    }

    //query the API
    const apiKey = process.env.FOOD_API_KEY;
    if(!apiKey){
        return res.status(500).json({ error: "No API Key found" });
    }
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=20&addRecipeNutrition=true&apiKey=${apiKey}`;
        try{
            const response = await fetch(url);
            if(!response.ok){
                return res.status(response.status).json({error: "Problem with Spoonacular API"});
            }
            const data = await response.json();
            res.json(data);
        }
        catch(error){
            console.error("Recipe API error:", error);
            res.status(500).json({error:"Failed to fetch recipes"});
        }
});

if(require.main === module){
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

const handler = serverless(app);
module.exports = {app, handler};