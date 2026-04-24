// utils/validation.ts
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (pwd: string): { valid: boolean; errors: string[] } => {
    const errors = [];
    if (pwd.length < 8) errors.push('At least 8 characters required');
    if (!/[A-Z]/.test(pwd)) errors.push('Must contain uppercase letter');
    if (!/[0-9]/.test(pwd)) errors.push('Must contain number');
    return { valid: errors.length === 0, errors };
  },

  phone: (phone: string): boolean => {
    return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/\D/g, ''));
  },

  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  name: (name: string): boolean => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
  }
};