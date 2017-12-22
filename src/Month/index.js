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
import isDate from 'date-fns/is_date';
import isSameYear from 'date-fns/is_same_year';
import isThisMonth from 'date-fns/is_this_month';
import isThisYear from 'date-fns/is_this_year';
import styles from './Month.scss';
import isWithinRange from 'date-fns/is_within_range';

export default class Month extends PureComponent {

    shouldComponentUpdate(nextProps, nextState) {
        const differentLastUpdate = nextProps.lastUpdate !== this.props.lastUpdate;
        const differentSelection = nextProps.selected !== this.props.selected;
        return differentLastUpdate || differentSelection;
    }

  renderRows() {
    const {
      DayComponent,
      disabledDates,
      originalDisabledDates,
      lastSelectableDate,
      disabledDays,
      monthDate,
      lastUpdate,
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
    let nextDateDisabled = null;
    let beforeLastDisabled = false;
    let prevDisabled = false;
    let nextSelected = false;
    let prevSelected= false;
    let isToday = false;
    let dateDisabled = null;
    let isDateVacation = false;
    let preselectedDates = passThrough.preselectedDates;
    let selectionType = passThrough.selectionType;
    let selectionDone = passThrough.selectionDone;
    let date, nextDate, prevDate, days, dow, nextdow, prevdow, row;

    let vacationType = null;

    let test = null;
    let test2 = null;

    /*console.log('MONTH.JS');
    console.log(lastDate);
    console.log(lastSelectableDate);*/

    //console.log('selected');
    //console.log(selected);

    // Used for faster comparisons
    const _today = format(today, 'YYYY-MM-DD');
    const _minDate = format(minDate, 'YYYY-MM-DD');
    const _maxDate = format(maxDate, 'YYYY-MM-DD');

    const initialDisabledDatesArray = originalDisabledDates && originalDisabledDates[0] ? originalDisabledDates : null;

    //console.log(preselected);

    let disabledDatesArray = originalDisabledDates && originalDisabledDates[0] ? originalDisabledDates : null;
    let enabledDatesArray = preselected && preselected[0] ? preselected.map((dateObj) => ({ date: format(dateObj.start_time, 'YYYY-MM-DD'), type: 'preselect' })) : null;

    //console.log(enabledDatesArray);

    if (selectionType === 'not_preselected' && disabledDatesArray != null && disabledDatesArray.length) {
        disabledDatesArray = disabledDatesArray.concat(preselectedDates);
    } else if (selectionType === 'preselected' && enabledDatesArray != null && enabledDatesArray.length) {
        enabledDatesArray =  enabledDatesArray.concat(preselectedDates);

        if (selected && selected.start_time && isDate(lastSelectableDate) && isBefore(selected.start_time, lastSelectableDate)) {
            enabledDatesArray = enabledDatesArray.filter(function(date) {
                return isBefore(date.date, lastDate);
            });
        } else if (selected && selected.start_time && isDate(lastSelectableDate) && isBefore(lastSelectableDate, selected.start_time)) {
            enabledDatesArray = enabledDatesArray.filter(function(date) {
                return isBefore(lastDate, date.date);
            });
        }
    } else {
        disabledDatesArray = disabledDatesArray;
    }

    //console.log(initialDisabledDatesArray);
    //console.log(disabledDatesArray);
    //console.log(enabledDatesArray);

		// Oh the things we do in the name of performance...
    for (let i = 0, len = rows.length; i < len; i++) {
      row = rows[i];
      days = [];
      dow = getDay(new Date(year, month, row[0]));

      for (let k = 0, len = row.length; k < len; k++) {
        isDateVacation = false;
        dateDisabled = null;
        day = row[k];
        nextDateDisabled = null;
        vacationType = null;

        test = null;
        test2 = null;

        date = getDateString(year, month, day);
        nextDate = format(addDays(date, 1), 'YYYY-MM-DD');
        prevDate = format(subDays(date, 1), 'YYYY-MM-DD');
        test = {date: format(addDays(date, 1), 'YYYY-MM-DD'), type: 'holiday'};
        test2 = {date: format(subDays(date, 1), 'YYYY-MM-DD'), type: 'holiday'};
        isToday = (date === _today);
        nextdow = dow + 1;
        prevdow = dow === 1 ? 7 : dow - 1;

        for (let x = 0, len = initialDisabledDatesArray.length; x < len; x++) {
            if (format(initialDisabledDatesArray[x].date, 'YYYY-MM-DD', {locale: locale.locale}) === format(date, 'YYYY-MM-DD') && initialDisabledDatesArray[x].type === 'vacation') {
                isDateVacation = true;
            }
        }

        if (selectionType === 'none' || selectionType === 'not_preselected') {
            for (let j = 0, len = initialDisabledDatesArray.length; j < len; j++) {
                if (format(initialDisabledDatesArray[j].date, 'YYYY-MM-DD', {locale: locale.locale}) === format(date, 'YYYY-MM-DD') && initialDisabledDatesArray[j].type === 'holiday') {
                    dateDisabled = initialDisabledDatesArray[j];
                    vacationType = initialDisabledDatesArray[j].type;
                }
            }
        } else if (selectionType === 'preselected') {
            for (let j = 0, len = enabledDatesArray.length; j < len; j++) {
                if (format(enabledDatesArray[j].date, 'YYYY-MM-DD', {locale: locale.locale}) === format(date, 'YYYY-MM-DD')) {
                    dateDisabled = enabledDatesArray[j];
                    vacationType = enabledDatesArray[j].type;
                }
            }
        }

        isDisabled = (
					minDate && date < _minDate ||
					maxDate && date > _maxDate ||
					disabledDays && disabledDays.length && disabledDays.indexOf(dow) !== -1 ||
                    initialDisabledDatesArray && selectionType === 'none' && initialDisabledDatesArray.indexOf(dateDisabled) !== -1 ||
					disabledDatesArray && selectionType === 'not_preselected' && (disabledDatesArray.indexOf(dateDisabled) !== -1 || initialDisabledDatesArray.indexOf(dateDisabled) !== -1) ||
                    enabledDatesArray && selectionType === 'preselected' && (enabledDatesArray.indexOf(dateDisabled) === -1 || initialDisabledDatesArray.indexOf(dateDisabled) !== -1) //||
                    //selectionDone && selected && selected.start_time && selected.end_time && !isWithinRange(date, selected.start_time, selected.end_time)
				);

        prevDisabled = (
					disabledDays && disabledDays.length && disabledDays.indexOf(prevdow) !== -1 ||
					disabledDatesArray && disabledDatesArray.length && disabledDatesArray.includes(test2)
				);

                //console.log(nextDateDisabled);
                //console.log(disabledDatesArray);

                console.log('----- day stuff -----');
                console.log(date);
                console.log(disabledDatesArray);
                console.log(test);


        nextDisabled = (
					disabledDays && disabledDays.length && disabledDays.indexOf(nextdow) !== -1 ||
					disabledDatesArray && disabledDatesArray.length && disabledDatesArray.includes(test)
				);

        beforeLastDisabled = (
					isDate(lastSelectableDate) && isBefore(date, lastDate)
				);

        days[k] = (
					<DayComponent
						key={`day-${day}`}
						currentYear={currentYear}
						date={date}
						day={day}
                        vacationType={vacationType}
                        isVacation={isDateVacation}
                        disabledDays={enabledDatesArray}
                        originalDisabledDates={originalDisabledDates}
                        beforeLastDisabled={beforeLastDisabled}
                        selected={selected}
                        preselected={preselected}
                        nextDateDisabled={nextDateDisabled}
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
