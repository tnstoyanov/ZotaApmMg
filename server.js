const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const ZOTAPAY_API_URL = "https://api.zotapay-sandbox.com/api/v1/deposit/request/90196";

app.post("/proxy/payment", async (req, res) => {
    try {
        console.log("Request body:", req.body); // Log the request body

        const response = await axios.post(ZOTAPAY_API_URL, req.body, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("Response from ZotaPay:", response.data); // Log the response from ZotaPay

        res.json(response.data);
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);
            res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
            // The request was made but no response was received
            console.error("Error request data:", error.request);
            res.status(500).json({ error: "No response received from ZotaPay." });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error message:", error.message);
            res.status(500).json({ error: "Payment request failed." });
        }
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});