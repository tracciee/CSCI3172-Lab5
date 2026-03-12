const express = require("express");
const path = require("path");

const app = express();
const port = 8000;

app.use(express.static(path.join(__dirname)));

app.get("/test", (req, res) => {
    res.send("Server Connected!");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});