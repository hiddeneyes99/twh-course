import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import membersRouter from "./members";
import topicsRouter from "./topics";
import progressRouter from "./progress";
import statsRouter from "./stats";
import quizRouter from "./quiz";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(membersRouter);
router.use(topicsRouter);
router.use(progressRouter);
router.use(statsRouter);
router.use(quizRouter);

export default router;
