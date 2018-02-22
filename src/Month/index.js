import React, {PureComponent} from 'react';
import classNames from 'classnames';
import {getDateString, getWeek} from '../utils';
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
import getISOWeek from 'date-fns/get_iso_week';
import startOfYear from 'date-fns/start_of_year';
import startOfWeek from 'date-fns/start_of_week';

export default class Month extends PureComponent {

    shouldComponentUpdate(nextProps, nextState) {
        const differentLastUpdate = nextProps.lastUpdate !== this.props.lastUpdate;
        const differentSelectionStart = nextProps.selected.start_time !== this.props.selected.start_time;
        const differentSelectionEnd = nextProps.selected.end_time !== this.props.selected.end_time;
        const differentSelectionDone = nextProps.passThrough.selectionDone !== this.props.passThrough.selectionDone;
        const differentUpdateFromController = nextProps.passThrough.updateFromController !== this.props.passThrough.updateFromController;
        return differentLastUpdate || differentSelectionStart || differentSelectionEnd || differentSelectionDone || differentUpdateFromController;
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
      min,
      max,
      rowHeight,
      rows,
      selected,
      miniCalendar,
      preselected,
      getDateOffset,
      today,
      passThrough,
    } = this.props;
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const monthRows = [];
    const lastDate = format(subDays(lastSelectableDate, 1), 'YYYY-MM-DD', {locale: locale.locale});
    let day = 0;
    let isDisabled = false;
    let nextDisabled = false;
    let beforeLastDisabled = false;
    let prevDisabled = false;
    let isToday = false;
    let dateDisabled = { date: null, type: null };
    let selectionArray = passThrough.selectionArray;
    let preselectedDates = passThrough.preselectedDates;
    let selectionType = passThrough.selectionType;
    let selectionDone = passThrough.selectionDone;
    let date, nextDate, prevDate, days, dow, nextdow, prevdow, row;
    let nextDateObject = null;
    let prevDateObject = null;
    let isoWeek = null;
    let weekNumber = null;
    let dayDow = 0;
    let absoluteMin = format(min, 'YYYY-MM-DD');
    let absoluteMax = format(max, 'YYYY-MM-DD');

    // Used for faster comparisons
    const _today = format(today, 'YYYY-MM-DD');
    const _minDate = format(minDate, 'YYYY-MM-DD');
    const _maxDate = format(maxDate, 'YYYY-MM-DD');
    const initialDisabledDatesArray = originalDisabledDates && originalDisabledDates[0] ? originalDisabledDates : [];


    let enabledDatesArray = preselected && preselected[0] ? preselected.map((dateObj) => ({ date: format(dateObj.start_time, 'YYYY-MM-DD'), type: 'preselect' })) : null;
    let reallyDisabledDatesArray = originalDisabledDates && originalDisabledDates[0] ? originalDisabledDates.filter((object) => (object.type === 'holiday' || object.type === 'no-reservation')) : [];

    if (selectionType === 'not_preselected') {
        reallyDisabledDatesArray = reallyDisabledDatesArray.concat(preselectedDates);
    } else if (selectionType === 'preselected' && enabledDatesArray != null && enabledDatesArray.length) {
        enabledDatesArray =  enabledDatesArray.concat(preselectedDates);

        if (selected && selected.start_time && isDate(lastSelectableDate) && isBefore(format(selected.start_time, 'YYYY-MM-DD'), lastDate)) {
            enabledDatesArray = enabledDatesArray.filter(function(date) {
                return isBefore(date.date, lastDate);
            });
        } else if (selected && selected.start_time && isDate(lastSelectableDate) && isBefore(lastDate, format(selected.start_time, 'YYYY-MM-DD'))) {
            enabledDatesArray = enabledDatesArray.filter(function(date) {
                return isBefore(lastDate, date.date);
            });
        }
    }

    for (let i = 0, len = rows.length; i < len; i++) {
      row = rows[i];
      days = [];
      dow = getDay(new Date(year, month, row[0]));
      dow === 0 ? dow = 7 : dow;
      weekNumber = null;

      for (let k = 0, len = row.length; k < len; k++) {
        dateDisabled = { date: null, type: null };
        day = row[k];
        nextDateObject = null;
        prevDateObject = null;
        date = getDateString(year, month, day);
        nextDate = format(addDays(date, 1), 'YYYY-MM-DD');
        prevDate = format(subDays(date, 1), 'YYYY-MM-DD');
        nextDateObject = {date: format(addDays(date, 1), 'YYYY-MM-DD'), type: 'holiday'};
        prevDateObject = {date: format(subDays(date, 1), 'YYYY-MM-DD'), type: 'holiday'};
        isToday = (date === _today);
        nextdow = dow + 1;
        prevdow = dow === 1 ? 7 : dow - 1;
        isoWeek = null;
        
        if (dow === 4) {
            isoWeek = getISOWeek(date);
            weekNumber = <div className={styles.weekNumber}> {isoWeek} </div>;
        }

        /*for (let x = 0, len = initialDisabledDatesArray.length; x < len; x++) {
            if (initialDisabledDatesArray[x].date === date) {
                isDateVacation = true;
                break;
            }
        }*/

        /*if (selectionType === 'none' || selectionType === 'not_preselected') {
            for (let j = 0, len = initialDisabledDatesArray.length; j < len; j++) {
                if (format(initialDisabledDatesArray[j].date, 'YYYY-MM-DD', {locale: locale.locale}) === format(date, 'YYYY-MM-DD') && initialDisabledDatesArray[j].type === 'holiday') {
                    dateDisabled = initialDisabledDatesArray[j];
                    break;
                }
            }
        } else if (selectionType === 'preselected') {
            for (let j = 0, len = enabledDatesArray.length; j < len; j++) {
                if (format(enabledDatesArray[j].date, 'YYYY-MM-DD', {locale: locale.locale}) === format(date, 'YYYY-MM-DD')) {
                    dateDisabled = enabledDatesArray[j];
                    break;
                }
            }
        }*/

        isDisabled = (
					minDate && date < _minDate ||
					maxDate && date > _maxDate ||
                    selectionArray.includes(format(date, 'YYYY-MM-DD')) ||
					disabledDays && disabledDays.length && disabledDays.indexOf(dow) !== -1 ||
                    //initialDisabledDatesArray && selectionType === 'none' && initialDisabledDatesArray.indexOf(dateDisabled) !== -1 ||
                    /*initialDisabledDatesArray && selectionType === 'not_preselected' &&
                    (
                        (
                        initialDisabledDatesArray.map((e) => { return e.date; }).indexOf(dateDisabled.date) !== -1
                        )
                    )
                    ||*/
                    initialDisabledDatesArray && selectionType === 'preselected' &&
                    (
                        (
                        isDate(lastSelectableDate) && isBefore(date, lastDate)
                        /*||
                        initialDisabledDatesArray.map((e) => { return {date: e.date, type: e.type}; }).indexOf(dateDisabled) !== -1*/
                        )
                    )
				);

        prevDisabled = (
					disabledDays && disabledDays.length && disabledDays.indexOf(prevdow) !== -1 ||
                    reallyDisabledDatesArray && reallyDisabledDatesArray.length && reallyDisabledDatesArray.map((e) => { return e.date; }).indexOf(prevDateObject.date) !== -1
				);

        nextDisabled = (
					disabledDays && disabledDays.length && disabledDays.indexOf(nextdow) !== -1 ||
                    reallyDisabledDatesArray && reallyDisabledDatesArray.length && reallyDisabledDatesArray.map((e) => { return e.date; }).indexOf(nextDateObject.date) !== -1
				);

        beforeLastDisabled = (
					isDate(lastSelectableDate) && isBefore(date, lastDate)
				);

        if (miniCalendar) {
            if (!isBefore(date, absoluteMin) && !isAfter(date, absoluteMax) && dow !== 6 && dow !== 7) {
                days[k] = (
        					<DayComponent
        						key={`day-${day}`}
        						date={date}
        						day={day}
                                originalDisabledDates={originalDisabledDates}
                                beforeLastDisabled={beforeLastDisabled}
                                selected={selected}
                                selectionArray={selectionArray}
                                preselected={preselected}
                                lastUpdate={lastUpdate}
                                nextDisabled={nextDisabled}
                                prevDisabled={prevDisabled}
        						isDisabled={isDisabled}
                                selectionType={selectionType}
        						isToday={isToday}
                                {...passThrough.Day}
        					/>
        				);

                
            }
            dow += 1;
        } else {
            days[k] = (
    					<DayComponent
    						key={`day-${day}`}
    						date={date}
    						day={day}
                            originalDisabledDates={originalDisabledDates}
                            beforeLastDisabled={beforeLastDisabled}
                            selected={selected}
                            selectionArray={selectionArray}
                            preselected={preselected}
                            lastUpdate={lastUpdate}
                            nextDisabled={nextDisabled}
                            prevDisabled={prevDisabled}
    						isDisabled={isDisabled}
                            selectionType={selectionType}
    						isToday={isToday}
                            {...passThrough.Day}
    					/>
    				);

            dow += 1;
        }

      }
       {days.length ?
      monthRows[i] = (
        
        <ul
          key={`Row-${i}`}
          className={classNames(styles.row, {[styles.partial]: row.length !== 7})}
          style={{height: rowHeight}}
          role="row"
          aria-label={`Week ${i + 1}`}
        >
          {!miniCalendar ? weekNumber : null}
          {days}
        </ul>
        
      )
      :
      null}

    }

    return monthRows;
  }

  render() {
    const {locale: {locale}, miniCalendar, monthDate, today, rows, rowHeight, style} = this.props;
    const dateFormat = isSameYear(monthDate, today) ? 'MMMM' : 'MMMM YYYY';
    const isCurrentMonth = isThisMonth(monthDate) && isThisYear(monthDate);

    return (
        <div className={styles.root} style={{...style, lineHeight: `${rowHeight}px`}}>
            {!miniCalendar ?
                <div className={classNames(styles.indicator, {[styles.indicatorCurrent] : isCurrentMonth })}>
                    <div className={styles.display}>
                        <span className="month">{format(monthDate, 'MMMM', {locale})}</span>
                        <span className="year">{format(monthDate, 'YYYY', {locale})}</span>
                    </div>
                </div>
            :
            null
            }
  		    <div className={classNames(styles.rows, {[styles.mini]: miniCalendar})}>
  				{this.renderRows()}
  		    </div>
  		</div>
    );
  }
}
