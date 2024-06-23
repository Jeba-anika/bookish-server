import { Router } from "express";
import { AuthRouter } from "../modules/Auth/auth.router";
import { UserRoute } from "../modules/user/user.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoute,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
