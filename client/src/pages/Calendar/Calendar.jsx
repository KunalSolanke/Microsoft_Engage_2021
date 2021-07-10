import React, { useEffect } from 'react'

import { format, subHours, startOfMonth } from 'date-fns';
import {
  MonthlyBody,
  MonthlyDay,
  MonthlyCalendar,
  MonthlyNav,
  DefaultMonthlyEventItem,
} from '@zach.codes/react-calendar';
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import { Content } from 'carbon-components-react';
import { useState } from 'react';
import "./_styles.css"
import LocalLoading from '../../components/Loading/LocalLoading';
import useFetchActivity from '../../hooks/useFetchActivity';
import { useSelector } from 'react-redux';

/**
 * Calendar page component
 * display user activities
 * @component
 */

function Calendar() {
     let [currentMonth, setCurrentMonth] = useState(
    startOfMonth(new Date())
  );
   const {data,isLoading,error,refetch}=useFetchActivity();
    const token = useSelector(state => state.auth.token)
    useEffect(()=>{
        if(token)refetch();
    },[token])


    return (
    <DashboardLayout>

        <Content
        id="main-content"
        className="main__dash scroll">
    <div className="calendar__style">

        <MonthlyCalendar
        className="calendar__style"
      currentMonth={currentMonth}
      onCurrentMonthChange={date => setCurrentMonth(date)}
    >
      <MonthlyNav />
      {isLoading?<LocalLoading/>:null}
      <MonthlyBody
        events={data?.map(d=>({ title: d.log, date: subHours(new Date(d.createdAt), 2) }))}
      >
        <MonthlyDay
          renderDay={data =>
            data.map((item, index) => (
              <div>
                <DefaultMonthlyEventItem
                  key={index}
                  title={item.title}
                  date={format(item.date, 'k:mm')}
                />
              </div>
            ))
          }
        />
      </MonthlyBody>
    </MonthlyCalendar>
    </div>
        </Content>

    </DashboardLayout>
    )
}

export default Calendar
