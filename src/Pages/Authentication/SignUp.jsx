import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { usePost } from '../../Hooks/usePost';
import { useGet } from '../../Hooks/useGet';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import { useAuth } from '../../Context/Auth';
import mainLogo from '../../assets/Images/mainLogo.png';

const SignUp = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const auth = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    f_name: '',
    l_name: '',
    nick_name: '',
    email: '',
    phone: '',
    country_id: null,
    city_id: null,
    category_id: null,
    grade: null,
    password: '',
    conf_password: ''
  });
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [categories, setCategories] = useState([]);

  // Static grade options
  const gradeOptions = Array.from({ length: 13 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Grade ${i + 1}`
  }));

  // Log gradeOptions to verify
  console.log('Grade Options:', gradeOptions);

  // API hooks
  const { refetch: refetchList, loading: loadingList, data: dataList } = useGet({
    url: `${apiUrl}/user/sign_up_lists`
  });
  const { postData, loading: loadingPost, response } = usePost({
    url: `${apiUrl}/user/sign_up`
  });

  // Fetch lists on mount
  useEffect(() => {
    refetchList();
  }, [refetchList]);

  // Update lists when data is fetched
  useEffect(() => {
    if (dataList && !loadingList) {
      console.log(dataList);
      setCountries(dataList.countries || []);
      setCities(dataList.cities || []);
      setCategories(dataList.categories || []);
    }
  }, [dataList, loadingList]);

  // Filter cities based on selected country
  useEffect(() => {
    if (formData.country_id) {
      const filtered = cities.filter(city => city.country_id === formData.country_id.toString());
      setFilteredCities(filtered);
      setFormData(prev => ({ ...prev, city_id: null }));
    } else {
      setFilteredCities([]);
    }
  }, [formData.country_id, cities]);

  // Handle successful signup
  useEffect(() => {
    if (response && response.data && response.status === 200 && !loadingPost) {
      const userWithToken = {
        ...response.data.user,
        token: response.data.token
      };
      // Send to auth context
      auth.login(userWithToken);
      navigate('/', { replace: true });
    }
  }, [response]);


  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.f_name) newErrors.f_name = 'First name is required';
    if (!formData.l_name) newErrors.l_name = 'Last name is required';
    if (!formData.nick_name) newErrors.nick_name = 'Nickname is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.country_id) newErrors.country_id = 'Country is required';
    if (!formData.city_id) newErrors.city_id = 'City is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.grade) newErrors.grade = 'Grade is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.conf_password) newErrors.conf_password = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare form data for submission
    const submitData = {
      f_name: formData.f_name,
      l_name: formData.l_name,
      nick_name: formData.nick_name,
      email: formData.email,
      phone: formData.phone,
      country_id: formData.country_id.toString(),
      city_id: formData.city_id.toString(),
      category_id: formData.category_id.toString(),
      grade: formData.grade,
      password: formData.password,
      conf_password: formData.conf_password
    };

    postData(submitData);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // React Select options
  const countryOptions = countries.map(country => ({
    value: country.id,
    label: country.name
  }));

  const cityOptions = filteredCities.map(city => ({
    value: city.id,
    label: city.city
  }));

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.cate_name
  }));

  return (
    <div className="flex items-center justify-center bg-white overflow-auto p-4 md:p-8">
      <img
        src={mainLogo}
        alt="Maths House Logo"
        className="absolute top-2 left-2 h-10 md:h-12 object-contain"
      />

      <div className="relative w-full flex rounded-2xl overflow-hidden">
        {/* Left side - Form */}
        <div className="w-full md:w-3/5 p-4 md:p-6 flex flex-col justify-center">
          <div className="text-center mb-4 animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-mainColor mb-1">Sign Up for Maths House</h1>
            <p className="text-mainColor/80 text-base">Create Your Account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 text-xs font-medium mb-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <FaUser className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="f_name"
                    value={formData.f_name}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className={`w-full pl-8 pr-3 py-2 rounded-lg border ${errors.f_name ? 'border-red-400' : 'border-gray-300'} focus:ring-1 focus:ring-mainColor/20 focus:border-mainColor outline-none transition duration-200 bg-gray-50 hover:bg-white text-sm`}
                  />
                </div>
                {errors.f_name && <p className="mt-1 text-xs text-red-500 animate-pulse">{errors.f_name}</p>}
              </div>

              <div>
                <label className="block text-gray-700 text-xs font-medium mb-1">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <FaUser className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="l_name"
                    value={formData.l_name}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className={`w-full pl-8 pr-3 py-2 rounded-lg border ${errors.l_name ? 'border-red-400' : 'border-gray-300'} focus:ring-1 focus:ring-mainColor/20 focus:border-mainColor outline-none transition duration-200 bg-gray-50 hover:bg-white text-sm`}
                  />
                </div>
                {errors.l_name && <p className="mt-1 text-xs text-red-500 animate-pulse">{errors.l_name}</p>}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1">Nickname</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <FaUser className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="nick_name"
                  value={formData.nick_name}
                  onChange={handleInputChange}
                  placeholder="Nickname"
                  className={`w-full pl-8 pr-3 py-2 rounded-lg border ${errors.nick_name ? 'border-red-400' : 'border-gray-300'} focus:ring-1 focus:ring-mainColor/20 focus:border-mainColor outline-none transition duration-200 bg-gray-50 hover:bg-white text-sm`}
                />
              </div>
              {errors.nick_name && <p className="mt-1 text-xs text-red-500 animate-pulse">{errors.nick_name}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`w-full pl-8 pr-3 py-2 rounded-lg border ${errors.email ? 'border-red-400' : 'border-gray-300'} focus:ring-1 focus:ring-mainColor/20 focus:border-mainColor outline-none transition duration-200 bg-gray-50 hover:bg-white text-sm`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 animate-pulse">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <FaPhone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  className={`w-full pl-8 pr-3 py-2 rounded-lg border ${errors.phone ? 'border-red-400' : 'border-gray-300'} focus:ring-1 focus:ring-mainColor/20 focus:border-mainColor outline-none transition duration-200 bg-gray-50 hover:bg-white text-sm`}
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500 animate-pulse">{errors.phone}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 text-xs font-medium mb-1">Country</label>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(option => option.value === formData.country_id)}
                  onChange={(selected) => setFormData(prev => ({ ...prev, country_id: selected ? selected.value : null }))}
                  placeholder="Select country"
                  className={`react-select-container ${errors.country_id ? 'border-red-400' : ''}`}
                  classNamePrefix="react-select"
                  menuPlacement="auto"
                />
                {errors.country_id && <p className="mt-1 text-xs text-red-500 animate-pulse">{errors.country_id}</p>}
              </div>

              <div>
                <label className="block text-gray-700 text-xs font-medium mb-1">City</label>
                <Select
                  options={cityOptions}
                  value={cityOptions.find(option => option.value === formData.city_id)}
                  onChange={(selected) => setFormData(prev => ({ ...prev, city_id: selected ? selected.value : null }))}
                  placeholder="Select city"
                  isDisabled={!formData.country_id}
                  className={`react-select-container ${errors.city_id ? 'border-red-400' : ''}`}
                  classNamePrefix="react-select"
                  menuPlacement="auto"
                />
                {errors.city_id && <p className="mt-1 text-xs text-red-500 animate-pulse">{errors.city_id}</p>}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1">Category</label>
              <Select
                options={categoryOptions}
                value={categoryOptions.find(option => option.value === formData.category_id)}
                onChange={(selected) => setFormData(prev => ({ ...prev, category_id: selected ? selected.value : null }))}
                placeholder="Select category"
                className={`react-select-container ${errors.category_id ? 'border-red-400' : ''}`}
                classNamePrefix="react-select"
                menuPlacement="auto"
              />
              {errors.category_id && <p className="mt-1 text-xs text-red-500 animate-pulse">{errors.category_id}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1">Grade</label>
              <Select
                options={gradeOptions}
                value={gradeOptions.find(option => option.value === formData.grade)}
                onChange={(selected) => setFormData(prev => ({ ...prev, grade: selected ? selected.value : null }))}
                placeholder="Select grade"
                className={`react-select-container ${errors.grade ? 'border-red-400' : ''}`}
                classNamePrefix="react-select"
                menuPlacement="auto"
              />
              {errors.grade && <p className="mt-1 text-xs text-red-500 animate-pulse">{errors.grade}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 text-xs font-medium mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className={`w-full pl-8 pr-3 py-2 rounded-lg border ${errors.password ? 'border-red-400' : 'border-gray-300'} focus:ring-1 focus:ring-mainColor/20 focus:border-mainColor outline-none transition duration-200 bg-gray-50 hover:bg-white text-sm`}
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500 animate-pulse">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-gray-700 text-xs font-medium mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="conf_password"
                    value={formData.conf_password}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    className={`w-full pl-8 pr-3 py-2 rounded-lg border ${errors.conf_password ? 'border-red-400' : 'border-gray-300'} focus:ring-1 focus:ring-mainColor/20 focus:border-mainColor outline-none transition duration-200 bg-gray-50 hover:bg-white text-sm`}
                  />
                </div>
                {errors.conf_password && <p className="mt-1 text-xs text-red-500 animate-pulse">{errors.conf_password}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-mainColor hover:bg-secondColor text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 text-sm"
              disabled={loadingPost}
            >
              {loadingPost ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing Up...
                </>
              ) : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-mainColor hover:text-secondColor font-medium transition-colors duration-200">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Right side - Logo (hidden on small screens) */}
        <div className="hidden md:flex w-2/5 bg-gradient-to-br from-mainColor to-secondColor items-center justify-center">
          <img
            src={mainLogo}
            alt="Maths House Logo"
            className="w-2/3 max-w-sm object-contain animate-float"
          />
        </div>
      </div>

      {/* Tailwind animation classes and React Select styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease forwards;
        }
        .animate-float {
          animation: float 2.5s ease-in-out infinite;
        }
        .react-select-container .react-select__control {
          border: 1px solid ${errors.country_id || errors.city_id || errors.category_id || errors.grade ? '#f87171' : '#d1d5db'};
          border-radius: 0.375rem;
          background-color: #f9fafb;
          padding: 0.25rem;
          transition: all 0.2s ease;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
        .react-select-container .react-select__control:hover {
          background-color: #ffffff;
          border-color: #cf202f;
        }
        .react-select-container .react-select__control--is-focused {
          border-color: #cf202f;
          box-shadow: 0 0 0 1px rgba(79, 70, 229, 0.2);
        }
        .react-select__option--is-selected {
          background-color: #cf202f;
        }
        .react-select__option--is-focused {
          background-color: #f7c6c5;
        }
        .react-select__menu {
          font-size: 0.875rem;
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
          scrollbar-width: thin;
          scrollbar-color: #cf202f #e5e7eb;
        }
        .react-select__menu::-webkit-scrollbar {
          width: 8px;
        }
        .react-select__menu::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 4px;
        }
        .react-select__menu::-webkit-scrollbar-thumb {
          background: #cf202f;
          border-radius: 4px;
        }
        .react-select__menu::-webkit-scrollbar-thumb:hover {
          background: #4338ca;
        }
      `}</style>
    </div>
  );
};

export default SignUp;