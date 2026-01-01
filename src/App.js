import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    order_id: '',
    container_id: '',
    customer_name: '',
    destination: '',
    status: '주문 접수'
  });

  const API_BASE_URL = 'http://localhost:8080/api';

  // 모든 주문 조회
  const fetchAllOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      const data = await response.json();
      setOrders(data || []);
    } catch (error) {
      console.error('주문 조회 실패:', error);
    }
  };

  // 특정 주문 조회
  const fetchOrderById = async () => {
    if (!orderId) {
      alert('주문 ID를 입력하세요');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/orders?order_id=${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrders([data]);
      } else {
        alert('주문을 찾을 수 없습니다');
      }
    } catch (error) {
      console.error('주문 조회 실패:', error);
    }
  };

  // 주문 생성
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('주문이 생성되었습니다');
        setFormData({ order_id: '', container_id: '', customer_name: '', destination: '', status: '주문 접수' });
        fetchAllOrders();
      } else {
        alert('주문 생성 실패');
      }
    } catch (error) {
      console.error('주문 생성 실패:', error);
    }
  };

  // 주문 상태 업데이트
  const handleUpdateOrder = async (order) => {
    const newStatus = prompt('새로운 상태를 입력하세요 (예: 배송 중, 배송 완료):', order.status);
    if (!newStatus) return;

    try {
      const updatedOrder = { ...order, status: newStatus };
      const response = await fetch(`${API_BASE_URL}/orders?order_id=${order.order_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder)
      });
      if (response.ok) {
        alert('주문 상태가 업데이트되었습니다');
        fetchAllOrders();
      }
    } catch (error) {
      console.error('주문 업데이트 실패:', error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="App">
      <h1>물류 주문 관리 시스템</h1>

      {/* 주문 조회 섹션 */}
      <section className="search-section">
        <h2>주문 조회</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="주문 ID 입력"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button onClick={fetchOrderById}>검색</button>
          <button onClick={fetchAllOrders}>전체 조회</button>
        </div>
      </section>

      {/* 주문 생성 섹션 */}
      <section className="create-section">
        <h2>주문 생성</h2>
        <form onSubmit={handleCreateOrder}>
          <input
            type="text"
            placeholder="주문 ID"
            value={formData.order_id}
            onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="컨테이너 ID"
            value={formData.container_id}
            onChange={(e) => setFormData({ ...formData, container_id: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="고객명"
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="배송지"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            required
          />
          <button type="submit">주문 생성</button>
        </form>
      </section>

      {/* 주문 목록 섹션 */}
      <section className="orders-section">
        <h2>주문 목록</h2>
        {orders && orders.length > 0 ? (
          <table className="orders-table">
            <thead>
              <tr>
                <th>주문 ID</th>
                <th>고객명</th>
                <th>컨테이너 ID</th>
                <th>배송지</th>
                <th>상태</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.container_id}</td>
                  <td>{order.destination}</td>
                  <td>{order.status}</td>
                  <td>
                    <button onClick={() => handleUpdateOrder(order)}>상태 변경</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>주문이 없습니다</p>
        )}
      </section>
    </div>
  );
}

export default App;

