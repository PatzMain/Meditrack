import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Package, Home, LogOut, Wrench, Archive, Shield, Menu, X, Search, User, Users, Stethoscope, ChevronRight, Settings, UserCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { universalSearch, type SearchResult } from '../lib/universalSearch';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };
  
  const currentUser = getCurrentUser();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const results = universalSearch.search(searchTerm);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchTerm]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchResultClick = (result: SearchResult) => {
    console.log('Search result clicked:', result);
    setShowSearchResults(false);
    setSearchTerm('');
    
    // Navigate to the appropriate page
    const pageRoutes = {
      'Patients': '/patients',
      'Consultations': '/consultations', 
      'Medical Records': '/medical-records',
      'Medicines': '/medicines',
      'Supplies': '/supplies',
      'Equipment': '/equipment'
    };
    
    const route = pageRoutes[result.page as keyof typeof pageRoutes];
    console.log('Navigating to route:', route, 'with highlight ID:', result.id);
    if (route) {
      localStorage.setItem('searchHighlight', result.id);
      localStorage.setItem('searchTimestamp', Date.now().toString());
      console.log('Stored searchHighlight in localStorage:', result.id);
      
      // Check if we're already on the target route
      if (location.pathname === route) {
        console.log('Already on target route, triggering direct highlight');
        // Force trigger the highlighting by dispatching a custom event
        window.dispatchEvent(new CustomEvent('searchHighlight', { detail: result.id }));
      } else {
        navigate(route);
      }
    }
  };

  const getSearchIcon = (iconName: string) => {
    const iconMap = {
      'Users': Users,
      'Stethoscope': Stethoscope,
      'FileText': FileText,
      'Package': Package,
      'Archive': Archive,
      'Wrench': Wrench
    };
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Package;
    return IconComponent;
  };

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm('Are you sure you want to sign out?');
    
    if (confirmLogout) {
      try {
        // Clear all authentication related data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        sessionStorage.clear();
        
        // Navigate to login page
        navigate('/login', { replace: true });
        
        // Optional: Show success message
        console.log('Successfully signed out');
      } catch (error) {
        console.error('Error during logout:', error);
        // Still navigate to login even if there's an error
        navigate('/login', { replace: true });
      }
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    { name: 'Patients', href: '/patients', icon: Users, color: 'bg-gradient-to-r from-teal-500 to-teal-600' },
    { name: 'Consultations', href: '/consultations', icon: Stethoscope, color: 'bg-gradient-to-r from-emerald-500 to-emerald-600' },
    { name: 'Medical Records', href: '/medical-records', icon: FileText, color: 'bg-gradient-to-r from-rose-500 to-pink-600' },
    { name: 'Medicines', href: '/medicines', icon: Package, color: 'bg-gradient-to-r from-green-500 to-green-600' },
    { name: 'Supplies', href: '/supplies', icon: Archive, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    { name: 'Equipment', href: '/equipment', icon: Wrench, color: 'bg-gradient-to-r from-pink-500 to-red-500' },
    { name: 'Admin Management', href: '/admin-management', icon: Shield, superAdminOnly: true, color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
    { name: 'Logs', href: '/logs', icon: Activity, color: 'bg-gradient-to-r from-indigo-500 to-indigo-600' },
  ];

  return (
    <div className="min-h-screen transition-all duration-300 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`${
        isMobile 
          ? `fixed inset-y-0 left-0 z-50 w-72 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition duration-300 ease-in-out lg:translate-x-0`
          : 'fixed left-0 top-0 h-screen w-72 z-50'
      } bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-r border-slate-700`}>
        
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700/50">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold text-white tracking-tight">MediTrack</span>
              <p className="text-xs text-slate-400 font-medium">Clinic System</p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col h-full">
          <nav className="mt-6 px-3 space-y-1 overflow-y-auto flex-1">
            {navigation
              .filter(item => {
                // Filter out superadmin-only items for non-superadmin users
                if (item.superAdminOnly) {
                  return currentUser?.role === 'superadmin';
                }
                return true;
              })
              .map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'
                  }`} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
            
            {/* User Profile System - Integrated into navigation */}
            <div className="mt-6 pt-4 border-t border-slate-700/50" ref={profileRef}>
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="group w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                >
                  <div className="h-5 w-5 mr-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <span className="flex-1 text-left">{currentUser?.full_name || 'User Profile'}</span>
                  {showProfileDropdown ? (
                    <ChevronUp className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition-colors duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition-colors duration-200" />
                  )}
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="mt-2 bg-slate-800/90 border border-slate-600 rounded-lg shadow-xl backdrop-blur-sm">
                    <div className="p-2 space-y-1">
                      {/* Profile Header */}
                      <div className="px-3 py-2 border-b border-slate-600/50">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{currentUser?.full_name || 'User'}</p>
                            <p className="text-xs text-slate-400 capitalize">{currentUser?.role || 'User'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Profile Menu Items */}
                      <div className="space-y-1">
                        <button 
                          onClick={() => {
                            setShowProfileDropdown(false);
                            navigate('/profile');
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-md transition-colors duration-200"
                        >
                          <Settings className="h-3 w-3 text-slate-400" />
                          <span>Account Settings</span>
                        </button>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-slate-600/50 pt-1">
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-md transition-colors duration-200"
                        >
                          <LogOut className="h-3 w-3 text-red-400" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </nav>

        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${isMobile ? '' : 'ml-72'}`}>
        {/* Top bar */}
        <div className={`flex h-16 bg-gradient-to-r from-slate-50/95 to-white/95 shadow-lg border-b border-slate-200/60 ${isMobile ? '' : 'fixed top-0 right-0 z-40'} backdrop-blur-xl`} 
             style={isMobile ? {} : {left: '18rem'}}>
          <div className="flex-1 flex justify-between items-center px-6">
            <div className="flex items-center space-x-4">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-md">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                    {navigation.find(nav => nav.href === location.pathname)?.name || 'Dashboard'}
                  </h1>
                  <p className="text-xs text-slate-500">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Universal Search */}
              <div className="hidden md:flex relative" ref={searchRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length >= 2 && setShowSearchResults(true)}
                  className="block w-72 pl-9 pr-3 py-2 border border-slate-200 bg-white/80 text-slate-800 placeholder-slate-400 rounded-lg text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm"
                  placeholder="Search..."
                />
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider">
                        Found {searchResults.length} results
                      </div>
                      {searchResults.map((result) => {
                        const IconComponent = getSearchIcon(result.icon);
                        return (
                          <button
                            key={result.id}
                            onClick={() => handleSearchResultClick(result)}
                            className="w-full text-left p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200 border-b border-gray-50 last:border-b-0"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-0.5">
                                <div className="h-8 w-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                  <IconComponent className="h-4 w-4 text-blue-600" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-semibold text-gray-900 truncate">
                                    {result.title}
                                  </p>
                                  <div className="flex items-center text-xs text-gray-500 ml-2 flex-shrink-0">
                                    <span>{result.page}</span>
                                    <ChevronRight className="h-3 w-3 ml-1" />
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 truncate">
                                  {result.subtitle}
                                </p>
                                <p className="text-xs text-gray-500 truncate mt-1">
                                  {result.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                      {searchResults.length >= 20 && (
                        <div className="text-xs text-gray-500 px-3 py-2 text-center border-t">
                          Showing top 20 results. Be more specific to narrow down.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {showSearchResults && searchTerm.length >= 2 && searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50">
                    <div className="p-4 text-center text-gray-500">
                      <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No results found for "{searchTerm}"</p>
                      <p className="text-xs mt-1">Try searching for patients, medicines, supplies, or equipment</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Page content */}
        <main className={`flex-1 ${isMobile ? 'mt-0' : 'mt-16'} min-h-screen`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;