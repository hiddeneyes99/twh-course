import { Router, type IRouter } from "express";
import healthRouter from "./health";
import membersRouter from "./members";
import topicsRouter from "./topics";
import progressRouter from "./progress";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(membersRouter);
router.use(topicsRouter);
router.use(progressRouter);
router.use(statsRouter);

export default router;
