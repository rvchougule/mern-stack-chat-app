import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";

dotenv.config({ path: "./.env" });

// MongoDB Connection Callback

connectDB().then(() => {
  app.on("error", (error) => {
    console.error("App Error:-", error);
    process.exit(1);
  });

  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is listening on ${process.env.PORT}`);
  });
});
