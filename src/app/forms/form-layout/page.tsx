'use client';
import { useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DatePickerOne from '@/components/FormElements/DatePicker/DatePickerOne';
import DatePickerStart from '@/components/FormElements/DatePicker/DatePickerStart';
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";
import Link from "next/link";
import MultiSelect from "@/components/FormElements/MultiSelect";
import MultiSelectStart from "@/components/FormElements/MultiSelectStart";
import MultiSelectRoom from "@/components/FormElements/MultiSelectRoom";

const metadata: Metadata = {
  title: "Next.js Form Layout | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const FormLayout = () => {

  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');

  const getSelectedValues = () => {
    const room = Option.find(option => option.selected)?.value;
    setSelectedRoom(room);
  
//////////////////
//todo: fix this
//take the selected values from the form and set them to the state
//then use those values to make a post request to the server
//to reserve the room
//MOTT BT3AB
//////////////////

    const startTime = `${DatePickerStart.value}T${MultiSelectStart.value}:00.000Z`;
    const endTime = `${DatePickerOne().value}T${MultiSelect().value}:00.000Z`;
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
  };

  const reserveRoom = async () => {
    const token = Cookies.get('auth');
    const userData = Cookies.get('user');
    const user = JSON.parse(userData as string);
    try {
      const response = await axios.post('http://localhost:4000/reservation/reserve', 
        {
          user: user._id, 
          room: selectedRoom,
          startTime: selectedStartTime,
          endTime: selectedEndTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      console.log(response.data);
    } catch (error) {
      console.error('Failed to reserve room', error);
    }
  };

  const handleReserveClick = async () => {
    getSelectedValues();
    await reserveRoom();
  };

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
                

                <MultiSelectRoom />
                <DatePickerOne />
                <MultiSelectStart />
                <DatePickerOne />
                <MultiSelect />

                <button 
                className="mt-6 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                onClick={handleReserveClick}
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
