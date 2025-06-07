// Tipos para tipado fuerte
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  fieldValidation: Record<string, boolean>;
}

// Función para calcular fortaleza de contraseña
export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;

  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

// Función para obtener color según fortaleza
export const getPasswordStrengthColor = (strength: number): string => {
  if (strength < 40) return '#FF5252';
  if (strength < 70) return '#FFC107';
  return '#4AFF75';
};

// Función para obtener texto según fortaleza
export const getPasswordStrengthText = (strength: number): string => {
  if (strength < 40) return 'Débil';
  if (strength < 70) return 'Media';
  return 'Fuerte';
};

// Validaciones para el formulario de registro
export const validateRequired = (message: string) => (value: any) => {
  return !value || (typeof value === 'string' && value.trim() === '') ? message : undefined;
};

export const validateEmail = (value: any) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return 'El correo electrónico es requerido';
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov)$/i;
  return !emailRegex.test(value) ? 'Formato de correo electrónico inválido' : undefined;
};

// Función principal de validación del formulario
export const validateRegistrationForm = (values: any, step: number, termsAccepted: boolean): ValidationResult => {
  const errors: string[] = [];
  const validation: Record<string, boolean> = {};

  if (step === 0) {
    // Email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov)$/i;
    if (!values.email || !emailRegex.test(values.email)) {
      errors.push('Formato de correo electrónico inválido');
    } else {
      validation.email = true;
    }

    // Password
    if (!values.password || values.password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
      errors.push('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
    } else {
      validation.password = true;
    }

    // Confirm Password
    if (!values.confirmPassword || values.confirmPassword !== values.password) {
      errors.push('Las contraseñas no coinciden');
    } else if (validation.password) {
      validation.confirmPassword = true;
    }

    // Terms
    if (!termsAccepted) {
      errors.push('Debes aceptar los términos y condiciones');
    }
  } else {
    // Name
    if (
      !values.name ||
      values.name.length < 2 ||
      values.name.length > 50 ||
      !/^[a-zA-ZÀ-ÿ\s]+$/.test(values.name.trim())
    ) {
      errors.push('El nombre debe tener entre 2 y 50 caracteres y solo contener letras');
    } else {
      validation.name = true;
    }

    // Lastname
    if (
      !values.lastname ||
      values.lastname.length < 2 ||
      values.lastname.length > 50 ||
      !/^[a-zA-ZÀ-ÿ\s]+$/.test(values.lastname.trim())
    ) {
      errors.push('El apellido debe tener entre 2 y 50 caracteres y solo contener letras');
    } else {
      validation.lastname = true;
    }

    // Username
    if (
      !values.username ||
      values.username.length < 3 ||
      values.username.length > 20 ||
      !/^[a-zA-Z0-9_]+$/.test(values.username)
    ) {
      errors.push('El nombre de usuario debe tener entre 3 y 20 caracteres (solo letras, números y guiones bajos)');
    } else {
      validation.username = true;
    }

    // Phone
    const phoneRegex = /^(\+?[1-9]\d{0,3})?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{4}$/;
    if (!values.phone || !phoneRegex.test(values.phone.replace(/\s/g, ''))) {
      errors.push('El número telefónico debe tener un formato válido (ej: +593 999 123 456 o 0999123456)');
    } else {
      validation.phone = true;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    fieldValidation: validation,
  };
};

// Mapeo de errores a campos específicos
export const mapErrorsToFields = (errors: string[]): Record<string, string> => {
  const fieldMap: Record<string, string> = {};
  const mappings = [
    { keywords: ['correo', 'email'], field: 'email' },
    { keywords: ['contraseña'], field: 'password' },
    { keywords: ['coinciden'], field: 'confirmPassword' },
    { keywords: ['nombre de usuario'], field: 'username' },
    { keywords: ['apellido'], field: 'lastname' },
    { keywords: ['nombre'], field: 'name' },
    { keywords: ['tel'], field: 'phone' },
  ];

  errors.forEach((err) => {
    const mapping = mappings.find((m) => m.keywords.some((keyword) => err.toLowerCase().includes(keyword)));
    if (mapping) {
      fieldMap[mapping.field] = err;
    }
  });

  return fieldMap;
};
