import { prisma } from '../config/database.js';

class SettingsService {
  async getSettings() {
    return prisma.__state.settings;
  }

  async updateSettings(payload, userId) {
    const next = {
      businessProfile: {
        ...prisma.__state.settings.businessProfile,
        ...(payload.businessProfile || {})
      },
      receiptSettings: {
        ...prisma.__state.settings.receiptSettings,
        ...(payload.receiptSettings || {})
      },
      userPreferences: {
        ...prisma.__state.settings.userPreferences,
        ...(payload.userPreferences || {})
      }
    };

    prisma.__state.settings = next;

    await prisma.auditLog.create({
      data: {
        action: 'SETTINGS_UPDATED',
        entity: 'Settings',
        entityId: 'settings',
        userId,
        details: next
      }
    });

    return next;
  }
}

export default new SettingsService();
