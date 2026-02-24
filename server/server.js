require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
 
connectDB();

const PORT = process.env.PORT || 5000;
// Try to read shared-config for origin (optional)
let apiOrigin = null;
try {
  // repo root shared-config.json
  const shared = require("../shared-config.json");
  apiOrigin = shared?.API_ORIGIN || shared?.API_URL || null;
} catch (err) {
  // ignore
}

app.listen(PORT, () =>
  console.log(apiOrigin ? `${apiOrigin}` : `http://localhost:${PORT}`)
);
