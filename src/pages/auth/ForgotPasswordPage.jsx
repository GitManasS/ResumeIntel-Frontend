import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { authApi } from '../../api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { useState } from 'react';

const schema = Yup.object({ email: Yup.string().email().required() });

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md card">
        <h1 className="font-display text-3xl">Reset password</h1>
        <p className="mt-1 text-sm text-slate-500">We&apos;ll send you a reset link if the email exists.</p>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            setLoading(true);
            try {
              await authApi.forgotPassword(values.email);
              toast.success('If email exists, reset link sent');
            } catch {
              toast.error('Something went wrong');
            } finally {
              setLoading(false);
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className="mt-8 space-y-4">
              <Input label="Email" name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={touched.email && errors.email} />
              <Button type="submit" className="w-full" loading={loading}>Send Reset Link</Button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-brand-600 hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
