import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Header from './components/Header';
import Calendar from './components/Calendar';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import EventStatus from './components/EventStatus';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('calendar');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchEvents();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setEvents([]);
  };

  const handleEventCreated = () => {
    fetchEvents();
    setCurrentView('calendar');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        กำลังโหลด...
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Header 
        user={user} 
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      />
      
      <div className="container">
        <div className="main-content">
          {currentView === 'calendar' && (
            <Calendar 
              events={events} 
              user={user}
              onRefresh={fetchEvents}
            />
          )}
          
          {currentView === 'add-event' && user.role !== 'student' && (
            <EventForm 
              user={user}
              onEventCreated={handleEventCreated}
            />
          )}
          
          {currentView === 'events' && (
            <EventList 
              events={events}
              user={user}
              onRefresh={fetchEvents}
            />
          )}
          
          {currentView === 'status' && (
            <EventStatus 
              user={user}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;