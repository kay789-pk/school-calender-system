import React from 'react';

const Header = ({ user, currentView, onViewChange, onLogout }) => {
  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'ผู้ดูแลระบบ';
      case 'teacher': return 'ครู';
      case 'student': return 'นักเรียน';
      default: return role;
    }
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">
                <i className="fas fa-school"></i>
              </div>
              <div className="school-info">
                <h1>โรงเรียนซับใหญ่วิทยาคม</h1>
                <p>ระบบปฏิทินงานและกิจกรรม</p>
              </div>
            </div>
            
            <div className="user-info">
              <div className="user-profile">
                <div className="user-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <div style={{ fontWeight: '500' }}>{user.full_name}</div>
                  <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>
                    {getRoleText(user.role)}
                  </div>
                </div>
              </div>
              <button className="logout-btn" onClick={onLogout}>
                <i className="fas fa-sign-out-alt"></i> ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="nav-tabs">
        <div className="container">
          <ul>
            <li>
              <button
                className={currentView === 'calendar' ? 'active' : ''}
                onClick={() => onViewChange('calendar')}
              >
                <i className="fas fa-calendar-alt"></i> ปฏิทิน
              </button>
            </li>
            
            {user.role !== 'student' && (
              <li>
                <button
                  className={currentView === 'add-event' ? 'active' : ''}
                  onClick={() => onViewChange('add-event')}
                >
                  <i className="fas fa-plus"></i> เพิ่มกิจกรรม
                </button>
              </li>
            )}
            
            <li>
              <button
                className={currentView === 'events' ? 'active' : ''}
                onClick={() => onViewChange('events')}
              >
                <i className="fas fa-list"></i> รายการกิจกรรม
              </button>
            </li>
            
            <li>
              <button
                className={currentView === 'status' ? 'active' : ''}
                onClick={() => onViewChange('status')}
              >
                <i className="fas fa-tasks"></i> รายงานสถานะ
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;