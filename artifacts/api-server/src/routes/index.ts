import { Router, type IRouter } from "express";
import healthRouter from "./health";
import servicesRouter from "./services";
import portfolioRouter from "./portfolio";
import testimonialsRouter from "./testimonials";
import contactRouter from "./contact";
import settingsRouter from "./settings";
import blogRouter from "./blog";

const router: IRouter = Router();

router.use(healthRouter);
router.use(servicesRouter);
router.use(portfolioRouter);
router.use(testimonialsRouter);
router.use(contactRouter);
router.use(settingsRouter);
router.use(blogRouter);

export default router;
