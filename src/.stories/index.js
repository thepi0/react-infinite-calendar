/* eslint-disable sort-keys */
import React from 'react';
import {addDecorator, storiesOf} from '@kadira/storybook';
import InfiniteCalendar, {
  Calendar,
  defaultMultipleDateInterpolation,
  withRange,
} from '../';
import styles from './stories.scss';

// Date manipulation utils
import addDays from 'date-fns/add_days';
import addMonths from 'date-fns/add_months';
import endOfMonth from 'date-fns/end_of_month';
import format from 'date-fns/format';
import isBefore from 'date-fns/is_before';
import subMonths from 'date-fns/sub_months';

const CenterDecorator = story => <div className={styles.center}>{story()}</div>;
addDecorator(CenterDecorator);

const today = new Date();


storiesOf('Higher Order Components', module)
  .add('With Range selection', () => (
    <InfiniteCalendar
      width={Math.min(window.innerWidth, 900)}
      height={Math.min(window.innerHeight, 900)}
      min={subMonths(today, 12)}
      max={addMonths(today, 12)}
      rowHeight={74}
      selected={null}
      lastSelectableDate={new Date(2018, 0, 29)}
      scrollOffset={6700}
      lastUpdate={new Date()}
      autoFocus={false}
      originalDisabledDates={[
          {
              date: "2017-11-28",
              type: "vacation"
          },{
              date: "2017-12-28",
              type: "vacation"
          },{
              date: "2017-12-25",
              type: "vacation"
          },{
              date: "2018-01-15",
              type: "vacation"
          }, {
              date: "2018-01-16",
              type: "vacation"
          }, {
              date: "2018-01-17",
              type: "vacation"
          }, {
              date: "2018-01-25",
              type: "vacation"
          }, {
              date: "2018-01-25",
              type: "vacation"
          }, {
              date: "2018-01-12",
              type: "holiday"
          }, {
              date: "2018-01-10",
              type: "vacation"
          }, {
              date: "2018-01-12",
              type: "holiday"
          }, {
              date: "2018-01-12",
              type: "vacation"
          }, {
              date: "2018-02-12",
              type: "vacation"
          }, {
              date: "2018-02-20",
              type: "holiday"
          }
      ]}
      disabledDates={null}
      disabledDays={[6,7]}
      displayOptions={{
          hideYearsOnSelect: false,
          layout: 'portrait',
          overscanMonthCount: 10,
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
      preselected={[
          {
              start_time: "2018-01-15",
              end_time: "2018-01-15",
              child: 100,
              color: '#ca569a'
          },{
              start_time: "2018-01-16",
              end_time: "2018-01-16",
              child: 101,
              color: '#2cb1d8'
          },{
              start_time: "2018-01-29",
              end_time: "2018-01-29",
              child: 100,
              color: '#ca569a'
          },{
              start_time: "2018-01-29",
              end_time: "2018-01-29",
              child: 101,
              color: '#2cb1d8'
          },{
              start_time: "2018-01-30",
              end_time: "2018-01-30",
              child: 100,
              color: '#ca569a'
          },{
              start_time: "2018-01-30",
              end_time: "2018-01-30",
              child: 101,
              color: '#2cb1d8'
          },{
              start_time: "2018-01-31",
              end_time: "2018-01-31",
              child: 103,
              color: '#ea992f'
          },{
              start_time: "2018-01-31",
              end_time: "2018-01-31",
              child: 102,
              color: '#85bd4c'
          },{
              start_time: "2018-02-01",
              end_time: "2018-02-301",
              child: 103,
              color: '#ea992f'
          },{
              start_time: "2018-02-01",
              end_time: "2018-02-01",
              child: 102,
              color: '#85bd4c'
          },{
              start_time: "2018-02-26",
              end_time: "2018-02-26",
              child: 100,
              color: '#ca569a'
          },{
              start_time: "2018-02-27",
              end_time: "2018-02-27",
              child: 100,
              color: '#ca569a'
          },{
              start_time: "2018-02-28",
              end_time: "2018-02-28",
              child: 101,
              color: '#2cb1d8'
          },{
              start_time: "2018-03-01",
              end_time: "2018-03-01",
              child: 102,
              color: '#85bd4c'
          },{
              start_time: "2018-02-06",
              end_time: "2018-02-06",
              child: 100,
              color: '#ca569a'
          },{
              start_time: "2018-02-06",
              end_time: "2018-02-06",
              child: 101,
              color: '#2cb1d8'
          },{
              start_time: "2018-02-07",
              end_time: "2018-02-07",
              child: 100,
              color: '#ca569a'
          },{
              start_time: "2018-02-07",
              end_time: "2018-02-07",
              child: 101,
              color: '#2cb1d8'
          },{
              start_time: "2018-02-08",
              end_time: "2018-02-08",
              child: 102,
              color: '#85bd4c'
          },{
              start_time: "2018-02-12",
              end_time: "2018-02-12",
              child: 101,
              color: '#2cb1d8'
          },{
              start_time: "2018-02-12",
              end_time: "2018-02-12",
              child: 102,
              color: '#85bd4c'
          },{
              start_time: "2018-02-13",
              end_time: "2018-02-13",
              child: 101,
              color: '#2cb1d8'
          },{
              start_time: "2018-02-16",
              end_time: "2018-02-16",
              child: 100,
              color: '#ca569a'
          },{
              start_time: "2018-02-16",
              end_time: "2018-02-16",
              child: 101,
              color: '#2cb1d8'
          },{
              start_time: "2018-02-16",
              end_time: "2018-02-16",
              child: 102,
              color: '#85bd4c'
          },{
              start_time: "2018-02-16",
              end_time: "2018-02-16",
              child: 103,
              color: '#ea992f'
          },{
              start_time: "2018-02-21",
              end_time: "2018-02-21",
              child: 100,
              color: '#ca569a'
          },{
              start_time: "2018-02-22",
              end_time: "2018-02-22",
              child: 101,
              color: '#2cb1d8'
          },{
              start_time: "2018-02-23",
              end_time: "2018-02-23",
              child: 100,
              color: '#ca569a'
          }
      ]}
      onSelect={(date) => console.log(date)}
      onScrollEnd={(date) => console.log(date)}
      Component={withRange(Calendar)}
    />
  ));
