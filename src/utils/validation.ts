import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

export const registerSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

// Add other schemas