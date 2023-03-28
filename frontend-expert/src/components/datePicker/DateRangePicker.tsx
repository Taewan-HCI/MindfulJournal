/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React, { forwardRef, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Datepicker.css';

const CustomInput = forwardRef((props: any, ref) => (
  <Form.Control {...props} ref={ref} />
));

function DateRangePicker() {
  const [dateRange, setDateRange] = useState<(null | Date)[]>([null, null]);
  const inputRef = useRef(null);
  const [startDate, endDate] = dateRange;
  return (
    <ReactDatePicker
      selectsRange
      startDate={startDate}
      endDate={endDate}
      dateFormat="yyyy/MM/dd"
      placeholderText="Click to select a date"
      onChange={(update) => {
        setDateRange(update);
      }}
      customInput={<CustomInput ref={inputRef} />}
      isClearable
      monthsShown={2}
      todayButton="go to today"
    />
  );
}

export default DateRangePicker;
