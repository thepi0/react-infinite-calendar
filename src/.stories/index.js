/* eslint-disable sort-keys */
import React from 'react';
import {addDecorator, storiesOf} from '@kadira/storybook';
import InfiniteCalendar, {
  Calendar,
  defaultMultipleDateInterpolation,
  withDateSelection,
  withKeyboardSupport,
  withMultipleDates,
  withRange,
  withMultipleRanges,
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

storiesOf('Basic settings', module)
  .add('Default Configuration', () => <InfiniteCalendar />)
  .add('Initially Selected Date', () => <InfiniteCalendar selected={addDays(today, 5)} />)
  .add('Blank Initial State', () => <InfiniteCalendar selected={null} />)
  .add('Min Date', () => (
    <InfiniteCalendar
      min={subMonths(today, 1)} // Minimum month to render
      minDate={addDays(today, 1)} // Minimum selectable date
      selected={addDays(today, 5)}
    />
  ))
  .add('Max Date', () => (
    <InfiniteCalendar
      max={endOfMonth(addMonths(today, 1))} // Maximum rendered month
      maxDate={today} // Maximum selectable date
    />
  ))
  .add('Disable Specific Dates', () => (
    <InfiniteCalendar
      disabledDates={[-10, -5, -6, 5, 6, 7, 2].map(amount =>
        addDays(today, amount)
      )}
    />
  ))
  .add('Disable Specific Weekdays', () => (
    <InfiniteCalendar disabledDays={[0, 6]} />
  ));

storiesOf('Higher Order Components', module)
  .add('Range selection', () => (
    <InfiniteCalendar
      selected={{
        start: addDays(new Date(), 2),
        end: addDays(new Date(), 17),
      }}
      locale={{
        headerFormat: 'MMM Do',
      }}
      Component={withRange(withKeyboardSupport(Calendar))}
    />
  ))
  .add('Multiple Range selection', () => (
    <InfiniteCalendar
      width={Math.min(window.innerWidth, 900)}
      height={Math.min(window.innerHeight, 900)}
      min={subMonths(today, 1)}
      max={addMonths(today, 1)}
      rowHeight={74}
      selected={null}
      lastSelectableDate={new Date(2017, 11, 18)}
      lastUpdate={new Date()}
      originalDisabledDates={[
          {
              date: "2018-01-24",
              type: "holiday"
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
      preselected={[
          {
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
          }
      ]}
      onSelect={(date) => console.log(date)}
      Component={withRange(Calendar)}
    />
  ))
  .add('Multiple date selection', () => {
    return (
      <InfiniteCalendar
        selected={[new Date(2017, 11, 11), new Date(2017, 11, 11), addDays(today, -600), addDays(today, -200), today, addDays(today, 50), addDays(today, 400)]}
        initialSelectedDate={today}
        interpolateSelection={defaultMultipleDateInterpolation}
        Component={withMultipleDates(withKeyboardSupport(Calendar))}
      />
    );
  })
  .add('Keyboard Support', () => {
    return <InfiniteCalendar Component={withDateSelection(withKeyboardSupport(Calendar))} />;
  });

storiesOf('Internationalization', module)
  .add('Locale', () => (
    <InfiniteCalendar
      locale={{
        blank: 'Aucune date sélectionnée',
        headerFormat: 'dddd, D MMM',
        locale: require('date-fns/locale/fr'),
        todayLabel: {
          long: "Aujourd'hui",
          short: 'Auj.',
        },
        weekdays: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
      }}
    />
  ))
  .add('First Day of the Week', () => (
    <InfiniteCalendar
      locale={{
        weekStartsOn: 1,
      }}
    />
  ));

storiesOf('Customization', module)
  .add('Theming', () => (
    <InfiniteCalendar
      theme={{
        floatingNav: {
          background: 'rgba(105, 74, 228, 0.91)',
          chevron: '#FFA726',
          color: '#FFF',
        },
        headerColor: 'rgb(127, 95, 251)',
        selectionColor: 'rgb(146, 118, 255)',
        textColor: {
          active: '#FFF',
          default: '#333',
        },
        weekdayColor: 'rgb(146, 118, 255)',
      }}
    />
  ))
  .add('Flexible Size', () => (
    <InfiniteCalendar
      width={'94%'}
      height={window.innerHeight - 147}
      rowHeight={70}
    />
  ))
  .add('Select Year First', () => (
    <InfiniteCalendar display={'years'} selected={null} />
  ))
  .add('Dynamic Selection Color', () => (
    <InfiniteCalendar
      selected={addDays(today, -1)}
      theme={{
        selectionColor: date => {
          return isBefore(date, today) ? '#EC6150' : '#559FFF';
        },
      }}
    />
  ));

storiesOf('Display Options', module)
  .add('Landscape Layout', () => (
    <InfiniteCalendar
      displayOptions={{
        layout: 'landscape',
      }}
      width={600}
      height={350}
    />
  ))
  .add('Disable Header', () => (
    <InfiniteCalendar
      displayOptions={{
        showHeader: false,
      }}
    />
  ))
  .add('Disable Header Animation', () => (
    <InfiniteCalendar
      displayOptions={{
        shouldHeaderAnimate: false,
      }}
    />
  ))
  .add('Disable Month Overlay', () => (
    <InfiniteCalendar
      displayOptions={{
        showOverlay: false,
      }}
    />
  ))
  .add('Disable Floating Today Helper', () => (
    <InfiniteCalendar
      displayOptions={{
        showTodayHelper: false,
      }}
    />
  ))
  .add('Hide Months in Year Selection', () => (
    <InfiniteCalendar
      display={'years'}
      displayOptions={{
        showMonthsForYears: false,
      }}
    />
  ))
  .add('Hide Weekdays Helper', () => (
    <InfiniteCalendar
      displayOptions={{
        showWeekdays: false,
      }}
    />
  ));

storiesOf('Events', module)
  .add('On Select', () => (
    <InfiniteCalendar
      onSelect={date =>
        alert(`You selected: ${format(date, 'ddd, MMM Do YYYY')}`)}
    />
  ))
  .add('On Scroll', () => [
    <label key="label">Check your console logs.</label>,
    <InfiniteCalendar
      key="calendar"
      onScroll={scrollTop =>
        console.info('onScroll() – Scroll top:', scrollTop)}
    />,
  ]);
