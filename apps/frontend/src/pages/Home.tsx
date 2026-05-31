import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useApiQuery } from '../lib/useApi';
import { Button } from '../components/ui';
import { Badge } from '../components/ui';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../components/ui';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui';
import { api } from '../lib/api';

interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: string;
  isActive: boolean;
  createdAt: string;
}

// 더미 데이터 (백엔드 없이 테스트용)
const DEMO_WORKFLOWS: Workflow[] = [
  {
    id: '1',
    name: '일일 보고서 생성',
    description: '매일 9시에 보고서 자동 생성',
    status: 'PUBLISHED',
    isActive: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: '고객 데이터 동기화',
    description: 'CRM과 ERP 시스템 데이터 동기화',
    status: 'PUBLISHED',
    isActive: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: '월간 결산 자동화',
    description: '월말에 재무 데이터 자동 정리',
    status: 'DRAFT',
    isActive: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    name: '이메일 캠페인 발송',
    description: '마케팅 캠페인 자동 이메일 발송',
    status: 'PUBLISHED',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const Home = () => {
  const { isAuthenticated, user, setAuth } = useAuthStore();
  const [showDemo, setShowDemo] = useState(false);

  // 데모 모드 활성화 (백엔드 없을 때)
  useEffect(() => {
    if (!isAuthenticated) {
      // 자동으로 데모 데이터 로드
      setTimeout(() => {
        setAuth(
          {
            id: 'demo-user',
            email: 'demo@example.com',
            name: '테스트 사용자',
          },
          'demo-token'
        );
        setShowDemo(true);
      }, 500);
    }
  }, [isAuthenticated, setAuth]);

  const { data, isLoading } = useApiQuery(() =>
    api.workflows.list().then((res) => ({
      data: { success: true, data: res.data.data?.items || [] },
    })),
    { showErrorToast: false },
  );

  // 백엔드가 없으면 더미 데이터 사용
  const workflows = showDemo ? DEMO_WORKFLOWS : ((data || []) as Workflow[]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            워크플로우 관리
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.name}님의 자동화 워크플로우
          </p>
        </div>
        <Link to="/workflows/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            새 워크플로우
          </Button>
        </Link>
      </div>

      {workflows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="h-12 w-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-6">
              아직 생성된 워크플로우가 없습니다.
            </p>
            <Link to="/workflows/new">
              <Button>첫 번째 워크플로우 생성</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>워크플로우 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>생성일</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell className="font-medium">
                        {workflow.name}
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        {workflow.description || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            workflow.isActive ? 'success' : 'default'
                          }
                        >
                          {workflow.isActive ? '활성' : '비활성'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(workflow.createdAt).toLocaleDateString(
                          'ko-KR',
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/workflows/${workflow.id}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                          >
                            보기
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
