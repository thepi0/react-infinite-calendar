import {compose, withProps, withPropsOnChange, withState} from 'recompose';
import classNames from 'classnames';
import {withDefaultProps} from './';
import {withImmutableProps} from '../utils';
import isBefore from 'date-fns/is_before';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import enhanceHeader from '../Header/withRange';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import styles from '../Day/Day.scss';

let isTouchDevice = false;

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
  const style = isRange && (
    isStart && {backgroundColor: theme.accentColor} ||
    isEnd && {borderColor: theme.accentColor}
  );

  const positionOfDate = determineIfDateAlreadySelected(date, preselected);
  const isPreSelected = !!positionOfDate.value;
  const isPreStart = positionOfDate.value === PositionTypes.START;
  const isPreEnd = positionOfDate.value === PositionTypes.END;

  const isMultipleChildren = positionOfDate.count > 1;
  const isNextSelected = positionOfDate.nextselected;
  const isPrevSelected = positionOfDate.prevselected;

  const dayClasses =
    isSelected && isRange && classNames(styles.range, {
      [styles.start]: isStart,
      [styles.betweenRange]: !isStart && !isEnd,
      [styles.end]: isEnd,
    })
    ||
    isPreSelected && classNames(styles.range, {
      [styles.prestart]: isPreStart,
      [styles.preend]: isPreEnd,
      [styles.multiple]: isMultipleChildren,
      [styles.nextselected]: isNextSelected,
      [styles.prevselected]: isPrevSelected
    });

  return {
    className: dayClasses,
    isPreSelected,
    isSelected,
    selectionStyle: style,
  };
});

// Enhancer to handle selecting and displaying multiple dates
export const withRange = compose(
  withDefaultProps,
  withState('scrollDate', 'setScrollDate', getInitialDate),
  withState('displayKey', 'setDisplayKey', getInitialDate),
  withState('selectionStart', 'setSelectionStart', null),
  withImmutableProps(({
    DayComponent,
    HeaderComponent,
    YearsComponent,
  }) => ({
    DayComponent: enhanceDay(DayComponent),
    HeaderComponent: enhanceHeader(HeaderComponent),
  })),
  withProps(({displayKey, passThrough, selected, preselected, setDisplayKey, ...props}) => ({
    /* eslint-disable sort-keys */
    passThrough: {
      ...passThrough,
      Day: {
        onClick: (date) => handleSelect(date, {selected, ...props}),
        handlers: {
          onMouseOver: !isTouchDevice && props.selectionStart
            ? (e) => handleMouseOver(e, {selected, ...props})
            : null,
        },
      },
      Years: {
        selected: selected && selected[displayKey],
        onSelect: (date) => handleYearSelect(date, {displayKey, selected, ...props}),
      },
      Header: {
        onYearClick: (date, e, key) => setDisplayKey( key || 'start'),
      },
    },
    preselected: handlePreselected(preselected),
    startDays: getStartDays(preselected),
    selected: {
      start_time: selected && format(selected.start_time, 'YYYY-MM-DD'),
      end_time: selected && format(selected.end_time, 'YYYY-MM-DD'),
    },
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
            prevselected: false
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
        }

        if (starts.includes(prevDayStart)) {
            day.prevselected = true;
        }
    });

    return days;
}

function getSortedSelection({start_time, end_time}) {
  return isBefore(start_time, end_time)
    ? {start_time, end_time}
    : {start_time: end_time, end_time: start_time};
}

function handleSelect(date, {onSelect, selected, selectionStart, setSelectionStart}) {
  if (selectionStart) {
    onSelect({
      eventType: EVENT_TYPE.END,
      ...getSortedSelection({
        start_time: selectionStart,
        end_time: date,
      }),
    });
    setSelectionStart(null);
  } else {
    onSelect({eventType:EVENT_TYPE.START, start_time: date, end_time: date});
    setSelectionStart(date);
  }
}

function handleMouseOver(e, {onSelect, selectionStart}) {
  const dateStr = e.target.getAttribute('data-date');
  const date = dateStr && parse(dateStr);

  if (!date) { return; }

  onSelect({
    eventType: EVENT_TYPE.HOVER,
    ...getSortedSelection({
      start_time: selectionStart,
      end_time: date,
    }),
  });
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
    prevselected: false
  };
  selected.forEach((dateObj, idx) => {
    if (date < dateObj.start_time || date > dateObj.end_time ) return;
    if (format(date, 'YYYY-MM-DD') === format(dateObj.start_time, 'YYYY-MM-DD')) {
      returnVal.value = PositionTypes.START;
      returnVal.index = idx;
      returnVal.count = dateObj.count;
      returnVal.nextselected = dateObj.nextselected;
      returnVal.prevselected = dateObj.prevselected;
      return;
    }
    if (format(date, 'YYYY-MM-DD') === format(dateObj.end_time, 'YYYY-MM-DD')) {
      returnVal.value = PositionTypes.END;
      returnVal.index = idx;
      returnVal.count = dateObj.count;
      returnVal.nextselected = dateObj.nextselected;
      returnVal.prevselected = dateObj.prevselected;
      return;
    }
    if (!returnVal.value) {
      returnVal.value = PositionTypes.RANGE;
      returnVal.index = idx;
      returnVal.count = dateObj.count;
      returnVal.nextselected = dateObj.nextselected;
      returnVal.prevselected = dateObj.prevselected;
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
