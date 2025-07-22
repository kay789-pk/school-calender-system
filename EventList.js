import React, { useState } from 'react';
import axios from 'axios';

const EventList = ({ events, user, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    target_group: '',
    month: ''
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

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

  const targetGroups = {
    admin: 'ผู้บริหาร',
    teacher: 'ครู',
    student: 'นักเรียน',
    all: 'ทุกคน'
  };

  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filters.type || event.event_type === filters.type;
    const matchesGroup = !filters.target_group || event.target_group === filters.target_group;
    
    let matchesMonth = true;
    if (filters.month) {
      const eventDate = new Date(event.start_date);
      matchesMonth = eventDate.getMonth() === parseInt(filters.month);
    }
    
    return matchesSearch && matchesType && matchesGroup && matchesMonth;
  });

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

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setEditData(event);
    setShowModal(true);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/events/${selectedEvent.id}`, editData);
      setShowModal(false);
      setEditMode(false);
      onRefresh();
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการแก้ไข');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('คุณต้องการลบกิจกรรมนี้หรือไม่?')) {
      try {
        await axios.delete(`/api/events/${selectedEvent.id}`);
        setShowModal(false);
        onRefresh();
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedEvent(null);
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="filters">
        <div className="filters-row">
          <div className="form-group">
            <label>ค้นหา</label>
            <input
              type="text"
              className="form-control"
              placeholder="ค้นหาชื่อกิจกรรม, รายละเอียด, หรือสถานที่"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>ประเภทกิจกรรม</label>
            <select
              className="form-control"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">ทั้งหมด</option>
              {Object.entries(eventTypes).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>กลุ่มเป้าหมาย</label>
            <select
              className="form-control"
              value={filters.target_group}
              onChange={(e) => setFilters({...filters, target_group: e.target.value})}
            >
              <option value="">ทั้งหมด</option>
              {Object.entries(targetGroups).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>เดือน</label>
            <select
              className="form-control"
              value={filters.month}
              onChange={(e) => setFilters({...filters, month: e.target.value})}
            >
              <option value="">ทั้งหมด</option>
              {monthNames.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ background: '#4CAF50', color: 'white', padding: '20px' }}>
          <h2 style={{ margin: 0 }}>
            <i className="fas fa-list"></i> รายการกิจกรรม ({filteredEvents.length} รายการ)
          </h2>
        </div>
        
        <div style={{ padding: '20px' }}>
          {filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <i className="fas fa-calendar-times" style={{ fontSize: '48px', marginBottom: '20px' }}></i>
              <p>ไม่พบกิจกรรมที่ตรงกับเงื่อนไขการค้นหา</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    borderLeft: `5px solid ${getEventColor(event.event_type)}`
                  }}
                  onClick={() => handleEventClick(event)}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: '#333', fontSize: '1.2rem' }}>{event.title}</h3>
                    <span style={{
                      background: getEventColor(event.event_type),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {eventTypes[event.event_type]}
                    </span>
                  </div>
                  
                  <div style={{ color: '#666', marginBottom: '10px' }}>
                    <i className="fas fa-clock"></i> {formatDateTime(event.start_date)} - {formatDateTime(event.end_date)}
                  </div>
                  
                  {event.location && (
                    <div style={{ color: '#666', marginBottom: '10px' }}>
                      <i className="fas fa-map-marker-alt"></i> {event.location}
                    </div>
                  )}
                  
                  {event.responsible_person && (
                    <div style={{ color: '#666', marginBottom: '10px' }}>
                      <i className="fas fa-user"></i> {event.responsible_person}
                    </div>
                  )}
                  
                  <div style={{ color: '#666' }}>
                    <i className="fas fa-users"></i> {targetGroups[event.target_group]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editMode ? 'แก้ไขกิจกรรม' : 'รายละเอียดกิจกรรม'}
              </h2>
              <button className="close-btn" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div style={{ padding: '20px 0' }}>
              {editMode ? (
                <div>
                  <div className="form-group">
                    <label>ชื่อกิจกรรม</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.title}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>รายละเอียด</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={editData.description || ''}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>วันเวลาเริ่มต้น</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={editData.start_date?.slice(0, 16)}
                        onChange={(e) => setEditData({...editData, start_date: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>วันเวลาสิ้นสุด</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={editData.end_date?.slice(0, 16)}
                        onChange={(e) => setEditData({...editData, end_date: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>สถานที่</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.location || ''}
                        onChange={(e) => setEditData({...editData, location: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>ผู้รับผิดชอบ</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.responsible_person || ''}
                        onChange={(e) => setEditData({...editData, responsible_person: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>ประเภทกิจกรรม</label>
                      <select
                        className="form-control"
                        value={editData.event_type}
                        onChange={(e) => setEditData({...editData, event_type: e.target.value})}
                      >
                        {Object.entries(eventTypes).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>กลุ่มเป้าหมาย</label>
                      <select
                        className="form-control"
                        value={editData.target_group}
                        onChange={(e) => setEditData({...editData, target_group: e.target.value})}
                      >
                        {Object.entries(targetGroups).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ color: '#333', marginBottom: '10px' }}>{selectedEvent.title}</h3>
                    <span style={{
                      background: getEventColor(selectedEvent.event_type),
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}>
                      {eventTypes[selectedEvent.event_type]}
                    </span>
                  </div>
                  
                  {selectedEvent.description && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong>รายละเอียด:</strong>
                      <p style={{ marginTop: '5px', color: '#666' }}>{selectedEvent.description}</p>
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '15px' }}>
                    <strong>วันเวลา:</strong>
                    <p style={{ marginTop: '5px', color: '#666' }}>
                      {formatDateTime(selectedEvent.start_date)} - {formatDateTime(selectedEvent.end_date)}
                    </p>
                  </div>
                  
                  {selectedEvent.location && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong>สถานที่:</strong>
                      <p style={{ marginTop: '5px', color: '#666' }}>{selectedEvent.location}</p>
                    </div>
                  )}
                  
                  {selectedEvent.responsible_person && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong>ผู้รับผิดชอบ:</strong>
                      <p style={{ marginTop: '5px', color: '#666' }}>{selectedEvent.responsible_person}</p>
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '15px' }}>
                    <strong>กลุ่มเป้าหมาย:</strong>
                    <p style={{ marginTop: '5px', color: '#666' }}>{targetGroups[selectedEvent.target_group]}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              {editMode ? (
                <>
                  <button className="btn btn-primary" onClick={handleSave}>
                    บันทึก
                  </button>
                  <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
                    ยกเลิก
                  </button>
                </>
              ) : (
                <>
                  {user.role !== 'student' && (
                    <button className="btn btn-primary" onClick={handleEdit}>
                      <i className="fas fa-edit"></i> แก้ไข
                    </button>
                  )}
                  {user.role === 'admin' && (
                    <button className="btn btn-danger" onClick={handleDelete}>
                      <i className="fas fa-trash"></i> ลบ
                    </button>
                  )}
                  <button className="btn btn-secondary" onClick={closeModal}>
                    ปิด
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getEventColor = (type) => {
  const colors = {
    academic: '#2196F3',
    student_activity: '#FF9800',
    external: '#9C27B0',
    meeting: '#607D8B',
    exam: '#F44336',
    hr: '#795548',
    admin: '#009688',
    policy_plan: '#673AB7'
  };
  return colors[type] || '#4CAF50';
};

export default EventList;