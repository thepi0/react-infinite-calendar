import {compose, withProps, withPropsOnChange, withState} from 'recompose';
import classNames from 'classnames';
import {withDefaultProps} from './';
import {withImmutableProps} from '../utils';
import isBefore from 'date-fns/is_before';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import isWithinRange from 'date-fns/is_within_range';
import enhanceHeader from '../Header/withRange';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import styles from '../Day/Day.scss';

let isTouchDevice = false;
let preSelectedSelected = false;

export const EVENT_TYPE = {
  END: 3,
  HOVER: 2,
  START: 1,
};

const PositionTypes = {
  START: 'START',
  RANGE: 'RANGE',
  END: 'END',
};

// Enhance Day component to display selected state based on an array of selected dates
export const enhanceDay = withPropsOnChange(['selected'], ({date, selected, preselected, theme}) => {
  const isSelected = date >= selected.start_time && date <= selected.end_time;
  const isStart = date === selected.start_time;
  const isEnd = date === selected.end_time;
  const isRange = !(isStart && isEnd);

  const positionOfDate = determineIfDateAlreadySelected(date, preselected);
  const isPreSelected = !!positionOfDate.value;
  const isPreStart = positionOfDate.value === PositionTypes.START;
  const isPreEnd = positionOfDate.value === PositionTypes.END;

  const isMultipleChildren = positionOfDate.count > 1;
  const isNextSelected = positionOfDate.nextselected;
  const isPrevSelected = positionOfDate.prevselected;

  const isNextPreSelected = positionOfDate.nextpreselected;
  const isPrevPreSelected = positionOfDate.prevpreselected;

  const isNextCountDifferent = positionOfDate.nextcountdifferentiates;
  const isPrevCountDifferent = positionOfDate.prevcountdifferentiates;

  const test1 = positionOfDate.nextpreselecteddifferentiates;

  const isPreSelectedValue = preSelectedSelected;

  const isNextPreDifferent = isNextPreSelected;
  const isPrevPreDifferent = isPrevPreSelected;

  const isPreselectedDate = positionOfDate.preselected ? positionOfDate.preselected : false;

  const dayClasses =
    isSelected && isRange && classNames(styles.range, {
      [styles.start]: isStart,
      [styles.betweenRange]: !isStart && !isEnd,
      [styles.end]: isEnd,
      [styles.multiple]: isMultipleChildren,
      [styles.single]: !isMultipleChildren,
      [styles.nextselected]: isNextSelected,
      [styles.prevselected]: isPrevSelected,
      [styles.nextdifferentiates]: isNextCountDifferent,
      [styles.prevdifferentiates]: isPrevCountDifferent,
      [styles.nextpreselected]: (isPreSelectedValue && isNextPreDifferent),
      [styles.prevpreselected]: (isPreSelectedValue && isPrevPreDifferent),
      [styles.nextnotpreselected]: (isPreSelectedValue && !isNextPreDifferent),
      [styles.prevnotpreselected]: (isPreSelectedValue && !isPrevPreDifferent),
    })
    ||
    isPreSelected && classNames(styles.range, {
      [styles.prestart]: isPreStart,
      [styles.preend]: isPreEnd,
      [styles.multiple]: isMultipleChildren,
      [styles.single]: !isMultipleChildren,
      [styles.nextselected]: isNextSelected,
      [styles.prevselected]: isPrevSelected,
      [styles.nextdifferentiates]: isNextCountDifferent,
      [styles.prevdifferentiates]: isPrevCountDifferent
    });

  return {
    className: dayClasses,
    isPreSelected,
    isSelected,
    isPreselectedDate
  };
});

// Enhancer to handle selecting and displaying multiple dates
export const withRange = compose(
  withDefaultProps,
  withState('scrollDate', 'setScrollDate', getInitialDate),
  withState('displayKey', 'setDisplayKey', getInitialDate),
  withState('selectionStart', 'setSelectionStart', null),
  withState('test2', 'setTest2', false),
  withState('test3', 'setTest3', false),
  withState('test4', 'setTest4', 'none'),
  withImmutableProps(({
    DayComponent,
    //HeaderComponent,
    //YearsComponent,
  }) => ({
    DayComponent: enhanceDay(DayComponent),
    //HeaderComponent: enhanceHeader(HeaderComponent),
  })),
  withProps(({displayKey, passThrough, selected, preselected, setDisplayKey, ...props}) => ({
    /* eslint-disable sort-keys */
    passThrough: {
      ...passThrough,
      Day: {
        onClick: (date, beforeLastDisabled, isPreSelected) => handleSelect(date, beforeLastDisabled, isPreSelected, {selected, preselected, ...props}),
        handlers: {
          onMouseOver: !isTouchDevice && props.selectionStart
            ? (e) => handleMouseOver(e, {selected, preselected, ...props})
            : null,
        },
      },
      test2: props.test2,
      test3: props.test3,
      test4: props.test4,
      /*Years: {
        selected: selected && selected[displayKey],
        onSelect: (date) => handleYearSelect(date, {displayKey, selected, ...props}),
    },
      Header: {
        onYearClick: (date, e, key) => setDisplayKey( key || 'start'),
      },
      */
    },
    preselected: handlePreselected(preselected),
    startDays: getStartDays(preselected),
    selected: {
      start_time: selected && format(selected.start_time, 'YYYY-MM-DD'),
      end_time: selected && format(selected.end_time, 'YYYY-MM-DD'),
    }
  })),
);

function getStartDays(preselected) {
    let returnable = preselected.map(dateObj => {
        return {
          start_time: dateObj.start_time,
          end_time: dateObj.end_time,
          child: dateObj.child
        };
    });

    const starts = [];

    returnable.forEach((day, idx) => {

        let dayStart = format(day.start_time, 'YYYY-MM-DD');

        if (!starts.includes(dayStart)) {
            starts.push(dayStart);
        }

    });

    return starts;
}

function handlePreselected(preselected) {
    let returnable = preselected.map(dateObj => {
        return {
          start_time: dateObj.start_time,
          end_time: dateObj.end_time,
          child: dateObj.child
        };
    });

    const days = [];
    const starts = [];

    returnable.forEach((day, idx) => {

        let dayStart = format(day.start_time, 'YYYY-MM-DD');
        let dayEnd = format(day.end_time, 'YYYY-MM-DD');
        let dayChild = day.child;

        let pushThis = {
            start_time: dayStart,
            end_time: dayEnd,
            child: day.child,
            original_start: day.start_time,
            original_end: day.end_time,
            count: 1,
            nextselected: false,
            prevselected: false,
            nextpreselected: false,
            prevpreselected: false,
            nextcountdifferentiates: false,
            prevcountdifferentiates: false,
            nextpreselecteddifferentiates: false,
            prevpreselecteddifferentiates: false,
            preselected: true
        }

        if (starts.includes(dayStart)) {

            pushThis.count += 1;

            for (var i = 0; i < days.length; i++) {
                if (days[i].start_time == dayStart) {
                    days[i].count += 1;
                }
            }
        }

        starts.push(dayStart);
        days.push(pushThis);

    });

    days.forEach((day, idx) => {

        let dayStart = format(day.start_time, 'YYYY-MM-DD');
        let nextDayStart = format(addDays(dayStart, 1), 'YYYY-MM-DD');
        let prevDayStart = format(subDays(dayStart, 1), 'YYYY-MM-DD');

        if (starts.includes(nextDayStart)) {
            day.nextselected = true;
            let nextday = days.filter(date => date.start_time === nextDayStart);

            if (nextday[0].count !== day.count) {
                day.nextcountdifferentiates = true;
            }

            if (nextday[0].preselected) {
                day.nextpreselected = true;
            }

            if (nextday[0].preselected !== day.preselected) {
                day.nextpreselecteddifferentiates = true;
            }
        }

        if (starts.includes(prevDayStart)) {
            day.prevselected = true;
            let prevday = days.filter(date => date.end_time === prevDayStart);

            if (prevday[0].count !== day.count) {
                day.prevcountdifferentiates = true;
            }

            if (prevday[0].preselected) {
                day.prevpreselected = true;
            }

            if (prevday[0].preselected !== day.preselected) {
                day.prevpreselecteddifferentiates = true;
            }
        }

    });

    return days;
}

function getSortedSelection({start_time, end_time}) {
  return isBefore(start_time, end_time)
    ? {start_time: start_time, end_time: end_time}
    : {start_time: end_time, end_time: start_time};
}

function handleSelect(date, beforeLastDisabled, isPreSelected, {onSelect, selected, preselected, test2, setTest2, test3, setTest3, test4, setTest4, selectionStart, setSelectionStart}) {

    if (!isPreSelected) {
        let returnable = preselected.map(dateObj => format(dateObj.start_time, 'YYYY-MM-DD'));
        setTest3(returnable);
        setTest4('not_preselected');
    } else {
        setTest3(false);
        setTest4('preselected');
    }

  if (selectionStart) {
    onSelect({
      eventType: EVENT_TYPE.END,
      ...getSortedSelection({
        start_time: selectionStart,
        end_time: date,
      }),
      before_last: beforeLastDisabled,
      selections: getPreselectedWithinRange(selectionStart, date, preselected),
      eventProp: 'click'
    });
    setSelectionStart(null);
    setTest2(false);
    preSelectedSelected = false;
    //setTest2(false);
    //preSelectedSelected = false;
} else {
    onSelect({
        eventType:EVENT_TYPE.START,
        start_time: date,
        end_time: date,
        before_last: beforeLastDisabled,
        //selections: getPreselectedWithinRange(date, date, preselected),
        eventProp: 'click'
    });
    setSelectionStart(date);
    if (isPreSelected) {
        setTest2(true);
        preSelectedSelected = true;
    } else {
        setTest2(false);
        preSelectedSelected = false;
    }

  }
}

function handleMouseOver(e, {onSelect, selectionStart, preselected}) {
  const dateStr = e.target.getAttribute('data-date');
  const date = dateStr && parse(dateStr);

  if (!date) { return; }

  onSelect({
    eventType: EVENT_TYPE.HOVER,
    ...getSortedSelection({
      start_time: selectionStart,
      end_time: date
    }),
    //selections: getPreselectedWithinRange(selectionStart, date, preselected),
    eventProp: 'hover'
});
}

function getPreselectedWithinRange(start_date, end_date, preselected) {
    const returnableDates = [];
    if (preSelectedSelected) {
        let startDate = format(start_date, 'YYYY-MM-DD');
        let endDate = format(end_date, 'YYYY-MM-DD');
        preselected.forEach((day, idx) => {
            let dayStart = format(day.start_time, 'YYYY-MM-DD');
            let withinRange = isBefore(startDate, endDate) ? isWithinRange(dayStart, startDate, endDate) : isWithinRange(dayStart, endDate, startDate);
            if (withinRange) {
                returnableDates.push(day);
            }
        });
    }
    return returnableDates;

}

function handleYearSelect(date, {displayKey, onSelect, selected, setScrollDate}) {

  setScrollDate(date);
  onSelect(getSortedSelection(
    Object.assign({}, selected, {[displayKey]: parse(date)}))
  );
}

function getInitialDate({selected, initialSelectedDate}) {
  return initialSelectedDate || selected && selected.start_time || new Date();
}

function determineIfDateAlreadySelected(date, selected) {
  let returnVal ={
    index: -1,
    value: '',
    count: 1,
    nextselected: false,
    prevselected: false,
    nextpreselected: false,
    nextcountdifferentiates: false,
    prevcountdifferentiates: false,
    nextpreselecteddifferentiates: false,
    prevpreselecteddifferentiates: false,
    preselected: false,
  };
  selected.forEach((dateObj, idx) => {
    if (date < dateObj.start_time || date > dateObj.end_time ) return;
    if (format(date, 'YYYY-MM-DD') === format(dateObj.start_time, 'YYYY-MM-DD')) {
      returnVal.value = PositionTypes.START;
      returnVal.index = idx;
      returnVal.count = dateObj.count;
      returnVal.nextselected = dateObj.nextselected;
      returnVal.prevselected = dateObj.prevselected;
      returnVal.nextpreselected = dateObj.nextpreselected;
      returnVal.prevpreselected = dateObj.prevpreselected;
      returnVal.nextcountdifferentiates = dateObj.nextcountdifferentiates;
      returnVal.prevcountdifferentiates = dateObj.prevcountdifferentiates;
      returnVal.nextpreselecteddifferentiates = dateObj.nextpreselecteddifferentiates;
      returnVal.prevpreselecteddifferentiates = dateObj.prevpreselecteddifferentiates;
      returnVal.preselected = dateObj.preselected;
      return;
    }
    if (format(date, 'YYYY-MM-DD') === format(dateObj.end_time, 'YYYY-MM-DD')) {
      returnVal.value = PositionTypes.END;
      returnVal.index = idx;
      returnVal.count = dateObj.count;
      returnVal.nextselected = dateObj.nextselected;
      returnVal.prevselected = dateObj.prevselected;
      returnVal.nextpreselected = dateObj.nextpreselected;
      returnVal.prevpreselected = dateObj.prevpreselected;
      returnVal.nextcountdifferentiates = dateObj.nextcountdifferentiates;
      returnVal.prevcountdifferentiates = dateObj.prevcountdifferentiates;
      returnVal.nextpreselecteddifferentiates = dateObj.nextpreselecteddifferentiates;
      returnVal.prevpreselecteddifferentiates = dateObj.prevpreselecteddifferentiates;
      returnVal.preselected = dateObj.preselected;
      return;
    }
    if (!returnVal.value) {
      returnVal.value = PositionTypes.RANGE;
      returnVal.index = idx;
      returnVal.count = dateObj.count;
      returnVal.nextselected = dateObj.nextselected;
      returnVal.prevselected = dateObj.prevselected;
      returnVal.nextpreselected = dateObj.nextpreselected;
      returnVal.prevpreselected = dateObj.prevpreselected;
      returnVal.nextcountdifferentiates = dateObj.nextcountdifferentiates;
      returnVal.prevcountdifferentiates = dateObj.prevcountdifferentiates;
      returnVal.nextpreselecteddifferentiates = dateObj.nextpreselecteddifferentiates;
      returnVal.prevpreselecteddifferentiates = dateObj.prevpreselecteddifferentiates;
      returnVal.preselected = dateObj.preselected;
      return;
    }
  });
  return returnVal;
}

if (typeof window !== 'undefined') {
  window.addEventListener('touchstart', function onTouch() {
    isTouchDevice = true;

    window.removeEventListener('touchstart', onTouch, false);
  });
}
