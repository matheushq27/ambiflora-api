import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ClsService, ClsStore } from 'nestjs-cls';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';

export interface AppClsStore extends ClsStore {
  user: {
    userId: string;
    companyId: number | null;
  };
}

export interface UserSession {
  id: string;
  name: string;
  surname: string;
  email: string;
  userType: string;
  companyId: number | null;
  company: {
    id: number;
    name: string;
  } | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isUser: boolean;
  isDeveloper: boolean;
}

@Injectable()
export class UserCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: PrismaService,
    private cls: ClsService<AppClsStore>,
  ) {}

  private getSessionKey(userId: string): string {
    return `users:${userId}:session`;
  }

  private get currentUser() {
    return this.cls.get('user');
  }

  async getSession(): Promise<UserSession | null> {
    const user = this.currentUser;
    if (!user || !user.userId) return null;
    
    return (
      (await this.cacheManager.get<UserSession>(
        this.getSessionKey(user.userId),
      )) || null
    );
  }

  async setSession(session: UserSession): Promise<void> {
    await this.cacheManager.set(
      this.getSessionKey(session.id),
      session,
    );
  }

  async invalidateSession(): Promise<void> {
    const user = this.currentUser;
    if (user && user.userId) {
      await this.cacheManager.del(this.getSessionKey(user.userId));
    }
  }

  async invalidateUserSession(userId: string): Promise<void> {
    await this.cacheManager.del(this.getSessionKey(userId));
  }

  async getUserData(): Promise<UserSession> {
    const cachedSession = await this.getSession();
    if (cachedSession) {
      return cachedSession;
    }

    const { userId } = this.currentUser;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        Company: {
          select: { id: true, name: true }
        }
      },
    });

    if (!user) throw new Error('Usuário não encontrado');

    const session: UserSession = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      userType: user.userType,
      companyId: user.companyId,
      company: user.Company ? {
        id: user.Company.id,
        name: user.Company.name,
      } : null,
      isSuperAdmin: user.userType === 'SUPER_ADMIN',
      isAdmin: user.userType === 'ADMIN',
      isUser: user.userType === 'USER',
      isDeveloper: user.userType === 'DEVELOPER',
    };

    await this.setSession(session);
    return session;
  }
}
