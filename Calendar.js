import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendar = ({ events, user, onRefresh }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    target_group: ''
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

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

  useEffect(() => {
    filterEvents();
  }, [events, filters, currentDate]);

  const filterEvents = () => {
    let filtered = events.filter(event => {
      const eventDate = new Date(event.start_date);
      const isSameMonth = eventDate.getMonth() === currentDate.getMonth() && 
                         eventDate.getFullYear() === currentDate.getFullYear();
      
      if (!isSameMonth) return false;
      
      if (filters.type && event.event_type !== filters.type) return false;
      if (filters.target_group && event.target_group !== filters.target_group && event.target_group !== 'all') return false;
      
      return true;
    });
    
    setFilteredEvents(filtered);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonth.getDate() - i)
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: new Date(year, month, day)
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, day)
      });
    }
    
    return days;
  };

  const getEventsForDay = (date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.start_date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const exportToPDF = () => {
    // Simple export functionality - in real app, use jsPDF
    window.print();
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
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

  return (
    <div>
      {/* Filters */}
      <div className="filters">
        <div className="filters-row">
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
            <label>&nbsp;</label>
            <button className="btn btn-secondary" onClick={exportToPDF}>
              <i className="fas fa-file-pdf"></i> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="calendar-controls">
            <button className="calendar-nav-btn" onClick={() => navigateMonth(-1)}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="month-year">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button className="calendar-nav-btn" onClick={() => navigateMonth(1)}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <button className="calendar-nav-btn" onClick={onRefresh}>
            <i className="fas fa-sync-alt"></i> รีเฟรช
          </button>
        </div>

        <div className="calendar-grid">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {getDaysInMonth(currentDate).map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isToday(day.fullDate) ? 'today' : ''}`}
            >
              <div className="day-number">{day.date}</div>
              <div className="day-events">
                {getEventsForDay(day.fullDate).map(event => (
                  <div
                    key={event.id}
                    className={`event-item ${event.event_type}`}
                    title={`${event.title} - ${event.location || 'ไม่ระบุสถานที่'}`}
                    onClick={() => handleEventClick(event)}
                    style={{ cursor: 'pointer' }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ 
        marginTop: '20px', 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '15px' }}>สีประจำประเภทกิจกรรม</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {Object.entries(eventTypes).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className={`event-item ${key}`} style={{ minWidth: '20px', height: '20px' }}></div>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Event Detail Modal */}
      {showModal && selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">รายละเอียดกิจกรรม</h2>
              <button className="close-btn" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div style={{ padding: '20px 0' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#333', marginBottom: '10px', fontSize: '1.4rem' }}>
                  {selectedEvent.title}
                </h3>
                <span style={{
                  background: getEventColor(selectedEvent.event_type),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {eventTypes[selectedEvent.event_type]}
                </span>
              </div>
              
              {selectedEvent.description && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '8px',
                    color: '#4CAF50',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-align-left"></i>
                    <strong>รายละเอียด</strong>
                  </div>
                  <p style={{ 
                    marginTop: '5px', 
                    color: '#666', 
                    lineHeight: '1.6',
                    background: '#f8f9fa',
                    padding: '12px',
                    borderRadius: '5px',
                    border: '1px solid #e9ecef'
                  }}>
                    {selectedEvent.description}
                  </p>
                </div>
              )}
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '8px',
                  color: '#4CAF50',
                  fontWeight: '600'
                }}>
                  <i className="fas fa-clock"></i>
                  <strong>วันเวลา</strong>
                </div>
                <div style={{ 
                  marginTop: '5px', 
                  color: '#666',
                  background: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '5px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ marginBottom: '5px' }}>
                    <strong>เริ่ม:</strong> {formatDateTime(selectedEvent.start_date)}
                  </div>
                  <div>
                    <strong>สิ้นสุด:</strong> {formatDateTime(selectedEvent.end_date)}
                  </div>
                </div>
              </div>
              
              {selectedEvent.location && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '8px',
                    color: '#4CAF50',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-map-marker-alt"></i>
                    <strong>สถานที่</strong>
                  </div>
                  <p style={{ 
                    marginTop: '5px', 
                    color: '#666',
                    background: '#f8f9fa',
                    padding: '12px',
                    borderRadius: '5px',
                    border: '1px solid #e9ecef'
                  }}>
                    {selectedEvent.location}
                  </p>
                </div>
              )}
              
              {selectedEvent.responsible_person && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '8px',
                    color: '#4CAF50',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-user-tie"></i>
                    <strong>ผู้รับผิดชอบ</strong>
                  </div>
                  <p style={{ 
                    marginTop: '5px', 
                    color: '#666',
                    background: '#f8f9fa',
                    padding: '12px',
                    borderRadius: '5px',
                    border: '1px solid #e9ecef'
                  }}>
                    {selectedEvent.responsible_person}
                  </p>
                </div>
              )}
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '8px',
                  color: '#4CAF50',
                  fontWeight: '600'
                }}>
                  <i className="fas fa-users"></i>
                  <strong>กลุ่มเป้าหมาย</strong>
                </div>
                <p style={{ 
                  marginTop: '5px', 
                  color: '#666',
                  background: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '5px',
                  border: '1px solid #e9ecef'
                }}>
                  {targetGroups[selectedEvent.target_group]}
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              justifyContent: 'flex-end', 
              paddingTop: '20px', 
              borderTop: '1px solid #eee' 
            }}>
              <button className="btn btn-secondary" onClick={closeModal}>
                <i className="fas fa-times"></i> ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function for event colors
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

export default Calendar;