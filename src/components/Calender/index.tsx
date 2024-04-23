'use client'
import { useState, useEffect } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import { enUS } from 'date-fns/locale';

const CalendarComponent = () => {

  // get the reseravation data from the server
  // fetch the reservation data from the server
  // display the reservation data in the calendar
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState({});
  const [rooms, setRooms] = useState({});

  const locales = {
    'en-US': enUS,
  };
  
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  useEffect(() => {
    const fetchReservations = async () => {
      const token = Cookies.get('auth');
      const response = await axios.get('http://localhost:4000/reservation/reservations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      const reservationsWithISODate = response.data.map(reservation => {
        const start = new Date(reservation.start);
        const end = new Date(reservation.end);
    
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.warn(`Skipping reservation with invalid date: ${reservation.start}, ${reservation.end}`);
          return null;
        }
    
        return {
          ...reservation,
          start: start.toISOString(),
          end: end.toISOString(),
        };
      }).filter(Boolean);
    
      setReservations(reservationsWithISODate);
    
      const userPromises = reservationsWithISODate.map((reservation) =>
        axios.get(`http://localhost:4000/user/users/${reservation.user}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
    
      const userResponses = await Promise.all(userPromises);
      const usersById = userResponses.reduce((users, response) => {
        users[response.data._id] = response.data;
        return users;
      }, {});
    
      setUsers(usersById);
    };
  
    fetchReservations();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      const token = Cookies.get('auth');
      const response = await axios.get('http://localhost:4000/room/rooms', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const roomsById = response.data.reduce((rooms, room) => {
        rooms[room._id] = room;
        return rooms;
      }, {});
  
      setRooms(roomsById);
    };
  
    fetchRooms();
  }, []);

  const events = reservations.map(reservation => {
    console.log('----------------------------------------');
    console.log(reservation.user, users[reservation.user], reservation.start, reservation.end);
  
    if (!users[reservation.user] || !rooms[reservation.room]) {
      console.warn(`Skipping reservation with invalid user or room: ${reservation.user}, ${reservation.room}`);
      return null;
    }
  
    return {
      title: `Reservation for ${users[reservation.user].name} in room ${rooms[reservation.room].room_number}`,
      start: new Date(reservation.start),
      end: new Date(reservation.end),
    };
  }).filter(Boolean);
  

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Calendar" />

      {/* <!-- ====== Calendar Section Start ====== --> */}
      
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <BigCalendar
        localizer={localizer}
        events={events as object[]}
        style={{ height: 500 }}
      />
      </div>
      
    </div>
  );
};

export default CalendarComponent;
