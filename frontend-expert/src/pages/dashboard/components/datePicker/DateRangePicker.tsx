/* eslint-disable react/jsx-props-no-spreading */

import React, { forwardRef, useRef } from 'react';
import { Form } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Datepicker.css';

const CustomInput = forwardRef((props: any, ref) => (
  <Form.Control {...props} ref={ref} className="me-4 border-primary" />
));

function DateRangePicker({
  dateRange,
  setDateRange,
}: {
  dateRange: (null | Date)[];
  setDateRange: React.Dispatch<React.SetStateAction<(Date | null)[]>>;
}) {
  const inputRef = useRef(null);
  const [startDate, endDate] = dateRange;
  const DAY_SECONDS = 1000 * 60 * 60 * 24;

  const getDateDifference = (date1: Date | null, date2: Date | null) => {
    if (date1 === null || date2 === null) {
      return '';
    }

    const [time1, time2] = [date1.getTime(), date2.getTime()];
    const DAY_DIFFERENCE = Math.floor((time2 - time1) / DAY_SECONDS) + 1;
    return `총 ${DAY_DIFFERENCE}일`;
  };

  return (
    <div className="d-flex align-items-center">
      <ReactDatePicker
        selectsRange
        selected={startDate}
        startDate={startDate}
        endDate={endDate}
        dateFormat="yyyy/MM/dd"
        wrapperClassName="datePicker"
        placeholderText="Click to select a date"
        onChange={(update) => {
          setDateRange(update);
        }}
        customInput={<CustomInput ref={inputRef} />}
        isClearable
        monthsShown={2}
        todayButton="go to today"
      />
      <div className="text-primary text-nowrap ms-2">
        {getDateDifference(dateRange[0], dateRange[1])}
      </div>
    </div>
  );
}

export default DateRangePicker;
