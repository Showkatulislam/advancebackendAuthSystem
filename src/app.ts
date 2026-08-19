import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import { success } from "zod";
export const app = express()

app.use(cors({
    origin: true,
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message:"Auth service is healty"
    })
})



