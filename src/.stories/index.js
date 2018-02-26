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


storiesOf('Calendar examples', module)
  .add('With dragging range and reservations', () => (
    <InfiniteCalendar
      width={Math.min(window.innerWidth, 900)}
      height={Math.min(window.innerHeight, 900)}
      min={subMonths(today, 12)}
      max={addMonths(today, 12)}
      rowHeight={74}
      selected={null}
      lastSelectableDate={new Date(2018, 0, 29)}
      scrollOffset={3800}
      lastUpdate={new Date()}
      autoFocus={false}
      originalDisabledDates={[
          {
              date: "2018-01-17",
              type: "vacation"
          },{
              date: "2018-01-18",
              type: "vacation"
          },{
              date: "2018-01-19",
              type: "holiday"
          },{
              date: "2018-03-20",
              type: "vacation"
          },{
              date: "2018-03-21",
              type: "vacation"
          },{
              date: "2018-03-22",
              type: "vacation"
          },{
              date: "2018-03-27",
              type: "holiday"
          }, {
              date: "2018-03-28",
              type: "holiday"
          }
      ]}
      disabledDates={null}
      disabledDays={[6,7]}
      displayOptions={{
          hideYearsOnSelect: false,
          layout: 'portrait',
          overscanMonthCount: 0,
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
              start_time: "2018-01-23T07:00:00Z",
              end_time: "2018-01-23T14:00:00Z",
              child: 100,
              color: '#ca569a'
          },{
              start_time: "2018-01-23T07:00:00Z",
              end_time: "2018-01-23T14:00:00Z",
              child: 101,
              color: '#2cb1d8'
          },{
              start_time: "2018-01-23T07:00:00Z",
              end_time: "2018-01-23T14:00:00Z",
              child: 102,
              color: '#85bd4c'
          },{
              start_time: "2018-01-23T07:00:00Z",
              end_time: "2018-01-23T14:00:00Z",
              child: 103,
              color: '#ea992f'
          }, {
              start_time: "2018-01-24T14:00:00Z",
              end_time: "2018-01-24T14:00:00Z",
              child: 100,
              color: '#ca569a'
          },{
              start_time: "2018-01-24T07:00:00Z",
              end_time: "2018-01-24T14:00:00Z",
              child: 101,
              color: '#2cb1d8'
          },{
              start_time: "2018-01-24T07:00:00Z",
              end_time: "2018-01-24T14:00:00Z",
              child: 102,
              color: '#85bd4c'
          },{
              start_time: "2018-01-24T07:00:00Z",
              end_time: "2018-01-24T14:00:00Z",
              child: 103,
              color: '#ea992f'
          }, {
              start_time: "2018-02-13T07:00:00Z",
              end_time: "2018-02-13T14:00:00Z",
              child: 100,
              color: '#ca569a'
          },
          {
              start_time: "2018-02-14T07:00:00Z",
              end_time: "2018-02-14T14:00:00Z",
              child: 100,
              color: '#ca569a'
          },
          {
              start_time: "2018-02-16T07:00:00Z",
              end_time: "2018-02-16T14:00:00Z",
              child: 100,
              color: '#ca569a'
          },{
              start_time: "2018-02-20T07:00:00Z",
              end_time: "2018-02-20T14:00:00Z",
              child: 100,
              color: '#ca569a'
          },
          {
              start_time: "2018-02-20T07:00:00Z",
              end_time: "2018-02-20T14:00:00Z",
              child: 101,
              color: '#2cb1d8'
          },
          {
              start_time: "2018-02-20T07:00:00Z",
              end_time: "2018-02-20T14:00:00Z",
              child: 102,
              color: '#85bd4c'
          },{
              start_time: "2018-02-20T07:00:00Z",
              end_time: "2018-02-20T14:00:00Z",
              child: 103,
              color: '#ea992f'
          },{
              start_time: "2018-02-26T07:00:00Z",
              end_time: "2018-02-26T14:00:00Z",
              child: 103,
              color: '#ea992f'
          },{
              start_time: "2018-02-27T07:00:00Z",
              end_time: "2018-02-27T14:00:00Z",
              child: 103,
              color: '#ea992f'
          },{
              start_time: "2018-02-28T07:00:00Z",
              end_time: "2018-02-28T14:00:00Z",
              child: 103,
              color: '#ea992f'
          },{
              start_time: "2018-03-21T07:00:00Z",
              end_time: "2018-03-21T14:00:00Z",
              child: 103,
              color: '#ea992f'
          },{
              start_time: "2018-03-22T07:00:00Z",
              end_time: "2018-03-22T14:00:00Z",
              child: 103,
              color: '#ea992f'
          }
      ]}
      onSelect={(date) => console.log(date)}
      onScrollEnd={(date) => console.log(date)}
      Component={withRange(Calendar)}
    />
    ))
    .add('With two weeks selection without reservations', () => (
        <div style={{width: '100%', height: '100%'}}>
        <InfiniteCalendar
          width="100%"
          height={152}
          miniCalendar={true}
          min={new Date(2018, 3, 30)}
          max={new Date(2018, 4, 11)}
          rowHeight={74}
          selected={null}
          lastSelectableDate={null}
          scrollOffset={0}
          lastUpdate={new Date()}
          autoFocus={false}
          originalDisabledDates={[
              {
                  date: "2018-05-07",
                  type: "no-reservation"
              },{
                  date: "2018-05-08",
                  type: "no-reservation"
              }
          ]}
          disabledDates={null}
          disabledDays={[6,7]}
          displayOptions={{
              hideYearsOnSelect: false,
              layout: 'portrait',
              overscanMonthCount: 0,
              showHeader: false,
              showMonthsForYears: false,
              showOverlay: false,
              showTodayHelper: false,
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
          onSelect={(date) => console.log(date)}
          onScrollEnd={(date) => console.log(date)}
          Component={withRange(Calendar)}
        />
        <div style={{width: '100%', height: '20px'}}></div>
        <InfiniteCalendar
          width="100%"
          height={152}
          miniCalendar={true}
          min={new Date(2018, 1, 19)}
          max={new Date(2018, 2, 2)}
          rowHeight={74}
          selected={null}
          lastSelectableDate={null}
          scrollOffset={0}
          lastUpdate={new Date()}
          autoFocus={false}
          originalDisabledDates={[
              {
                  date: "2018-02-19",
                  type: "no-reservation",
                  hide: true
              },{
                  date: "2018-02-20",
                  type: "no-reservation",
                  hide: true
              },{
                  date: "2018-02-21",
                  type: "no-reservation",
                  hide: true
              },{
                  date: "2018-02-22",
                  type: "no-reservation",
                  hide: true
              },{
                  date: "2018-02-27",
                  type: "no-reservation"
              },{
                  date: "2018-02-28",
                  type: "no-reservation"
              }
          ]}
          disabledDates={null}
          disabledDays={[6,7]}
          displayOptions={{
              hideYearsOnSelect: false,
              layout: 'portrait',
              overscanMonthCount: 0,
              showHeader: false,
              showMonthsForYears: false,
              showOverlay: false,
              showTodayHelper: false,
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
          onSelect={(date) => console.log(date)}
          onScrollEnd={(date) => console.log(date)}
          Component={withRange(Calendar)}
        />
        <div style={{width: '100%', height: '20px'}}></div>
        <InfiniteCalendar
          width="100%"
          height={152}
          miniCalendar={true}
          min={new Date(2018, 4, 28)}
          max={new Date(2018, 5, 8)}
          rowHeight={74}
          selected={null}
          lastSelectableDate={null}
          scrollOffset={0}
          lastUpdate={new Date()}
          autoFocus={false}
          originalDisabledDates={[
              {
                  date: "2018-02-19",
                  type: "no-reservation",
                  hide: true
              },{
                  date: "2018-02-20",
                  type: "no-reservation",
                  hide: true
              },{
                  date: "2018-02-21",
                  type: "no-reservation",
                  hide: true
              },{
                  date: "2018-02-22",
                  type: "no-reservation",
                  hide: true
              },{
                  date: "2018-02-27",
                  type: "no-reservation"
              },{
                  date: "2018-02-28",
                  type: "no-reservation"
              }
          ]}
          disabledDates={null}
          disabledDays={[6,7]}
          displayOptions={{
              hideYearsOnSelect: false,
              layout: 'portrait',
              overscanMonthCount: 0,
              showHeader: false,
              showMonthsForYears: false,
              showOverlay: false,
              showTodayHelper: false,
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
          onSelect={(date) => console.log(date)}
          onScrollEnd={(date) => console.log(date)}
          Component={withRange(Calendar)}
        />
        </div>
  ));
