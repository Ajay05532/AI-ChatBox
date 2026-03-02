import express from "express";
import routes from "./routes/routes.js";

const app = express();

app.use(express.json());
app.use("/api", routes);

app.listen(3001, () => {
    console.log("Server started on port 3001");
});