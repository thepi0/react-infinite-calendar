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
      min={subMonths(today, 2)}
      max={addMonths(today, 2)}
      rowHeight={74}
      selected={null}
      lastSelectableDate={new Date(2018, 0, 1)}
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
              date: "2018-01-10",
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
          }
      ]}
      disabledDates={null}
      disabledDays={[6,7]}
      displayOptions={{
          hideYearsOnSelect: false,
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
      preselected={[
          {
              start_time: "2018-01-16T08:00:00Z",
              end_time: "2018-01-16T16:00:00Z",
              child: 100
          }, {
              start_time: "2018-01-15T08:00:00Z",
              end_time: "2018-01-15T16:00:00Z",
              child: 100
          },{
              start_time: "2017-11-01T08:00:00Z",
              end_time: "2017-11-01T16:00:00Z",
              child: 100
          }, {
              start_time: "2017-11-01T09:00:00Z",
              end_time: "2017-11-01T17:00:00Z",
              child: 101
          }, {
              start_time: "2017-12-27T08:00:00Z",
              end_time: "2017-12-27T16:00:00Z",
              child: 100
          }, {
              start_time: "2017-12-27T09:00:00Z",
              end_time: "2017-12-27T17:00:00Z",
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
              start_time: "2018-01-24T08:00:00Z",
              end_time: "2018-01-24T16:00:00Z",
              child: 100
          }, {
              start_time: "2018-01-24T09:00:00Z",
              end_time: "2018-01-24T17:00:00Z",
              child: 101
          }, {
              start_time: "2018-01-25T09:00:00Z",
              end_time: "2018-01-25T17:00:00Z",
              child: 100
          }, {
              start_time: "2018-01-25T09:00:00Z",
              end_time: "2018-01-25T17:00:00Z",
              child: 101
          }, {
              start_time: "2018-01-26T09:00:00Z",
              end_time: "2018-01-26T17:00:00Z",
              child: 100
          }, {
              start_time: "2018-01-26T09:00:00Z",
              end_time: "2018-01-26T17:00:00Z",
              child: 101
          }, {
              start_time: "2018-01-26T09:00:00Z",
              end_time: "2018-01-26T17:00:00Z",
              child: 102
          }, {
              start_time: "2018-01-26T09:00:00Z",
              end_time: "2018-01-26T17:00:00Z",
              child: 103
          }, {
              start_time: "2018-01-31T09:00:00Z",
              end_time: "2018-01-31T17:00:00Z",
              child: 100
          }, {
              start_time: "2018-01-31T09:00:00Z",
              end_time: "2018-01-31T17:00:00Z",
              child: 101
          }, {
              start_time: "2018-01-31T09:00:00Z",
              end_time: "2018-01-31T17:00:00Z",
              child: 102
          }, {
              start_time: "2018-01-29T09:00:00Z",
              end_time: "2018-01-29T17:00:00Z",
              child: 102
          }
      ]}
      onSelect={(date) => console.log(date)}
      Component={withRange(Calendar)}
    />
  ));
