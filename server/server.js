import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from "./routes/showRouter.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

await connectDB();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// const inngest = new Inngest({ id: "my-app" });
// const functions = [];

app.get("/", (req, res) => res.send("server is Live"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show",showRouter)
app.use('/api/booking',bookingRouter)
app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)
app.listen(port, () =>
  console.log(`server listening at http://localhost:${port}`)
);
