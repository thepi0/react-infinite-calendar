import React from 'react';
import {render} from 'react-dom';
import InfiniteCalendar, {
  Calendar,
  withRange,
} from '../../src';
import '../../styles.css';
import './demo.css';

// Date manipulation utils
import addDays from 'date-fns/add_days';
import addMonths from 'date-fns/add_months';
import endOfMonth from 'date-fns/end_of_month';
import format from 'date-fns/format';
import isBefore from 'date-fns/is_before';
import subMonths from 'date-fns/sub_months';

const today = new Date();

let originalDisabledDates = [];
let preselected = [];
let lastUpdated = new Date();
let test = 'asd';

console.log('before timeout run');
console.log(lastUpdated);

setTimeout(function() {

    console.log('timeout run');

    test = 'das';

originalDisabledDates = [
    {
        date: "2017-11-21",
        type: "vacation"
    }, {
        date: "2017-12-25",
        type: "vacation"
    }, {
        date: "2017-12-26",
        type: "vacation"
    }, {
        date: "2017-12-29",
        type: "vacation"
    }, {
        date: "2018-01-23",
        type: "vacation"
    }
];

preselected = [
    {
        start_time: "2017-11-01T08:00:00Z",
        end_time: "2017-11-01T16:00:00Z",
        child: 100
    }, {
        start_time: "2017-11-01T09:00:00Z",
        end_time: "2017-11-01T17:00:00Z",
        child: 101
    }, {
        start_time: "2017-11-28T08:00:00Z",
        end_time: "2017-11-28T16:00:00Z",
        child: 100
    }, {
        start_time: "2017-11-28T09:00:00Z",
        end_time: "2017-11-28T17:00:00Z",
        child: 101
    },{
        start_time: "2017-11-29T08:00:00Z",
        end_time: "2017-11-07T16:00:00Z",
        child: 100
    }, {
        start_time: "2017-11-29T09:00:00Z",
        end_time: "2017-11-29T17:00:00Z",
        child: 101
    }, {
        start_time: "2017-11-30T08:00:00Z",
        end_time: "2017-11-30T16:00:00Z",
        child: 100
    }, {
        start_time: "2017-11-30T09:00:00Z",
        end_time: "2017-11-30T17:00:00Z",
        child: 101
    }, {
        start_time: "2017-11-15T08:00:00Z",
        end_time: "2017-11-15T16:00:00Z",
        child: 100
    }, {
        start_time: "2017-11-16T08:00:00Z",
        end_time: "2017-11-16T16:00:00Z",
        child: 100
    }, {
        start_time: "2017-11-17T08:00:00Z",
        end_time: "2017-11-17T16:00:00Z",
        child: 100
    }, {
        start_time: "2017-12-28T08:00:00Z",
        end_time: "2017-12-28T16:00:00Z",
        child: 100
    }, {
        start_time: "2017-12-19T08:00:00Z",
        end_time: "2017-12-19T16:00:00Z",
        child: 100
    }, {
        start_time: "2017-12-19T08:00:00Z",
        end_time: "2017-12-19T16:00:00Z",
        child: 101
    }, {
        start_time: "2017-12-20T09:00:00Z",
        end_time: "2017-12-20T17:00:00Z",
        child: 101
    }, {
        start_time: "2017-12-21T08:00:00Z",
        end_time: "2017-12-21T16:00:00Z",
        child: 100
    }, {
        start_time: "2017-12-21T09:00:00Z",
        end_time: "2017-12-21T17:00:00Z",
        child: 101
    }, {
        start_time: "2018-01-08T09:00:00Z",
        end_time: "2018-01-08T17:00:00Z",
        child: 101
    }, {
        start_time: "2018-01-09T09:00:00Z",
        end_time: "2018-01-09T17:00:00Z",
        child: 101
    }, {
        start_time: "2018-01-09T09:00:00Z",
        end_time: "2018-01-09T17:00:00Z",
        child: 100
    }, {
        start_time: "2018-01-10T09:00:00Z",
        end_time: "2018-01-10T17:00:00Z",
        child: 100
    }, {
        start_time: "2018-01-10T09:00:00Z",
        end_time: "2018-01-10T17:00:00Z",
        child: 101
    }, {
        start_time: "2018-01-11T09:00:00Z",
        end_time: "2018-01-11T17:00:00Z",
        child: 101
    }, {
        start_time: "2018-01-17T09:00:00Z",
        end_time: "2018-01-17T17:00:00Z",
        child: 101
    }, {
        start_time: "2018-01-01T09:00:00Z",
        end_time: "2018-01-01T17:00:00Z",
        child: 100
    }, {
        start_time: "2018-01-01T09:00:00Z",
        end_time: "2018-01-01T17:00:00Z",
        child: 101
    }, {
        start_time: "2018-01-02T09:00:00Z",
        end_time: "2018-01-02T17:00:00Z",
        child: 101
    }, {
        start_time: "2018-01-03T09:00:00Z",
        end_time: "2018-01-03T17:00:00Z",
        child: 101
    }, {
        start_time: "2018-01-04T09:00:00Z",
        end_time: "2018-01-04T17:00:00Z",
        child: 100
    }, {
        start_time: "2018-01-05T09:00:00Z",
        end_time: "2018-01-05T17:00:00Z",
        child: 100
    }, {
        start_time: "2018-01-05T09:00:00Z",
        end_time: "2018-01-05T17:00:00Z",
        child: 101
    }, {
        start_time: "2018-01-26T09:00:00Z",
        end_time: "2018-01-26T17:00:00Z",
        child: 101
    }, {
        start_time: "2018-01-29T09:00:00Z",
        end_time: "2018-01-29T17:00:00Z",
        child: 101
    }, {
        start_time: "2018-01-30T09:00:00Z",
        end_time: "2018-01-30T17:00:00Z",
        child: 101
    }, {
        start_time: "2018-01-29T09:00:00Z",
        end_time: "2018-01-29T17:00:00Z",
        child: 100
    }, {
        start_time: "2018-01-30T09:00:00Z",
        end_time: "2018-01-30T17:00:00Z",
        child: 100
    }
];

lastUpdated = new Date();

console.log('after timeout run');
console.log(lastUpdated);

}.bind(this), 3000);

const test1 = test;
const test2 = test;

render(
    <div>
        {test1}
        {test2}
    {test}
    <InfiniteCalendar
      width={Math.min(window.innerWidth, 900)}
      height={Math.min(window.innerHeight, 900)}
      min={subMonths(today, 6)}
      max={addMonths(today, 6)}
      rowHeight={74}
      selected={null}
      lastSelectableDate={"2017-12-18T21:00:00Z"}
      lastUpdate={lastUpdated}
      originalDisabledDates={originalDisabledDates}
      disabledDates={null}
      initialSelectedDate={new Date()}
      disabledDays={[6,7]}
      displayOptions={{
          hideYearsOnSelect: true,
          layout: 'portrait',
          overscanMonthCount: 2,
          showHeader: false,
          showMonthsForYears: false,
          showOverlay: false,
          showTodayHelper: true,
          showWeekdays: true,
          todayHelperRowOffset: 4,
      }}
      locale={{
          locale: require('date-fns/locale/fi'),
          blank: 'Valitse päivämäärä(t)',
          headerFormat: 'ddd, MMM Do',
          todayLabel: {
            long: 'Tänään',
          },
          weekdays: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'],
          weekStartsOn: 1,
      }}
      theme={{
          weekdaysHeight: '64px'
      }}
      preselected={preselected}
      onSelect={(date) => console.log(date)}
      Component={withRange(Calendar)}
    />
</div>
, document.querySelector('#demo'));
