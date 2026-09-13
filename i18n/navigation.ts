import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * 로케일을 자동으로 유지하는 네비게이션 API.
 * 컴포넌트에서는 next/link 대신 반드시 여기의 Link를 사용합니다.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
