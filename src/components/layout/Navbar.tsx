
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">MotionSense</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-6">
                  <Link 
                    to="/dashboard" 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/collect" 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Collect Data
                  </Link>
                  <Link 
                    to="/predict" 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Predict Activity
                  </Link>
                  <Link 
                    to="/train" 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Train Model
                  </Link>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="hidden md:block">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                <Button onClick={() => navigate('/register')}>Register</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
