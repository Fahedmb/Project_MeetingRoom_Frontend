'use client';
import { useState,useEffect } from "react";
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

  interface Option {
    id: string;
    value: string;
    text: string;
    selected: boolean;
  }

  const handleStartTimeChange = (time: string): void => {
    const formattedStartTime: string = format(
      new Date(`${format(selectedStartDate, 'yyyy-MM-dd')}T${time}:00.000Z`),
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    );
    setSelectedStartTime(formattedStartTime);
    console.log(`Selected start time: ${formattedStartTime}`);
  };

  const handleEndTimeChange = (time: string): void => {
    const formattedEndTime: string = format(
      new Date(`${format(selectedEndDate, 'yyyy-MM-dd')}T${time}:00.000Z`),
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    );
    setSelectedEndTime(formattedEndTime);
    console.log(`Selected end time: ${formattedEndTime}`);
  };


  // Reserve a room by sending a POST request to the server
  // send the id of the user, the id of the room, the startingtime and the endingtime
  const reserveRoom = async () => {

    const token = Cookies.get('auth');
    const userData = Cookies.get('user');
    const user = JSON.parse(userData as string);

    interface SelectedRoom {
      id: string;
      value: string;
      text: string;
      selected: boolean;
    }

    const requestBody = {
      user: user._id, 
      room: (selectedRoom as unknown as SelectedRoom).id,
      startTime: format(new Date(selectedStartTime), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      endTime: format(new Date(selectedEndTime), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
    };

    console.log('Request body:', requestBody);

    try {
      const response = await axios.post('http://localhost:4000/reservation/reserve', 
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          //timeout: 5000,
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

  // Fetch rooms from the server and populate the options list with them
  // console.log the selected room to see if it's being updated
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
        console.log('Rooms:', newOptions)

      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
  
    fetchRooms();
  }, []);

  useEffect(() => {
    console.log('selectedRoom:', selectedRoom);
  }, [selectedRoom]);

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
                
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Select the room:
                </label>
                <select 
                className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                value={selectedRoom} 
                onChange={e => setSelectedRoom(e.target.value)}
                >
                  {options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
                
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Select the starting day of your reservation:
                </label>
                <DatePicker 
                className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                selected={selectedStartDate} onChange={date => setSelectedStartDate(date as Date)} />
                
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Select the exact hour starting time of your reservation:
                </label>
                <select 
                className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                onChange={e => handleStartTimeChange(e.target.value)}>
                  {timeOptions.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Select the ending day of your reservation:
                </label>
                <DatePicker 
                className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                selected={selectedEndDate} onChange={date => setSelectedEndDate(date as Date)} />
                
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Select the exact hour ending time of your reservation:
                </label>
                <select 
                className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                onChange={e => handleEndTimeChange(e.target.value)}>
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