import React, {PureComponent} from 'react';
import classNames from 'classnames';
import {getDateString} from '../utils';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import getDay from 'date-fns/get_day';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import isBefore from 'date-fns/is_before';
import isAfter from 'date-fns/is_after';
import isSameYear from 'date-fns/is_same_year';
import isThisMonth from 'date-fns/is_this_month';
import isThisYear from 'date-fns/is_this_year';
import styles from './Month.scss';

export default class Month extends PureComponent {

  renderRows() {
    const {
      DayComponent,
      disabledDates,
      originalDisabledDates,
      lastSelectableDate,
      disabledDays,
      monthDate,
      locale,
      maxDate,
      minDate,
      rowHeight,
      rows,
      selected,
      preselected,
      startDays,
      today,
      theme,
      passThrough,
    } = this.props;
    const currentYear = today.getFullYear();
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const monthShort = format(monthDate, 'MMM', {locale: locale.locale});
    const monthRows = [];
    const lastDate = format(lastSelectableDate, 'YYYY-MM-DD', {locale: locale.locale});
    let day = 0;
    let isDisabled = false;
    let nextDisabled = false;
    let beforeLastDisabled = false;
    let prevDisabled = false;
    let nextSelected = false;
    let prevSelected= false;
    let isToday = false;
    let preselectedDates = passThrough.preselectedDates;
    let selectionType = passThrough.selectionType;
    let date, nextDate, prevDate, days, dow, nextdow, prevdow, row;

    // Used for faster comparisons
    const _today = format(today, 'YYYY-MM-DD');
    const _minDate = format(minDate, 'YYYY-MM-DD');
    const _maxDate = format(maxDate, 'YYYY-MM-DD');

    const initialDisabledDatesArray = originalDisabledDates && originalDisabledDates[0] ? originalDisabledDates.map((date) => format(parse(date.date), 'YYYY-MM-DD')) : null;

    let disabledDatesArray = originalDisabledDates && originalDisabledDates[0] ? originalDisabledDates.map((date) => format(parse(date.date), 'YYYY-MM-DD')) : null;
    let enabledDatesArray = preselected && preselected[0] ? preselected.map((date) => format(parse(date.start_time), 'YYYY-MM-DD')) : null;

    if (selectionType === 'not_preselected' && disabledDatesArray != null && disabledDatesArray.length) {
        disabledDatesArray = disabledDatesArray.concat(preselectedDates);
    } else if (selectionType === 'preselected' && enabledDatesArray != null && enabledDatesArray.length) {
        if (selected && selected.start_time && lastSelectableDate && lastSelectableDate.length && isBefore(selected.start_time, lastSelectableDate)) {
            enabledDatesArray = enabledDatesArray.filter(function(date) {
                return isBefore(date, lastSelectableDate);
            });
        } else if (selected && selected.start_time && lastSelectableDate && lastSelectableDate.length && isBefore(lastSelectableDate, selected.start_time)) {
            enabledDatesArray = enabledDatesArray.filter(function(date) {
                return isBefore(lastSelectableDate, date);
            });
        }
        enabledDatesArray =  enabledDatesArray.concat(preselectedDates);
    } else {
        disabledDatesArray = disabledDatesArray;
    }

		// Oh the things we do in the name of performance...
    for (let i = 0, len = rows.length; i < len; i++) {
      row = rows[i];
      days = [];
      dow = getDay(new Date(year, month, row[0]));

      for (let k = 0, len = row.length; k < len; k++) {
        day = row[k];

        date = getDateString(year, month, day);
        nextDate = format(addDays(date, 1), 'YYYY-MM-DD');
        prevDate = format(subDays(date, 1), 'YYYY-MM-DD');
        isToday = (date === _today);
        nextdow = dow + 1;
        prevdow = dow === 1 ? 7 : dow - 1;

        isDisabled = (
					minDate && date < _minDate ||
					maxDate && date > _maxDate ||
					disabledDays && disabledDays.length && disabledDays.indexOf(dow) !== -1 ||
                    initialDisabledDatesArray && selectionType === 'none' && initialDisabledDatesArray.indexOf(date) !== -1 ||
					disabledDatesArray && selectionType === 'not_preselected' && (disabledDatesArray.indexOf(date) !== -1 || initialDisabledDatesArray.indexOf(date) !== -1) ||
                    enabledDatesArray && selectionType === 'preselected' && (enabledDatesArray.indexOf(date) === -1 || initialDisabledDatesArray.indexOf(date) !== -1)
				);

        prevDisabled = (
					disabledDays && disabledDays.length && disabledDays.indexOf(prevdow) !== -1 ||
					disabledDatesArray && disabledDatesArray.length && disabledDatesArray.indexOf(prevDate) !== -1
				);

        nextDisabled = (
					disabledDays && disabledDays.length && disabledDays.indexOf(nextdow) !== -1 ||
					disabledDatesArray && disabledDatesArray.length && disabledDatesArray.indexOf(nextDate) !== -1
				);

        beforeLastDisabled = (
					lastSelectableDate && lastSelectableDate.length && isBefore(date, lastDate)
				);

        days[k] = (
					<DayComponent
						key={`day-${day}`}
						currentYear={currentYear}
						date={date}
						day={day}
                        originalDisabledDates={originalDisabledDates}
                        beforeLastDisabled={beforeLastDisabled}
                        lastDisabled={lastDate}
                        selected={selected}
                        preselected={preselected}
                        nextDisabled={nextDisabled}
                        prevDisabled={prevDisabled}
						isDisabled={isDisabled}
						isToday={isToday}
						locale={locale}
                        month={month}
                        monthShort={monthShort}
						theme={theme}
                        year={year}
                        {...passThrough.Day}
					/>
				);

        dow += 1;
      }
      monthRows[i] = (
        <ul
          key={`Row-${i}`}
          className={classNames(styles.row, {[styles.partial]: row.length !== 7})}
          style={{height: rowHeight}}
          role="row"
          aria-label={`Week ${i + 1}`}
        >
          {days}
        </ul>
      );

    }

    return monthRows;
  }

  render() {
    const {locale: {locale}, monthDate, today, rows, rowHeight, style} = this.props;
    const dateFormat = isSameYear(monthDate, today) ? 'MMMM' : 'MMMM YYYY';
    const isCurrentMonth = isThisMonth(monthDate) && isThisYear(monthDate);

    return (
        <div className={styles.root} style={{...style, lineHeight: `${rowHeight}px`}}>
            <div className={classNames(styles.indicator, {[styles.indicatorCurrent] : isCurrentMonth })}>
                <div className={styles.display}>
                    <span className="month">{format(monthDate, 'MMMM', {locale})}</span>
                    <span className="year">{format(monthDate, 'YYYY', {locale})}</span>
                </div>
            </div>
  		    <div className={styles.rows}>
  				{this.renderRows()}
  		    </div>
  		</div>
    );
  }
}
