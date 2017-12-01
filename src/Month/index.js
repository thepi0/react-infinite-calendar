import React, {PureComponent} from 'react';
import classNames from 'classnames';
import {getDateString} from '../utils';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import getDay from 'date-fns/get_day';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import isSameYear from 'date-fns/is_same_year';
import isThisMonth from 'date-fns/is_this_month';
import isThisYear from 'date-fns/is_this_year';
import styles from './Month.scss';

export default class Month extends PureComponent {
  renderRows() {
    const {
      DayComponent,
      disabledDates,
      disabledDays,
      monthDate,
      locale,
      maxDate,
      minDate,
      rowHeight,
      rows,
      selected,
      preselected,
      today,
      theme,
      passThrough,
    } = this.props;
    const currentYear = today.getFullYear();
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const monthShort = format(monthDate, 'MMM', {locale: locale.locale});
    const monthRows = [];
    let day = 0;
    let isDisabled = false;
    let nextDisabled = false;
    let prevDisabled = false;
    let nextSelected = false;
    let prevSelected= false;
    let isToday = false;
    let date, nextDate, prevDate, days, dow, nextdow, prevdow, row;

    // Used for faster comparisons
    const _today = format(today, 'YYYY-MM-DD');
    const _minDate = format(minDate, 'YYYY-MM-DD');
    const _maxDate = format(maxDate, 'YYYY-MM-DD');

    const disabledDatesArray = disabledDates && disabledDates[0] ? disabledDates.map((date) => format(parse(date.date), 'YYYY-MM-DD')) : disabledDates;

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
					disabledDatesArray && disabledDatesArray.length && disabledDatesArray.indexOf(date) !== -1
				);

        prevDisabled = (
					disabledDays && disabledDays.length && disabledDays.indexOf(prevdow) !== -1 ||
					disabledDatesArray && disabledDatesArray.length && disabledDatesArray.indexOf(prevDate) !== -1
				);

        nextDisabled = (
					disabledDays && disabledDays.length && disabledDays.indexOf(nextdow) !== -1 ||
					disabledDatesArray && disabledDatesArray.length && disabledDatesArray.indexOf(nextDate) !== -1
				);

        days[k] = (
					<DayComponent
						key={`day-${day}`}
						currentYear={currentYear}
						date={date}
						day={day}
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
    const {locale: {locale}, preselected, monthDate, today, rows, rowHeight, showOverlay, style, theme} = this.props;
    const dateFormat = isSameYear(monthDate, today) ? 'MMMM' : 'MMMM YYYY';
    const isCurrentMonth = isThisMonth(monthDate) && isThisYear(monthDate);

    /* TODO: remove this and above */
    // console.log(preselected);

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
  					{/*{showOverlay &&
  						<label
                className={classNames(styles.label, {
                  [styles.partialFirstRow]: rows[0].length !== 7,
                })}
                style={{backgroundColor: theme.overlayColor}}
              >
                <span>{format(monthDate, dateFormat, {locale})}</span>
              </label>
  					}*/}




  				</div>
  			</div>
    );
  }
}
