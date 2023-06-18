const app = require("express")();
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

app.listen(process.env.PORT, () => {
  console.log(`Server started on http://localhost:${process.env.PORT}`);
});
