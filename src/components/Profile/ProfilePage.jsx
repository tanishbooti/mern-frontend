import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { User, Save, Shield, Edit } from 'lucide-react';
import { updateUserProfile, getUserProfile } from '../../store/slices/authSlice';
import LoadingSpinner from '../UI/LoadingSpinner';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = React.useState(false);
  const [updateSuccess, setUpdateSuccess] = React.useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      age: user?.age || '',
      occupation: user?.occupation || '',
      phoneNumber: user?.phoneNumber || '',
    }
  });

  React.useEffect(() => {
    if (!user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        age: user.age,
        occupation: user.occupation,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const result = await dispatch(updateUserProfile(data));
    if (updateUserProfile.fulfilled.match(result)) {
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        age: user.age,
        occupation: user.occupation,
        phoneNumber: user.phoneNumber,
      });
    }
  };

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
          <User className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
        </div>
      </div>

      {updateSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-300">Profile updated successfully!</p>
        </div>
      )}

      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-3 py-1 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Full Name</label>
              <input
  {...register('name', { required: 'Name is required' })}
  disabled={!isEditing}
  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 text-gray-900 dark:text-gray-100"
/>

              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                {...register('email', { required: 'Email is required' })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 dark:disabled:bg-gray-800"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Phone Number</label>
              <input
                {...register('phoneNumber', { required: 'Phone number is required' })}
                disabled={!isEditing}
                className="w-full text-gray-900 dark:text-gray-100 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 dark:disabled:bg-gray-800"
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
            </div>

            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Age</label>
              <input
                {...register('age', { required: 'Age is required' })}
                disabled={!isEditing}
                className="w-full px-3 text-gray-900 dark:text-gray-100 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 dark:disabled:bg-gray-800"
              />
              {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>}
            </div>

            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Occupation</label>
              <input
                {...register('occupation', { required: 'Occupation is required' })}
                disabled={!isEditing}
                className="w-full px-3 text-gray-900 dark:text-gray-100 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 dark:disabled:bg-gray-800"
              />
              {errors.occupation && <p className="mt-1 text-sm text-red-600">{errors.occupation.message}</p>}
            </div>
          </div>

          {isEditing && (
            <div className="flex space-x-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
          <Shield className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Password</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Last updated: Never</p>
          </div>
          <button className="px-3 py-1 text-purple-600 rounded-lg text-sm">Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
