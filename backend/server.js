const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)).on("error", (err) => {
  console.error(`Failed to listen on port ${PORT}:`, err.message);
  process.exit(1);
});
