import { Router } from "express";
import { UserRoute } from "../modules/user/user.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
