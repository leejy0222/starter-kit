import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import workflowRoutes from './routes/workflow.routes';

const app = express();

// 보안 미들웨어
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  }),
);

// 파싱 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅 (개발 환경)
if (env.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/workflows', workflowRoutes);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'API endpoint not found',
    },
    timestamp: new Date().toISOString(),
  });
});

// 에러 핸들링 (마지막에 위치)
app.use(errorHandler);

const server = app.listen(env.port, () => {
  console.log(`✅ Server running on http://localhost:${env.port}`);
  console.log(`📊 API docs: http://localhost:${env.port}/health`);
});

// 우아한 종료
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
