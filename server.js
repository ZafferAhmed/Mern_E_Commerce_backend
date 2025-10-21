const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000 || process.env.PORT;
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authRouter = require("./routes/auth/auth-routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const adminProductsRouter = require("../server/routes/admin/products-routes");
const ShoppingProductsRouter = require("../server/routes/shop/products-routes")

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", ShoppingProductsRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api/docs`);
});
