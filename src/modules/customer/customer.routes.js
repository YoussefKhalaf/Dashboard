import { Router } from "express";
import { addCustomer } from "./customer.controller.js";


const customerRouter = Router()
customerRouter.post("/addCustomer", addCustomer)