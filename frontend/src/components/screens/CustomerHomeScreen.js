import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

function CustomerHomeScreen() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customerTier, setCustomerTier] = useState(null);
  const [swipedOrderId, setSwipedOrderId] = useState(null);

  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = async () => {
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);

    try {
    const response = await axios.get(`http://localhost:8080/api/orders?customerId=${user.id}`);
    setOrders(response.data); // 받아온 데이터를 상태에 저장
    
    // 등급 계산 (주문 개수 기반)
    const tier = calculateTier(response.data.length);
    setCustomerTier(tier);
    } catch (error) {
        console.error("Failed to load orders", error);
    }
  };

  const calculateTier = (orderCount) => {
    if (orderCount >= 20) {
      return { name: 'Platinum', discountRate: 20, icon: '💎' };
    } else if (orderCount >= 15) {
      return { name: 'Gold', discountRate: 15, icon: '🥇' };
    } else if (orderCount >= 10) {
      return { name: 'Silver', discountRate: 10, icon: '🥈' };
    } else if (orderCount >= 5) {
      return { name: 'Bronze', discountRate: 5, icon: '🥉' };
    } else {
      return { name: 'Regular', discountRate: 0, icon: '👤' };
    }
  };

  const handleDeleteOrder = async (orderId) => {
    // 1. 사용자에게 진짜 지울 건지 한 번 물어보는 게 국룰 (UX)
    if (!window.confirm("Are you sure you want to delete this order?")) {
        setSwipedOrderId(null); // 취소하면 스와이프 상태만 원복
        return;
    }

    try {
        // 2. 백엔드에 삭제 요청 전송 (DELETE)
        await axios.delete(`http://localhost:8080/api/orders/${orderId}`);

        // 3. 성공하면 프론트엔드 화면 목록에서도 제거 (새로고침 없이 즉시 반영)
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        
        // 부가적인 상태 초기화
        setSwipedOrderId(null);
        alert('Order deleted successfully!');

    } catch (error) {
        console.error("Failed to delete order", error);
        alert("Failed to delete order. Please try again.");
    }
  };

  const dinners = [
    {
      name: 'Valentine Dinner',
      description: 'Wine, steak, heart decoration, napkin',
      price: '$79.99 - $129.99',
      icon: '💕',
      id: 'valentine'
    },
    {
      name: 'French Dinner',
      description: 'Coffee, wine, salad, steak',
      price: '$69.99 - $119.99',
      icon: '🇫🇷',
      id: 'french'
    },
    {
      name: 'English Dinner',
      description: 'Scrambled egg, bacon, bread, steak',
      price: '$59.99 - $109.99',
      icon: '🇬🇧',
      id: 'english'
    },
    {
      name: 'Champagne Feast',
      description: 'Champagne, baguette, coffee, wine, steak (2 people)',
      price: '$169.99 - $199.99',
      icon: '🥂',
      id: 'champagne'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  // dinnerType 코드를 받아서 예쁜 이름으로 바꿔주는 함수
  const getDinnerName = (type) => {
    const names = {
      'valentine': 'Valentine Dinner 💕',
      'french': 'French Dinner 🇫🇷',
      'english': 'English Dinner 🇬🇧',
      'champagne': 'Champagne Feast 🥂'
    };
    // 목록에 없으면(예: 오타) 그냥 원래 type을 보여주거나 기본값 설정
    return names[type] || 'Delicious Dinner 🍽️';
  };

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      overflow: 'auto'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          marginTop: '20px'
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginBottom: '5px'
            }}>
              Welcome, {currentUser?.name}! 👋
            </h1>
            <p style={{
              fontSize: '12px',
              color: '#b0b0b0'
            }}>
              What would you like to order?
            </p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '32px',
              cursor: 'pointer'
            }}
          >
            👤
          </button>
        </div>

        {/* 고객 등급 */}
        {customerTier && (
          <div style={{
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px',
            borderLeft: 
              customerTier.name === 'Platinum' ? '4px solid #E5E4E2' :
              customerTier.name === 'Gold' ? '4px solid #FFD700' :
              customerTier.name === 'Silver' ? '4px solid #C0C0C0' :
              customerTier.name === 'Bronze' ? '4px solid #CD7F32' :
              '4px solid #FFC107'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
              <span style={{ fontSize: '48px' }}>{customerTier.icon}</span>
              <div>
                <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '3px' }}>
                  Your Tier
                </p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFFFFF' }}>
                  {customerTier.name}
                </p>
              </div>
            </div>

            {customerTier.discountRate > 0 && (
              <div style={{
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107' }}>
                  {customerTier.discountRate}% OFF
                </p>
              </div>
            )}

            <p style={{ fontSize: '11px', color: '#b0b0b0', marginTop: '12px' }}>
              📊 Total Orders: {currentUser?.totalOrders || 0}
            </p>
          </div>
        )}

        {/* 할인 등급 설명 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '15px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '12px', fontWeight: 'bold' }}>
            🎁 Loyalty Tiers:
          </p>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#CD7F32' }}>🥉 Bronze</span>
            <span style={{ fontSize: '12px', color: '#b0b0b0' }}>5+ orders</span>
            <span style={{ fontSize: '12px', color: '#FFC107', fontWeight: 'bold' }}>5% OFF</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#C0C0C0' }}>🥈 Silver</span>
            <span style={{ fontSize: '12px', color: '#b0b0b0' }}>10+ orders</span>
            <span style={{ fontSize: '12px', color: '#FFC107', fontWeight: 'bold' }}>10% OFF</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#FFD700' }}>🥇 Gold</span>
            <span style={{ fontSize: '12px', color: '#b0b0b0' }}>15+ orders</span>
            <span style={{ fontSize: '12px', color: '#FFC107', fontWeight: 'bold' }}>15% OFF</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#E5E4E2' }}>💎 Platinum</span>
            <span style={{ fontSize: '12px', color: '#b0b0b0' }}>20+ orders</span>
            <span style={{ fontSize: '12px', color: '#FFC107', fontWeight: 'bold' }}>20% OFF</span>
          </div>
        </div>

        {/* 고객 정보 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '15px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '8px' }}>
            📍 Delivery Address:
          </p>
          <p style={{ fontSize: '13px', color: '#FFFFFF', marginBottom: '10px' }}>
            {currentUser?.address}
          </p>
          <p style={{ fontSize: '12px', color: '#b0b0b0' }}>
            📞 {currentUser?.phoneNumber}
          </p>
        </div>

        {/* Voice Order Card */}
        <div
          onClick={() => navigate('/voice-order')}
          style={{
            backgroundColor: '#FFC107',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '20px',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎤</div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: '5px'
          }}>
            Voice Order
          </h2>
          <p style={{
            fontSize: '13px',
            color: '#333333'
          }}>
            Say what you want to order
          </p>
        </div>

        {/* Popular Dinners */}
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '15px',
          marginTop: '20px'
        }}>
          Popular Dinners
        </h2>

        {dinners.map((dinner, index) => (
          <div
            key={index}
            onClick={() => navigate(`/menu-details/${dinner.id}`)}
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '15px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: '0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a3a3a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
          >
            <div style={{ display: 'flex', gap: '15px', flex: 1 }}>
              <div style={{ fontSize: '50px' }}>{dinner.icon}</div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  marginBottom: '5px'
                }}>
                  {dinner.name}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#b0b0b0'
                }}>
                  {dinner.description}
                </p>
              </div>
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#FFC107'
            }}>
              {dinner.price}
            </div>
          </div>
        ))}

        {/* Previous Orders */}
        {orders.length > 0 ? (
          <>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginBottom: '15px',
              marginTop: '30px'
            }}>
              Your Previous Orders ({orders.length})
            </h2>

            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  position: 'relative',
                  marginBottom: '15px'
                }}
              >
                {/* 배경 (삭제 버튼) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: '#FF6B6B',
                    borderRadius: '15px',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '20px'
                  }}
                >
                  <span style={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    Swipe to Delete
                  </span>
                </div>

                {/* 주문 카드 */}
                <div
                  style={{
                    backgroundColor: '#2a2a2a',
                    borderRadius: '15px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: '0.2s',
                    transform: swipedOrderId === order.id ? 'translateX(-80px)' : 'translateX(0)',
                    position: 'relative',
                    zIndex: 10
                  }}
                  onMouseLeave={() => setSwipedOrderId(null)}
                >
                  {/* 삭제 버튼 (마우스 호버 시) */}
                  {swipedOrderId === order.id && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: '-80px',
                        backgroundColor: '#FF6B6B',
                        borderRadius: '0 15px 15px 0',
                        width: '80px',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <span style={{
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        textAlign: 'center'
                      }}>
                        Delete
                      </span>
                    </div>
                  )}

                  <div style={{ marginBottom: '12px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#FFFFFF',
                      marginBottom: '5px'
                    }}>
                      {getDinnerName(order.dinnerName)}
                    </h3>
                    <p style={{
                      fontSize: '12px',
                      color: '#b0b0b0',
                      marginBottom: '8px'
                    }}>
                      📅 {new Date(order.orderTime).toLocaleString()}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #3a3a3a',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#b0b0b0', marginBottom: '3px' }}>
                        Total Price
                      </p>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#FFC107' }}>
                        ${order.totalPrice}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '11px', color: '#b0b0b0', marginBottom: '3px' }}>
                        Delivery Time
                      </p>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#FFFFFF' }}>
                        {order.deliveryTime}
                      </p>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '11px',
                    color: '#b0b0b0',
                    marginBottom: '12px'
                  }}>
                    📍 {order.deliveryAddress}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <button
                      onClick={() => navigate(`/order-details/${order.id}`)}
                      style={{
                        flex: 1,
                        backgroundColor: '#FFC107',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px',
                        color: '#000000',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => setSwipedOrderId(swipedOrderId === order.id ? null : order.id)}
                      style={{
                        width: '40px',
                        backgroundColor: '#FF6B6B',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={{
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '40px 20px',
            textAlign: 'center',
            marginTop: '30px',
            marginBottom: '20px'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '10px' }}>📋</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '5px' }}>
              No Orders Yet
            </p>
            <p style={{ fontSize: '12px', color: '#b0b0b0' }}>
              Start by ordering your first dinner!
            </p>
          </div>
        )}

        {/* Logout 버튼 */}
        <button
          onClick={handleLogout}
          className="btn-secondary"
          style={{
            marginTop: '40px',
            marginBottom: '20px'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default CustomerHomeScreen;