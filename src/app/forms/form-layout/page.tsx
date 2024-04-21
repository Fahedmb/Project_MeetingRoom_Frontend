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
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const metadata: Metadata = {
  title: "Next.js Form Layout | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

interface Option {
  value: string;
  text: string;
  id : string;
  selected: boolean;
  element?: HTMLElement;
}

interface DropdownProps {
  id: string;
  setSelectedRoom: (room: string) => void;
}

const FormLayout = () => {

  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');
  const [selectedStartHour, setSelectedStartHour] = useState<string>('');
  const [selectedEndHour, setSelectedEndHour] = useState<string>('');


  const reserveRoom = async () => {

    const fullStartTime = `${selectedStartTime}T${selectedStartHour}:00.000Z`;
    const fullEndTime = `${selectedEndTime}T${selectedEndHour}:00.000Z`;
  
    console.log('fullStartTime:', fullStartTime);
    console.log('fullEndTime:', fullEndTime);
    console.log('-----------------------------------');
    console.log('selectedRoom:', selectedRoom);
    console.log('selectedStartTime:', selectedStartTime);
    console.log('selectedEndTime:', selectedEndTime);
    console.log('selectedStartHour:', selectedStartHour);
    console.log('selectedEndHour:', selectedEndHour);

    const token = Cookies.get('auth');
    const userData = Cookies.get('user');
    const user = JSON.parse(userData as string);
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
        }
      );
    
      console.log(response.data);
    } catch (error) {
      console.error('Failed to reserve room', error);
    }
  };

  const DatePickerTwo = () => {
    useEffect(() => {
      // Init flatpickr
      flatpickr(".form-datepicker", {
        mode: "single",
        static: true,
        monthSelectorType: "static",
        dateFormat: "M j, Y",
        prevArrow:
          '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow:
          '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      });
    }, []);

    const DatePickerStart = () => {
      useEffect(() => {
        // Init flatpickr
        flatpickr(".form-datepicker", {
          mode: "single",
          static: true,
          monthSelectorType: "static",
          dateFormat: "M j, Y",
          prevArrow:
            '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
          nextArrow:
            '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
        });
      }, []);

      const MultiSelectStart: React.FC<DropdownProps> = ({ id }) => {
        const [options, setOptions] = useState<Option[]>([]);
        const [selected, setSelected] = useState<number[]>([]);
        const [show, setShow] = useState(false);
        const dropdownRef = useRef<any>(null);
        const trigger = useRef<any>(null);
      
        useEffect(() => {
          const loadOptions = () => {
            const newOptions: Option[] = [];
            for (let i = 8; i <= 20; i += 2) {
              const time = i < 10 ? `0${i}:00` : `${i}:00`;
              newOptions.push({
                value: time,
                text: time,
                selected: false,
              });
            }
            setOptions(newOptions);
          };
        
          loadOptions();
        }, []);
      
        const open = () => {
          setShow(true);
        };
      
        const isOpen = () => {
          return show === true;
        };
      
        const select = (index: number, event: React.MouseEvent) => {
          const newOptions = [...options];
      
          if (selected.length > 0) {
            newOptions[selected[0]].selected = false;
          }
        
          newOptions[index].selected = true;
          setSelected([index]);
      
          setOptions(newOptions);
        };
      
        const remove = (index: number) => {
          const newOptions = [...options];
          const selectedIndex = selected.indexOf(index);
      
          if (selectedIndex !== -1) {
            newOptions[index].selected = false;
            setSelected(selected.filter((i) => i !== index));
            setOptions(newOptions);
          }
        };
      
        const selectedValues = () => {
          return selected.map((option) => options[option].value);
        };
      
        useEffect(() => {
          const clickHandler = ({ target }: MouseEvent) => {
            if (!dropdownRef.current) return;
            if (
              !show ||
              dropdownRef.current.contains(target) ||
              trigger.current.contains(target)
            )
              return;
            setShow(false);
          };
          document.addEventListener("click", clickHandler);
          return () => document.removeEventListener("click", clickHandler);
        });

        
        const MultiSelect: React.FC<DropdownProps> = ({ id }) => {
          const [options, setOptions] = useState<Option[]>([]);
          const [selected, setSelected] = useState<number[]>([]);
          const [show, setShow] = useState(false);
          const dropdownRef = useRef<any>(null);
          const trigger = useRef<any>(null);
        
          useEffect(() => {
            const loadOptions = () => {
              const newOptions: Option[] = [];
              for (let i = 8; i <= 20; i += 2) {
                const time = i < 10 ? `0${i}:00` : `${i}:00`;
                newOptions.push({
                  value: time,
                  text: time,
                  selected: false,
                });
              }
              setOptions(newOptions);
            };
          
            loadOptions();
          }, []);
        
          const open = () => {
            setShow(true);
          };
        
          const isOpen = () => {
            return show === true;
          };
        
          const select = (index: number, event: React.MouseEvent) => {
            const newOptions = [...options];
        
            if (selected.length > 0) {
              newOptions[selected[0]].selected = false;
            }
          
            newOptions[index].selected = true;
            setSelected([index]);
        
            setOptions(newOptions);
          };
        
          const remove = (index: number) => {
            const newOptions = [...options];
            const selectedIndex = selected.indexOf(index);
        
            if (selectedIndex !== -1) {
              newOptions[index].selected = false;
              setSelected(selected.filter((i) => i !== index));
              setOptions(newOptions);
            }
          };
        
          const selectedValues = () => {
            return selected.map((option) => options[option].value);
          };
        
          useEffect(() => {
            const clickHandler = ({ target }: MouseEvent) => {
              if (!dropdownRef.current) return;
              if (
                !show ||
                dropdownRef.current.contains(target) ||
                trigger.current.contains(target)
              )
                return;
              setShow(false);
            };
            document.addEventListener("click", clickHandler);
            return () => document.removeEventListener("click", clickHandler);
          });

          const MultiSelectRoom: React.FC<DropdownProps> = ({ id, setSelectedRoom }) => {
            const [options, setOptions] = useState<Option[]>([]);
            const [selected, setSelected] = useState<number[]>([]);
            const [show, setShow] = useState(false);
            const dropdownRef = useRef<any>(null);
            const trigger = useRef<any>(null);
          
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
                } catch (error) {
                  console.error('Error fetching rooms:', error);
                }
              };
            
              fetchRooms();
            }, []);
          
            const open = () => {
              setShow(true);
            };
          
            const isOpen = () => {
              return show === true;
            };
          
            const select = (index: number, event: React.MouseEvent) => {
              const newOptions = [...options];
          
              if (selected.length > 0) {
                newOptions[selected[0]].selected = false;
              }
          
              newOptions[index].selected = true;
              setSelected([index]);
          
              setOptions(newOptions);
              setSelectedRoom(newOptions[index].id);
            };
          
            const remove = (index: number) => {
              const newOptions = [...options];
              const selectedIndex = selected.indexOf(index);
          
              if (selectedIndex !== -1) {
                newOptions[index].selected = false;
                setSelected(selected.filter((i) => i !== index));
                setOptions(newOptions);
              }
            };
          
            const selectedValues = () => {
              return selected.map((option) => options[option].value);
            };
          
            useEffect(() => {
              const clickHandler = ({ target }: MouseEvent) => {
                if (!dropdownRef.current) return;
                if (
                  !show ||
                  dropdownRef.current.contains(target) ||
                  trigger.current.contains(target)
                )
                  return;
                setShow(false);
              };
              document.addEventListener("click", clickHandler);
              return () => document.removeEventListener("click", clickHandler);
            });
        

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
                

              <div className="relative z-50">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Multiselect Dropdown
                </label>
                <div>
                <select className="hidden" id={id}>
                  {options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>

                  <div className="flex flex-col items-center">
                    <input name="values" type="hidden" defaultValue={selectedValues()} />
                    <div className="relative z-20 inline-block w-full">
                      <div className="relative flex flex-col items-center">
                        <div ref={trigger} onClick={open} className="w-full">
                          <div className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                            <div className="flex flex-auto flex-wrap gap-3">
                              {selected.map((index) => (
                                <div
                                  key={index}
                                  className="my-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                                >
                                  <div className="max-w-full flex-initial">
                                    {options[index].text}
                                  </div>
                                  <div className="flex flex-auto flex-row-reverse">
                                    <div
                                      onClick={() => remove(index)}
                                      className="cursor-pointer pl-2 hover:text-danger"
                                    >
                                      <svg
                                        className="fill-current"
                                        role="button"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                                          fill="currentColor"
                                        ></path>
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {selected.length === 0 && (
                                <div className="flex-1">
                                  <input
                                    placeholder="Select an option"
                                    className="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                                    defaultValue={selectedValues()}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex w-8 items-center py-1 pl-1 pr-1">
                              <button
                                type="button"
                                onClick={open}
                                className="h-6 w-6 cursor-pointer outline-none focus:outline-none"
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g opacity="0.8">
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                      fill="#637381"
                                    ></path>
                                  </g>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="w-full px-4">
                          <div
                            className={`max-h-select absolute left-0 top-full z-40 w-full overflow-y-auto rounded bg-white shadow dark:bg-form-input ${
                              isOpen() ? "" : "hidden"
                            }`}
                            ref={dropdownRef}
                            onFocus={() => setShow(true)}
                            onBlur={() => setShow(false)}
                          >
                            <div className="flex w-full flex-col">
                              {options.map((option, index) => (
                                <div key={index}>
                                  <div
                                    className="w-full cursor-pointer rounded-t border-b border-stroke hover:bg-primary/5 dark:border-form-strokedark"
                                    onClick={(event) => select(index, event)}
                                  >
                                    <div
                                      className={`relative flex w-full items-center border-l-2 border-transparent p-2 pl-2 ${
                                        option.selected ? "border-primary" : ""
                                      }`}
                                    >
                                      <div className="flex w-full items-center">
                                        <div className="mx-2 leading-6">
                                          {option.text}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Date picker
                  </label>
                  <div className="relative">
                    <input
                      className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      placeholder="mm/dd/yyyy"
                      data-class="flatpickr-right"
                    />

                    <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.7504 2.9812H14.2879V2.36245C14.2879 2.02495 14.0066 1.71558 13.641 1.71558C13.2754 1.71558 12.9941 1.99683 12.9941 2.36245V2.9812H4.97852V2.36245C4.97852 2.02495 4.69727 1.71558 4.33164 1.71558C3.96602 1.71558 3.68477 1.99683 3.68477 2.36245V2.9812H2.25039C1.29414 2.9812 0.478516 3.7687 0.478516 4.75308V14.5406C0.478516 15.4968 1.26602 16.3125 2.25039 16.3125H15.7504C16.7066 16.3125 17.5223 15.525 17.5223 14.5406V4.72495C17.5223 3.7687 16.7066 2.9812 15.7504 2.9812ZM1.77227 8.21245H4.16289V10.9968H1.77227V8.21245ZM5.42852 8.21245H8.38164V10.9968H5.42852V8.21245ZM8.38164 12.2625V15.0187H5.42852V12.2625H8.38164V12.2625ZM9.64727 12.2625H12.6004V15.0187H9.64727V12.2625ZM9.64727 10.9968V8.21245H12.6004V10.9968H9.64727ZM13.8379 8.21245H16.2285V10.9968H13.8379V8.21245ZM2.25039 4.24683H3.71289V4.83745C3.71289 5.17495 3.99414 5.48433 4.35977 5.48433C4.72539 5.48433 5.00664 5.20308 5.00664 4.83745V4.24683H13.0504V4.83745C13.0504 5.17495 13.3316 5.48433 13.6973 5.48433C14.0629 5.48433 14.3441 5.20308 14.3441 4.83745V4.24683H15.7504C16.0316 4.24683 16.2566 4.47183 16.2566 4.75308V6.94683H1.77227V4.75308C1.77227 4.47183 1.96914 4.24683 2.25039 4.24683ZM1.77227 14.5125V12.2343H4.16289V14.9906H2.25039C1.96914 15.0187 1.77227 14.7937 1.77227 14.5125ZM15.7504 15.0187H13.8379V12.2625H16.2285V14.5406C16.2566 14.7937 16.0316 15.0187 15.7504 15.0187Z"
                          fill="#64748B"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="relative z-50">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Multiselect Dropdown
                  </label>
                  <div>
                    <select className="hidden" id={id}>
                      {options.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.text}
                        </option>
                      ))}
                    </select>

                    <div className="flex flex-col items-center">
                      <input name="values" type="hidden" defaultValue={selectedValues()} />
                      <div className="relative z-20 inline-block w-full">
                        <div className="relative flex flex-col items-center">
                          <div ref={trigger} onClick={open} className="w-full">
                            <div className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                              <div className="flex flex-auto flex-wrap gap-3">
                                {selected.map((index) => (
                                  <div
                                    key={index}
                                    className="my-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                                  >
                                    <div className="max-w-full flex-initial">
                                      {options[index].text}
                                    </div>
                                    <div className="flex flex-auto flex-row-reverse">
                                      <div
                                        onClick={() => remove(index)}
                                        className="cursor-pointer pl-2 hover:text-danger"
                                      >
                                        <svg
                                          className="fill-current"
                                          role="button"
                                          width="12"
                                          height="12"
                                          viewBox="0 0 12 12"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                                            fill="currentColor"
                                          ></path>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {selected.length === 0 && (
                                  <div className="flex-1">
                                    <input
                                      placeholder="Select an option"
                                      className="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                                      defaultValue={selectedValues()}
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex w-8 items-center py-1 pl-1 pr-1">
                                <button
                                  type="button"
                                  onClick={open}
                                  className="h-6 w-6 cursor-pointer outline-none focus:outline-none"
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g opacity="0.8">
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                        fill="#637381"
                                      ></path>
                                    </g>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="w-full px-4">
                            <div
                              className={`max-h-select absolute left-0 top-full z-40 w-full overflow-y-auto rounded bg-white shadow dark:bg-form-input ${
                                isOpen() ? "" : "hidden"
                              }`}
                              ref={dropdownRef}
                              onFocus={() => setShow(true)}
                              onBlur={() => setShow(false)}
                            >
                              <div className="flex w-full flex-col">
                                {options.map((option, index) => (
                                  <div key={index}>
                                    <div
                                      className="w-full cursor-pointer rounded-t border-b border-stroke hover:bg-primary/5 dark:border-form-strokedark"
                                      onClick={(event) => select(index, event)}
                                    >
                                      <div
                                        className={`relative flex w-full items-center border-l-2 border-transparent p-2 pl-2 ${
                                          option.selected ? "border-primary" : ""
                                        }`}
                                      >
                                        <div className="flex w-full items-center">
                                          <div className="mx-2 leading-6">
                                            {option.text}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Select date
                  </label>
                  <div className="relative">
                    <input
                      className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      placeholder="mm/dd/yyyy"
                      data-class="flatpickr-right"
                    />

                    <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.0002 12.8249C8.83145 12.8249 8.69082 12.7687 8.5502 12.6562L2.08145 6.2999C1.82832 6.04678 1.82832 5.65303 2.08145 5.3999C2.33457 5.14678 2.72832 5.14678 2.98145 5.3999L9.0002 11.278L15.0189 5.34365C15.2721 5.09053 15.6658 5.09053 15.9189 5.34365C16.1721 5.59678 16.1721 5.99053 15.9189 6.24365L9.45019 12.5999C9.30957 12.7405 9.16895 12.8249 9.0002 12.8249Z"
                          fill="#64748B"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="relative z-50">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Multiselect Dropdown
                  </label>
                  <div>
                    <select className="hidden" id={id}>
                      {options.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.text}
                        </option>
                      ))}
                    </select>

                    <div className="flex flex-col items-center">
                      <input name="values" type="hidden" defaultValue={selectedValues()} />
                      <div className="relative z-20 inline-block w-full">
                        <div className="relative flex flex-col items-center">
                          <div ref={trigger} onClick={open} className="w-full">
                            <div className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                              <div className="flex flex-auto flex-wrap gap-3">
                                {selected.map((index) => (
                                  <div
                                    key={index}
                                    className="my-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                                  >
                                    <div className="max-w-full flex-initial">
                                      {options[index].text}
                                    </div>
                                    <div className="flex flex-auto flex-row-reverse">
                                      <div
                                        onClick={() => remove(index)}
                                        className="cursor-pointer pl-2 hover:text-danger"
                                      >
                                        <svg
                                          className="fill-current"
                                          role="button"
                                          width="12"
                                          height="12"
                                          viewBox="0 0 12 12"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                                            fill="currentColor"
                                          ></path>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {selected.length === 0 && (
                                  <div className="flex-1">
                                    <input
                                      placeholder="Select an option"
                                      className="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                                      defaultValue={selectedValues()}
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex w-8 items-center py-1 pl-1 pr-1">
                                <button
                                  type="button"
                                  onClick={open}
                                  className="h-6 w-6 cursor-pointer outline-none focus:outline-none"
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g opacity="0.8">
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                        fill="#637381"
                                      ></path>
                                    </g>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="w-full px-4">
                            <div
                              className={`max-h-select absolute left-0 top-full z-40 w-full overflow-y-auto rounded bg-white shadow dark:bg-form-input ${
                                isOpen() ? "" : "hidden"
                              }`}
                              ref={dropdownRef}
                              onFocus={() => setShow(true)}
                              onBlur={() => setShow(false)}
                            >
                              <div className="flex w-full flex-col">
                                {options.map((option, index) => (
                                  <div key={index}>
                                    <div
                                      className="w-full cursor-pointer rounded-t border-b border-stroke hover:bg-primary/5 dark:border-form-strokedark"
                                      onClick={(event) => select(index, event)}
                                    >
                                      <div
                                        className={`relative flex w-full items-center border-l-2 border-transparent p-2 pl-2 ${
                                          option.selected ? "border-primary" : ""
                                        }`}
                                      >
                                        <div className="flex w-full items-center">
                                          <div className="mx-2 leading-6">
                                            {option.text}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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