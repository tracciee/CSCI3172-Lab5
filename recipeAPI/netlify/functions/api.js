const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const port = 8000;

app.use(express.static(path.join(__dirname)));

app.get("/recipes", async (req, res) => {
    const query = req.query.query;
    const apiKey = "90ec4731282a44a1892c06b66405ab8b";
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=20&addRecipeNutrition=true&apiKey=${apiKey}`;
    
        try{
            const response = await fetch(url);
            const data = await response.json();
            res.json(data);
        }
        catch(error){
            res.status(500).json({error:"Failed to fetch recipes"});
        }
});

if(require.main === module){
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
const handler = serverless(app);
module.exports = {handler};