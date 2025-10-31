import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { registerUser, clearError } from '../../store/slices/authSlice';

const schema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  phoneNumber: yup.string().required('Phone number is required').matches(/^\d{10}$/, 'Phone number must be 10 digits'),
  age: yup.number().required('Age is required').min(13, 'Must be at least 13').max(120, 'Invalid age'),
  occupation: yup.string().required('Occupation is required'),
  password: yup.string().required('Password is required').min(6, 'Minimum 6 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm your password'),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [registrationSuccess, setRegistrationSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    const { confirmPassword, ...registerData } = data;
    const result = await dispatch(registerUser(registerData));
    if (registerUser.fulfilled.match(result)) {
      setRegistrationSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-6 py-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
            <p>Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-full">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">Join ScamGuard</h2>
          <p className="mt-2 text-sm text-purple-200">Create your account and stay protected</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            
            <div>
              <label className="block text-sm font-medium text-white">Name</label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Your full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-300">{errors.name.message}</p>}
            </div>

            
            <div>
              <label className="block text-sm font-medium text-white">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white">Phone Number</label>
              <input
                {...register('phoneNumber')}
                type="text"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="10-digit number"
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-300">{errors.phoneNumber.message}</p>}
            </div>

       
            <div>
              <label className="block text-sm font-medium text-white">Age</label>
              <input
                {...register('age')}
                type="number"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Your age"
              />
              {errors.age && <p className="mt-1 text-sm text-red-300">{errors.age.message}</p>}
            </div>


            <div>
              <label className="block text-sm font-medium text-white">Occupation</label>
              <input
                {...register('occupation')}
                type="text"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Your occupation"
              />
              {errors.occupation && <p className="mt-1 text-sm text-red-300">{errors.occupation.message}</p>}
            </div>


            <div>
              <label className="block text-sm font-medium text-white">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>}
            </div>

            
            <div>
              <label className="block text-sm font-medium text-white">Confirm Password</label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-300">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-purple-200">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-white hover:text-purple-200">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
