import { Router } from 'express';
import { workflowController } from '../controller/workflow.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 모든 워크플로우 라우트는 인증 필요
router.use(authMiddleware);

router.get('/', (req, res, next) =>
  workflowController.list(req as any, res).catch(next),
);
router.post('/', (req, res, next) =>
  workflowController.create(req as any, res).catch(next),
);
router.get('/:id', (req, res, next) =>
  workflowController.getById(req as any, res).catch(next),
);
router.put('/:id', (req, res, next) =>
  workflowController.update(req as any, res).catch(next),
);
router.delete('/:id', (req, res, next) =>
  workflowController.delete(req as any, res).catch(next),
);

export default router;
