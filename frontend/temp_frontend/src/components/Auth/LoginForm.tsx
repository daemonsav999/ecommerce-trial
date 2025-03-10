import React from 'react';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '@/services/api';
import { motion } from 'framer-motion';
import styles from './Auth.module.scss';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data).unwrap();
      // Handle successful login
    } catch (error) {
      // Handle login error
    }
  };

  return (
    <motion.form
      className={styles.form}
      onSubmit={handle