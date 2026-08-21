import { prisma } from '../config/database.js';
import { generateToken, verifyToken } from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { AppError } from '../utils/errors.js';

class AuthService {
  async register(userData) {
    const { email, password, firstName, lastName, phone, role } = userData;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new AppError('User already exists with this email', 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: role || 'STAFF',
        isActive: true,
        refreshToken: null,
        lastLogin: null
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'USER_CREATED',
        entity: 'User',
        entityId: user.id,
        userId: user.id,
        details: { email: user.email, role: user.role },
        ipAddress: '127.0.0.1'
      }
    });

    return user;
  }

  async login(email, password, ipAddress) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated. Please contact admin.', 403);
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date().toISOString() }
    });

    const accessToken = generateToken({ userId: user.id, role: user.role }, '15m');
    const refreshToken = generateToken({ userId: user.id }, '7d');

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    await prisma.auditLog.create({
      data: {
        action: 'USER_LOGIN',
        entity: 'User',
        entityId: user.id,
        userId: user.id,
        details: { email: user.email },
        ipAddress
      }
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }

  async logout(userId, ipAddress) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    });

    await prisma.auditLog.create({
      data: {
        action: 'USER_LOGOUT',
        entity: 'User',
        entityId: userId,
        userId,
        details: { logout: 'user_logged_out' },
        ipAddress
      }
    });
  }

  async refreshToken(refreshToken, ipAddress) {
    if (!refreshToken) {
      throw new AppError('Refresh token required', 401);
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        refreshToken
      }
    });

    if (!user) {
      throw new AppError('Invalid refresh token', 401);
    }

    const newAccessToken = generateToken({ userId: user.id, role: user.role }, '15m');
    const newRefreshToken = generateToken({ userId: user.id }, '7d');

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken }
    });

    await prisma.auditLog.create({
      data: {
        action: 'TOKEN_REFRESHED',
        entity: 'User',
        entityId: user.id,
        userId: user.id,
        details: { refreshed: true },
        ipAddress
      }
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    await prisma.auditLog.create({
      data: {
        action: 'PASSWORD_CHANGED',
        entity: 'User',
        entityId: userId,
        userId,
        details: { password_changed: true }
      }
    });
  }

  async getUsers(filters = {}) {
    const { page = 1, limit = 20, search, role, isActive } = filters;
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    const where = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (role) {
      where.role = role;
    }
    if (isActive !== undefined) {
      where.isActive = isActive === 'true' || isActive === true;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          _count: {
            select: {
              sales: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.user.count({ where })
    ]);

    return {
      data: users,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        pages: Math.max(1, Math.ceil(total / pageSize))
      }
    };
  }
}

export default new AuthService();
