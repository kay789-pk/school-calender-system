import React, { useState } from 'react';
import axios from 'axios';

const EventForm = ({ user, onEventCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    responsible_person: '',
    event_type: 'academic',
    target_group: 'all'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate dates
    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      setError('วันที่เริ่มต้นต้องไม่เกินวันที่สิ้นสุด');
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/events', formData);
      setSuccess('เพิ่มกิจกรรมเรียบร้อยแล้ว');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        responsible_person: '',
        event_type: 'academic',
        target_group: 'all'
      });
      
      setTimeout(() => {
        onEventCreated();
      }, 1500);
      
    } catch (error) {
      setError(error.response?.data?.error || 'เกิดข้อผิดพลาดในการเพิ่มกิจกรรม');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ marginBottom: '30px', color: '#333' }}>
        <i className="fas fa-plus-circle"></i> เพิ่มกิจกรรมใหม่
      </h2>

      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '12px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: '#e8f5e8',
          color: '#2e7d32',
          padding: '12px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">ชื่อกิจกรรม *</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="กรอกชื่อกิจกรรม"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">รายละเอียด</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="กรอกรายละเอียดกิจกรรม"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start_date">วันเวลาเริ่มต้น *</label>
            <input
              type="datetime-local"
              id="start_date"
              name="start_date"
              className="form-control"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_date">วันเวลาสิ้นสุด *</label>
            <input
              type="datetime-local"
              id="end_date"
              name="end_date"
              className="form-control"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">สถานที่</label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
              placeholder="กรอกสถานที่จัดกิจกรรม"
            />
          </div>

          <div className="form-group">
            <label htmlFor="responsible_person">ผู้รับผิดชอบ</label>
            <input
              type="text"
              id="responsible_person"
              name="responsible_person"
              className="form-control"
              value={formData.responsible_person}
              onChange={handleChange}
              placeholder="กรอกชื่อผู้รับผิดชอบ"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="event_type">ประเภทกิจกรรม *</label>
            <select
              id="event_type"
              name="event_type"
              className="form-control"
              value={formData.event_type}
              onChange={handleChange}
              required
            >
              {Object.entries(eventTypes).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="target_group">กลุ่มเป้าหมาย *</label>
            <select
              id="target_group"
              name="target_group"
              className="form-control"
              value={formData.target_group}
              onChange={handleChange}
              required
            >
              {Object.entries(targetGroups).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'กำลังบันทึก...' : 'บันทึกกิจกรรม'}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setFormData({
              title: '',
              description: '',
              start_date: '',
              end_date: '',
              location: '',
              responsible_person: '',
              event_type: 'academic',
              target_group: 'all'
            })}
          >
            ล้างข้อมูล
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;