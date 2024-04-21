'use client';
import react,{ useState,useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const metadata: Metadata = {
  title: "Next.js Form Layout | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};


const FormLayout = () => {

  const timeOptions = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [options, setOptions] = useState<Option[]>([]);

  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const handleStartTimeChange = (time) => {
    const formattedStartTime = format(new Date(`${format(selectedStartDate, 'yyyy-MM-dd')}T${time}:00.000Z`), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    setSelectedStartTime(formattedStartTime);
    console.log(`Selected start time: ${formattedStartTime}`);
  };

  const handleEndTimeChange = (time) => {
    const formattedEndTime = format(new Date(`${format(selectedEndDate, 'yyyy-MM-dd')}T${time}:00.000Z`), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    setSelectedEndTime(formattedEndTime);
    console.log(`Selected end time: ${formattedEndTime}`);
  };

  const reserveRoom = async () => {

    const token = Cookies.get('auth');
    const userData = Cookies.get('user');
    const user = JSON.parse(userData as string);

    const requestBody = {
      user: user._id, 
      room: selectedRoom,
      startTime: format(new Date(selectedStartTime), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      endTime: format(new Date(selectedEndTime), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
    };
  
    console.log('Request body:', requestBody);

    try {
      const response = await axios.post('http://localhost:4000/reservation/reserve', 
        {
          user: user._id, 
          room: selectedRoom,
          startTime: format(new Date(selectedStartTime), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
          endTime: format(new Date(selectedEndTime), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        }
      );
    
      console.log(response.data);
      console.log('selectedRoom:', selectedRoom);
      console.log('selectedStartTime:', selectedStartTime);
      console.log('selectedEndTime:', selectedEndTime);
    } catch (error) {
      console.error('Failed to reserve room', error);
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = Cookies.get('auth');
        const response = await axios.get('http://localhost:4000/room/rooms', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        const newOptions: Option[] = response.data.map((room: any) => ({
          id: room._id.$oid,
          value: room.room_number,
          text: room.room_number,
          selected: false,
        }));
  
        setOptions(newOptions);
        console.log(newOptions)
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
  
    fetchRooms();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Reservation" />
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Just fill in the form below:
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                
                <select value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)}>
                  {options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
                
                <DatePicker selected={selectedStartDate} onChange={date => setSelectedStartDate(date as Date)} />
                <select onChange={e => handleStartTimeChange(e.target.value)}>
                  {timeOptions.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <DatePicker selected={selectedEndDate} onChange={date => setSelectedEndDate(date as Date)} />
                <select onChange={e => handleEndTimeChange(e.target.value)}>
                  {timeOptions.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <button 
                  className="mt-6 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  onClick={reserveRoom}
                >
                  Reserve
                </button>
              </div>
            </form>
          </div>
        </div>
    </DefaultLayout>
  );
};

export default FormLayout;