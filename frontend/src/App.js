import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

// 화면들을 임포트
import LoginScreen from './components/screens/LoginScreen';
import StaffLoginScreen from './components/screens/StaffLoginScreen';
import DashboardScreen from './components/screens/DashboardScreen';
import OnboardingScreen from './components/screens/OnboardingScreen';
import StaffOnboardingScreen from './components/screens/StaffOnboardingScreen';
import CustomerHomeScreen from './components/screens/CustomerHomeScreen';
import StaffHomeScreen from './components/screens/StaffHomeScreen';
import VoiceOrderScreen from './components/screens/VoiceOrderScreen';
import MenuDetailsScreen from './components/screens/MenuDetailsScreen';
import OrderDetailsScreen from './components/screens/OrderDetailsScreen';
import StaffOrdersScreen from './components/screens/StaffOrdersScreen';
import StaffInventoryScreen from './components/screens/StaffInventoryScreen';
//import StaffDeliveryScreen from './components/screens/StaffDeliveryScreen';
import StaffTeamScreen from './components/screens/StaffTeamScreen';
//import StaffAnalyticsScreen from './components/screens/StaffAnalyticsScreen';
import StaffLiquorScreen from './components/screens/StaffLiquorScreen';
import OrderCustomizationScreen from './components/screens/OrderCustomizationScreen';
import SignupScreen from './components/screens/SignupScreen';
import ProfileScreen from './components/screens/ProfileScreen';

// 역할 선택 화면 - 디자인 개선 버전
function RoleSelectionScreen() {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'auto'
    }}>
      <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        
        {/* Welcome Text */}
        <p style={{
          fontSize: '16px',
          color: '#FFC107',
          marginBottom: '20px',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}>
          WELCOME TO
        </p>

        {/* Mr. Daebak Logo - 더 크게 */}
        <h1 style={{
          fontSize: '56px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '10px',
          letterSpacing: '2px'
        }}>
          Mr. Daebak
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '18px',
          color: '#b0b0b0',
          marginBottom: '60px',
          letterSpacing: '1px'
        }}>
          LUXURY DINNER SERVICE
        </p>

        {/* Customer Section - 더 prominent하게 */}
        <div style={{
          marginBottom: '50px'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#b0b0b0',
            marginBottom: '20px',
            fontWeight: 'bold'
          }}>
            ORDER LUXURY DINNERS
          </p>

          {/* Get Started Button with Arrow */}
          <button
            onClick={() => navigate('/customer-login')}
            style={{
              width: '100%',
              backgroundColor: '#FFC107',
              border: 'none',
              borderRadius: '15px',
              padding: '20px 40px',
              color: '#000000',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 24px rgba(255, 193, 7, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFD54F';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 193, 7, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFC107';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 193, 7, 0.3)';
            }}
          >
            <span>GET STARTED</span>
            <span style={{ fontSize: '24px' }}>→</span>
          </button>

          <p style={{
            fontSize: '12px',
            color: '#b0b0b0',
            marginTop: '15px'
          }}>
            Order delicious themed dinners delivered to your home
          </p>
        </div>

        {/* Staff Section - 더 작고 덜 prominent하게 */}
        <div style={{
          borderTop: '1px solid #3a3a3a',
          paddingTop: '40px'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#888888',
            marginBottom: '15px',
            fontWeight: 'bold'
          }}>
            STAFF ACCESS
          </p>

          <button
            onClick={() => navigate('/staff-login')}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: '1px solid #444444',
              borderRadius: '10px',
              padding: '15px 30px',
              color: '#888888',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#666666';
              e.currentTarget.style.color = '#b0b0b0';
              e.currentTarget.style.backgroundColor = '#2a2a2a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#444444';
              e.currentTarget.style.color = '#888888';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span>🏢 Staff Login</span>
          </button>

          <p style={{
            fontSize: '11px',
            color: '#666666',
            marginTop: '10px'
          }}>
            Manage orders and restaurant operations
          </p>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '60px',
          paddingTop: '30px',
          borderTop: '1px solid #3a3a3a'
        }}>
          <p style={{
            fontSize: '11px',
            color: '#555555'
          }}>
            © 2025 Mr. Daebak. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedRole, setSelectedRole] = useState('');

  return (
    <Router>
      <Routes>
        {/* 홈 화면 (역할 선택) */}
        <Route path="/" element={<RoleSelectionScreen />} />

        {/* 로그인 화면들 */}
        <Route path="/customer-login" element={<LoginScreen setSelectedRole={() => setSelectedRole('customer')} />} />
        <Route path="/staff-login" element={<StaffLoginScreen setSelectedRole={() => setSelectedRole('staff')} />} />

        {/* 대시보드 */}
        <Route path="/dashboard" element={<DashboardScreen role={selectedRole} />} />
        
        {/* Onboarding 화면들 */}
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/staff-onboarding" element={<StaffOnboardingScreen />} />

        {/* Home 화면들 */}
        <Route path="/customer-home" element={<CustomerHomeScreen />} />
        <Route path="/staff-home" element={<StaffHomeScreen />} />

        {/* Customer 상세 화면들 */}
        <Route path="/voice-order" element={<VoiceOrderScreen />} />
        <Route path="/menu-details/:dinnerType" element={<MenuDetailsScreen />} />
        <Route path="/order-details/:orderId" element={<OrderDetailsScreen />} />

        {/* Staff 상세 화면들 */}
        <Route path="/staff-orders" element={<StaffOrdersScreen />} />
        <Route path="/staff-inventory" element={<StaffInventoryScreen />} />
        {/*<Route path="/staff-delivery" element={<StaffDeliveryScreen />} />*/}
        <Route path="/staff-team" element={<StaffTeamScreen />} />
        {/*<Route path="/staff-analytics" element={<StaffAnalyticsScreen />} />*/}
        <Route path="/staff-liquor" element={<StaffLiquorScreen />} />
        <Route path="/customize-order/:dinnerType" element={<OrderCustomizationScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </Router>
  );
}

export default App;