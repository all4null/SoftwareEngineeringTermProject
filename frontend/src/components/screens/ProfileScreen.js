import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

function ProfileScreen() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customerTier, setCustomerTier] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadCustomerData();
    }, []);

    const loadCustomerData = async () => {
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);

    try {
    // 고객의 모든 주문 불러오기, 백엔드의 OrderListResponseDTO 사용
    const response = await axios.get(`http://localhost:8080/api/orders?customerId=${user.id}`);
    setOrders(response.data); // 받아온 데이터를 상태에 저장
    
    // 고객 등급 정보 불러오기
    const customerTierRes = await axios.get(`http://localhost:8080/api/customers/${user.id}`);
    const customerTierData = customerTierRes.data;
    setCustomerTier({
        name: customerTierData.tierName,       // 예: "GOLD"
        discountRate: customerTierData.discountRate, // 예: 15
        icon: customerTierData.tierIcon        // 예: "🥇"
      });
    

    // // 등급 계산 (주문 개수 기반)
    // const tier = calculateTier(response.data.length);
    // setCustomerTier(tier);
    // } catch (error) {
    //     console.error("Failed to load orders", error);
    // }
  } catch (error) {
      console.error("Failed to load customer data", error);
    }
};

  const handleSaveProfile = () => {
    // 고객 정보 업데이트
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const updatedCustomers = customers.map(c =>
      c.id === currentUser.id ? { ...c, ...editData } : c
    );
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, ...editData }));
    
    setCurrentUser({ ...currentUser, ...editData });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      overflow: 'auto'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {/* 뒤로 가기 */}
        <button
          onClick={() => navigate('/customer-home')}
          style={{
            background: 'none',
            border: 'none',
            color: '#b0b0b0',
            fontSize: '20px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Back
        </button>

        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          My Profile
        </h1>

        {/* 고객 등급 카드 */}
        {customerTier && (
          <div style={{
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center',
            borderLeft: 
              customerTier.name === 'Platinum' ? '4px solid #E5E4E2' :
              customerTier.name === 'Gold' ? '4px solid #FFD700' :
              customerTier.name === 'Silver' ? '4px solid #C0C0C0' :
              customerTier.name === 'Bronze' ? '4px solid #CD7F32' :
              '4px solid #FFC107'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '10px' }}>
              {customerTier.icon}
            </p>
            <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '3px' }}>
              Current Tier
            </p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '10px' }}>
              {customerTier.name}
            </p>
            {customerTier.discountRate > 0 && (
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFC107' }}>
                {customerTier.discountRate}% Discount
              </p>
            )}
          </div>
        )}

        {/* 통계 */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div style={{
            flex: 1,
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '5px' }}>
              Total Orders
            </p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107' }}>
              {orders.length}
            </p>
          </div>

          <div style={{
            flex: 1,
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '5px' }}>
              Member Since
            </p>
            <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFFFFF' }}>
              {currentUser && new Date(currentUser.registeredAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* 개인정보 섹션 */}
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '15px'
        }}>
          Personal Information
        </h2>

        {!isEditing ? (
          // 보기 모드
          <>
            <div style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '11px', color: '#b0b0b0', marginBottom: '3px' }}>
                  Full Name
                </p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }}>
                  {currentUser?.name}
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '11px', color: '#b0b0b0', marginBottom: '3px' }}>
                  Email
                </p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }}>
                  {currentUser?.email}
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '11px', color: '#b0b0b0', marginBottom: '3px' }}>
                  Phone Number
                </p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }}>
                  {currentUser?.phoneNumber}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '11px', color: '#b0b0b0', marginBottom: '3px' }}>
                  Address
                </p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }}>
                  {currentUser?.address}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
              style={{ marginBottom: '15px' }}
            >
              Edit Profile
            </button>
          </>
        ) : (
          // 수정 모드
          <>
            <div style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '3px' }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={editData.name || ''}
                onChange={handleInputChange}
                className="input-field"
                style={{ marginBottom: '15px' }}
              />

              <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '3px' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editData.email || ''}
                onChange={handleInputChange}
                className="input-field"
                style={{ marginBottom: '15px' }}
              />

              <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '3px' }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={editData.phone || ''}
                onChange={handleInputChange}
                className="input-field"
                style={{ marginBottom: '15px' }}
              />

              <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '3px' }}>
                Address
              </label>
              <input
                type="text"
                name="address"
                value={editData.address || ''}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="btn-primary"
              style={{ marginBottom: '15px' }}
            >
              Save Changes
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileScreen;