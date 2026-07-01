import { Router, type IRouter } from "express";
import { curriculum } from "../lib/curriculum";
import { ListTopicsQueryParams, ListTopicsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/topics", async (req, res): Promise<void> => {
  const query = ListTopicsQueryParams.safeParse(req.query);
  let topics = curriculum;
  if (query.success) {
    if (query.data.phase) {
      topics = topics.filter((t) => t.phase === query.data.phase);
    }
    if (query.data.category) {
      topics = topics.filter((t) => t.category === query.data.category);
    }
  }
  res.json(ListTopicsResponse.parse(topics));
});

export default router;
