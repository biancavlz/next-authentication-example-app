import AuthForm from '@/components/auth-form';
import { signin } from '@/actions/auth-actions';

export default async function LoginPage() {
  return <AuthForm action={signin} submitLabel="Login" mode="signin" />;
}
