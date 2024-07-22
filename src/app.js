import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//process.env.CORS_ORIGIN,
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'
import memberRouter from './routes/member.router.js'
import planRouter from './routes/plan.router.js'

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/members", memberRouter)
app.use("/api/v1/plans", planRouter)

app.get("/", function(req, res) {
    res.send({message: "Backend is running fine"});
})

export { app }