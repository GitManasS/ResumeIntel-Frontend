import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { useState } from 'react';

const schema = Yup.object({
  password: Yup.string().min(8).required(),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
});

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <p className="text-red-600">Invalid reset link.</p>
          <Link to="/forgot-password" className="mt-4 inline-block text-brand-600">Request new link</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md card">
        <h1 className="font-display text-3xl">Set new password</h1>
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={schema}
          onSubmit={async (values) => {
            setLoading(true);
            try {
              await authApi.resetPassword({ token, password: values.password });
              toast.success('Password updated!');
              navigate('/login');
            } catch {
              toast.error('Reset failed');
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className="mt-8 space-y-4">
              <Input label="New Password" name="password" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} error={touched.password && errors.password} />
              <Input label="Confirm Password" name="confirmPassword" type="password" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} error={touched.confirmPassword && errors.confirmPassword} />
              <Button type="submit" className="w-full" loading={loading}>Reset Password</Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
