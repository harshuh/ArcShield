
import { Router } from "express";
import { validate } from "../middleware/zod.middleware";
import {
  CreateLockedTabSchema,
  UpdateLockedTabSchema,
} from "../shared/types";
import {
  getLockedTabs,
  createLockedTab,
  updateLockedTab,
  deleteLockedTab,
} from "../controllers/tabs.controller";

const router = Router();

router.get("/", getLockedTabs);

router.post("/", validate(CreateLockedTabSchema), createLockedTab);

router.patch("/:id", validate(UpdateLockedTabSchema), updateLockedTab);

router.delete("/:id", deleteLockedTab);

export { router as tabsRouter };