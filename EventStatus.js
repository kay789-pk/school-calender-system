import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventStatus = ({ user }) => {
  const [statusSummary, setStatusSummary] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    status_note: ''
  });

  const statusLabels = {
    pending: 'รอดำเนินการ',
    in_progress: 'กำลังดำเนินการ',
    completed: 'ดำเนินการแล้ว',
    cancelled: 'ยกเลิก'
  };

  const statusColors = {
    pending: '#FF9800',
    in_progress: '#2196F3',
    completed: '#4CAF50',
    cancelled: '#F44336'
  };

  const eventTypes = {
    academic: 'กิจกรรมวิชาการ',
    student_activity: 'กิจกรรมนักเรียน',
    external: 'กิจกรรมภายนอก',
    meeting: 'ประชุม',
    exam: 'การสอบ',
    hr: 'กิจกรรมงานบุคคล',
    admin: 'กิจกรรมงานบริหารทั่วไป',
    policy_plan: 'กิจกรรมนโยบายและแผน'
  };

  useEffect(() => {
    fetchStatusSummary();
    fetchEventsByStatus(selectedStatus);
  }, [selectedStatus]);

  const fetchStatusSummary = async () => {
    try {
      const response = await axios.get('/api/events/status-summary');
      setStatusSummary(response.data);
    } catch (error) {
      console.error('Error fetching status summary:', error);
    }
  };

  const fetchEventsByStatus = async (status) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/events/status/${status}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await axios.put(`/api/events/${selectedEvent.id}/status`, statusUpdate);
      setShowModal(false);
      fetchStatusSummary();
      fetchEventsByStatus(selectedStatus);
      alert('อัปเดตสถานะเรียบร้อย');
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const openStatusModal = (event) => {
    setSelectedEvent(event);
    setStatusUpdate({
      status: event.status,
      status_note: event.status_note || ''
    });
    setShowModal(true);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusCount = (status) => {
    const item = statusSummary.find(s => s.status === status);
    return item ? item.count : 0;
  };

  return (
    <div>
      {/* Status Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        {Object.entries(statusLabels).map(([status, label]) => (
          <div
            key={status}
            style={{
              background: 'white',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              border: selectedStatus === status ? `3px solid ${statusColors[status]}` : '3px solid transparent',
              transition: 'all 0.3s'
            }}
            onClick={() => setSelectedStatus(status)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: statusColors[status],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                {getStatusCount(status)}
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#333', fontSize: '1.1rem' }}>{label}</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>กิจกรรม</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Events List */}
      <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ 
          background: statusColors[selectedStatus], 
          color: 'white', 
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0 }}>
            <i className="fas fa-tasks"></i> {statusLabels[selectedStatus]} ({events.length} รายการ)
          </h2>
          <button 
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            onClick={() => fetchEventsByStatus(selectedStatus)}
          >
            <i className="fas fa-sync-alt"></i> รีเฟรช
          </button>
        </div>
        
        <div style={{ padding: '20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
              <p>กำลังโหลด...</p>
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <i className="fas fa-inbox" style={{ fontSize: '48px', marginBottom: '20px' }}></i>
              <p>ไม่มีกิจกรรมในสถานะนี้</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {events.map(event => (
                <div
                  key={event.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    borderLeft: `5px solid ${statusColors[event.status]}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '1.2rem' }}>{event.title}</h3>
                      <span style={{
                        background: statusColors[event.status],
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        marginRight: '10px'
                      }}>
                        {statusLabels[event.status]}
                      </span>
                      <span style={{
                        background: '#e9ecef',
                        color: '#495057',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {eventTypes[event.event_type]}
                      </span>
                    </div>
                    
                    {user.role !== 'student' && (
                      <button
                        style={{
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '8px 15px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        onClick={() => openStatusModal(event)}
                      >
                        <i className="fas fa-edit"></i> อัปเดตสถานะ
                      </button>
                    )}
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', color: '#666' }}>
                    <div>
                      <i className="fas fa-clock"></i> <strong>วันเวลา:</strong><br/>
                      {formatDateTime(event.start_date)} - {formatDateTime(event.end_date)}
                    </div>
                    
                    {event.location && (
                      <div>
                        <i className="fas fa-map-marker-alt"></i> <strong>สถานที่:</strong><br/>
                        {event.location}
                      </div>
                    )}
                    
                    {event.responsible_person && (
                      <div>
                        <i className="fas fa-user-tie"></i> <strong>ผู้รับผิดชอบ:</strong><br/>
                        {event.responsible_person}
                      </div>
                    )}
                  </div>
                  
                  {event.status_note && (
                    <div style={{ 
                      marginTop: '15px', 
                      padding: '10px', 
                      background: '#f8f9fa', 
                      borderRadius: '5px',
                      borderLeft: '4px solid #007bff'
                    }}>
                      <strong><i className="fas fa-sticky-note"></i> หมายเหตุ:</strong><br/>
                      {event.status_note}
                    </div>
                  )}
                  
                  {event.status_updated_by_name && event.status_updated_at && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                      อัปเดตล่าสุดโดย: {event.status_updated_by_name} เมื่อ {formatDateTime(event.status_updated_at)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">อัปเดตสถานะกิจกรรม</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div style={{ padding: '20px 0' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>{selectedEvent.title}</h3>
                <p style={{ color: '#666', margin: 0 }}>{eventTypes[selectedEvent.event_type]}</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="status">สถานะ *</label>
                <select
                  id="status"
                  className="form-control"
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate({...statusUpdate, status: e.target.value})}
                  required
                >
                  {Object.entries(statusLabels).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="status_note">หมายเหตุ</label>
                <textarea
                  id="status_note"
                  className="form-control"
                  rows="4"
                  value={statusUpdate.status_note}
                  onChange={(e) => setStatusUpdate({...statusUpdate, status_note: e.target.value})}
                  placeholder="เพิ่มหมายเหตุเกี่ยวกับสถานะกิจกรรม (ถ้ามี)"
                />
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              justifyContent: 'flex-end', 
              paddingTop: '20px', 
              borderTop: '1px solid #eee' 
            }}>
              <button className="btn btn-primary" onClick={handleStatusUpdate}>
                <i className="fas fa-save"></i> บันทึก
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i> ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventStatus;