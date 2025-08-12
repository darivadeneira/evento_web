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
    const phoneRegex = /^\d{10}$/;
    if (!values.phone || !phoneRegex.test(values.phone.replace(/\D/g, ''))) {
      errors.push('El número telefónico debe contener 10 dígitos (ej: 0999123456)');
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
    { keywords: ['correo', 'email', 'e-mail'], field: 'email' },
    { keywords: ['contraseña', 'password'], field: 'password' },
    { keywords: ['coinciden', 'match', 'confirmación'], field: 'confirmPassword' },
    { keywords: ['nombre de usuario', 'username', 'usuario'], field: 'username' },
    { keywords: ['apellido', 'lastname'], field: 'lastname' },
    { keywords: ['nombre', 'name'], field: 'name' },
    { keywords: ['teléfono', 'telefono', 'phone'], field: 'phone' },
    { keywords: ['términos', 'terminos', 'condiciones'], field: 'terms' },
  ];

  errors.forEach((err) => {
    const mapping = mappings.find((m) => 
      m.keywords.some((keyword) => err.toLowerCase().includes(keyword.toLowerCase()))
    );
    if (mapping) {
      fieldMap[mapping.field] = err;
    }
  });

  return fieldMap;
};

// Función para mapear errores específicos del servidor
export const mapServerErrorToField = (errorMessage: string): { field?: string; message: string } => {
  const lowerMessage = errorMessage.toLowerCase();
  
  // Patrones específicos para diferentes tipos de errores
  const patterns = [
    {
      keywords: ['email', 'correo'],
      checks: [
        { pattern: ['existe', 'already exists', 'taken'], field: 'email', message: 'Este correo electrónico ya está registrado' },
        { pattern: ['inválido', 'invalid', 'formato'], field: 'email', message: 'Formato de correo electrónico inválido' },
      ]
    },
    {
      keywords: ['username', 'usuario'],
      checks: [
        { pattern: ['existe', 'already exists', 'taken'], field: 'username', message: 'Este nombre de usuario ya está registrado' },
        { pattern: ['inválido', 'invalid', 'formato'], field: 'username', message: 'Formato de nombre de usuario inválido' },
      ]
    },
    {
      keywords: ['phone', 'teléfono', 'telefono'],
      checks: [
        { pattern: ['existe', 'already exists', 'taken'], field: 'phone', message: 'Este número telefónico ya está registrado' },
        { pattern: ['inválido', 'invalid', 'formato'], field: 'phone', message: 'Formato de número telefónico inválido' },
      ]
    },
    {
      keywords: ['password', 'contraseña'],
      checks: [
        { pattern: ['débil', 'weak', 'insecure'], field: 'password', message: 'La contraseña no cumple con los requisitos de seguridad' },
        { pattern: ['corta', 'short', 'mínimo'], field: 'password', message: 'La contraseña debe tener al menos 8 caracteres' },
      ]
    }
  ];

  // Buscar coincidencias
  for (const category of patterns) {
    if (category.keywords.some(keyword => lowerMessage.includes(keyword))) {
      for (const check of category.checks) {
        if (check.pattern.some(pattern => lowerMessage.includes(pattern))) {
          return { field: check.field, message: check.message };
        }
      }
    }
  }

  // Si no se encuentra un patrón específico, devolver el mensaje original
  return { message: errorMessage };
};
