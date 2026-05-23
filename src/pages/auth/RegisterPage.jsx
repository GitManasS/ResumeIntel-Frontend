import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../features/auth/authSlice';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { getPostAuthPath } from '../../utils/authRedirect';

const schema = Yup.object({
  name: Yup.string().min(2).required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Min 8 characters').required('Required'),
  role: Yup.string().oneOf(['candidate']).required(),
});

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { loading } = useSelector((s) => s.auth);

  return (
    <AuthLayout title="Create account" subtitle="Create your candidate profile to apply for jobs">
      <Formik
        initialValues={{ name: '', email: '', password: '', role: 'candidate' }}
        validationSchema={schema}
        onSubmit={async (values) => {
          dispatch(clearError());
          const result = await dispatch(register(values));
          if (register.fulfilled.match(result)) {
            toast.success('Account created!');
            navigate(getPostAuthPath(result.payload, redirect));
          } else {
            toast.error(result.payload || 'Registration failed');
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form className="space-y-4">
            <Input
              label="Full name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && errors.password}
            />
            <input type="hidden" name="role" value="candidate" />
            <Button type="submit" className="w-full" loading={loading}>
              Create account
            </Button>
          </Form>
        )}
      </Formik>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
