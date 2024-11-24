import express from "express";
import * as dashbordController from "../controllers/dashbordController.js";
import { isloggedIn } from "../middleware/checkAuth.js";

export const drouter = express.Router();

// Dashboard routes

 drouter.get("/dashbord", isloggedIn,dashbordController.dashboardpage);
 drouter.get("/dashbord/item/:id", isloggedIn,dashbordController.dashboardViewNote);
 drouter.put("/dashbord/item/:id", isloggedIn,dashbordController.dashboardUpdateNote);
 drouter.delete("/dashbord/item-delete/:id", isloggedIn,dashbordController.dashboardDeleteNote);
 drouter.get("/dashbord/add", isloggedIn,dashbordController.dashboardAdd);
 drouter.post("/dashbord/add", isloggedIn,dashbordController.dashboardAddSubmit);
 drouter.get("/dashbord/search", isloggedIn,dashbordController.dashboardsearch);
 drouter.post("/dashbord/search", isloggedIn,dashbordController.dashboardsearchSubmit);

 export default drouter;