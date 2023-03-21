import Year from "react-live-clock";
import Month from "react-live-clock";
import Day from "react-live-clock";
import React, {
    Component,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from "react";
import Clock from 'react-live-clock';


const Calendar = () => {
    return <div>
         <div className="Year-Month">
        <p>
          <span className="Year">
            <Year
              id="Year"
              format={"YYYY"}
              ticking={false}
              timezone={"KR/Pacific"}
            />
          </span>
        <span>년</span>
          &nbsp;&nbsp;
          <span className="Month">
            <Month format={"MM"} ticking={false} timezone={"KR/Pacific"}/>
          </span>
            <span>월</span>
            &nbsp;&nbsp;
            <span className="Month">
            <Day format={"DD"} ticking={false} timezone={"KR/Pacific"}/>
          </span>
            <span>일</span>
        </p>
      </div>
    </div>;
};

export default Calendar;