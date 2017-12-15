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
export const enhanceDay = withPropsOnChange(['selected'], ({date, selected, preselected}) => {
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
  const isPreSelectedValue = preSelectedSelected;
  const isNextPreDifferent = isNextPreSelected;
  const isPrevPreDifferent = isPrevPreSelected;

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
    isSelected
  };
});

// Enhancer to handle selecting and displaying multiple dates
export const withRange = compose(
  withDefaultProps,
  withState('scrollDate', 'setScrollDate', getInitialDate),
  withState('displayKey', 'setDisplayKey', getInitialDate),
  withState('selectionStart', 'setSelectionStart', null),
  withState('preselectedDates', 'setPreselectedDates', false),
  withState('selectionType', 'setSelectionType', 'none'),
  withImmutableProps(({
    DayComponent,
  }) => ({
    DayComponent: enhanceDay(DayComponent),
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
      preselectedDates: props.preselectedDates,
      selectionType: props.selectionType,
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

    const starts = [];

    preselected = preselected ? preselected : [];

    for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
        let dayStart = format(preselected[i].start_time, 'YYYY-MM-DD');
        if (!starts.includes(dayStart)) {
            starts.push(dayStart);
        }
    }

    return starts;
}

function handlePreselected(preselected) {

    preselected = preselected ? preselected : [];

    const days = [];
    const starts = [];

    for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
        let dayStart = format(preselected[i].start_time, 'YYYY-MM-DD');
        let dayEnd = format(preselected[i].end_time, 'YYYY-MM-DD');
        let dayChild = preselected[i].child;

        let pushThis = {
            start_time: dayStart,
            end_time: dayEnd,
            child: preselected[i].child,
            original_start: preselected[i].start_time,
            original_end: preselected[i].end_time,
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

            for (var y = 0, dayy = days.length; y < dayy; ++y) {
                if (days[y].start_time == dayStart) {
                    days[y].count += 1;
                }
            }
        }

        starts.push(dayStart);
        days.push(pushThis);
    }

    for (var x = 0, day = days.length; x < day; ++x) {
        let dayStart = format(days[x].start_time, 'YYYY-MM-DD');
        let nextDayStart = format(addDays(dayStart, 1), 'YYYY-MM-DD');
        let prevDayStart = format(subDays(dayStart, 1), 'YYYY-MM-DD');

        if (starts.includes(nextDayStart)) {
            days[x].nextselected = true;
            let nextday = days.filter(date => date.start_time === nextDayStart);

            if (nextday[0].count !== days[x].count) {
                days[x].nextcountdifferentiates = true;
            }

            if (nextday[0].preselected) {
                days[x].nextpreselected = true;
            }

            if (nextday[0].preselected !== days[x].preselected) {
                days[x].nextpreselecteddifferentiates = true;
            }
        }

        if (starts.includes(prevDayStart)) {
            days[x].prevselected = true;
            let prevday = days.filter(date => date.end_time === prevDayStart);

            if (prevday[0].count !== days[x].count) {
                days[x].prevcountdifferentiates = true;
            }

            if (prevday[0].preselected) {
                days[x].prevpreselected = true;
            }

            if (prevday[0].preselected !== days[x].preselected) {
                days[x].prevpreselecteddifferentiates = true;
            }
        }
    }

    return days;
}

function getSortedSelection({start_time, end_time}) {
  return isBefore(start_time, end_time)
    ? {start_time: start_time, end_time: end_time}
    : {start_time: end_time, end_time: start_time};
}

function handleSelect(date, beforeLastDisabled, isPreSelected, {onSelect, selected, preselected, preselectedDates, setPreselectedDates, selectionType, setSelectionType, selectionStart, setSelectionStart}) {

    if (!isPreSelected) {
        if (preselected && preselected[0]) {
            let returnable = preselected.map(dateObj => format(dateObj.start_time, 'YYYY-MM-DD'));
            setPreselectedDates(returnable);
        }
        setSelectionType('not_preselected');
    } else {
        setPreselectedDates(false);
        setSelectionType('preselected');
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
} else {
    onSelect({
        eventType:EVENT_TYPE.START,
        start_time: date,
        end_time: date,
        before_last: beforeLastDisabled,
        eventProp: 'click'
    });
    setSelectionStart(date);
    if (isPreSelected) {
        preSelectedSelected = true;
    } else {
        preSelectedSelected = false;
    }

  }
}

let saveHoverDate;

function handleMouseOver(e, {onSelect, selectionStart, preselected}) {
  const dateStr = e.target.getAttribute('data-date');
  const date = dateStr && parse(dateStr);

  if (!date) { return; }

  if (saveHoverDate !== dateStr) {
      console.log('update selected from mousemovement');
      onSelect({
        eventType: EVENT_TYPE.HOVER,
        ...getSortedSelection({
          start_time: selectionStart,
          end_time: date
        }),
        eventProp: 'hover'
      });

      saveHoverDate = dateStr;
  }
}

function getPreselectedWithinRange(start_date, end_date, preselected) {
    const returnableDates = [];
    if (preSelectedSelected && preselected) {
        let startDate = format(start_date, 'YYYY-MM-DD');
        let endDate = format(end_date, 'YYYY-MM-DD');

        for (var i = 0, preselect = preselected.length; i < preselect; ++i) {
            let dayStart = format(preselected[i].start_time, 'YYYY-MM-DD');
            let withinRange = isBefore(startDate, endDate) ? isWithinRange(dayStart, startDate, endDate) : isWithinRange(dayStart, endDate, startDate);
            if (withinRange) {
                returnableDates.push(preselected[i]);
            }
        }
    }
    return returnableDates;

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

  let selected_date = date;
  let selected_array = selected;

  for (var i = 0, len = selected_array.length; i < len; ++i) {
    if (selected_date === selected_array[i].start_time) {
            returnVal.value = PositionTypes.START;
            returnVal.index = selected_array[i];
            returnVal.count = selected_array[i].count;
            returnVal.nextselected = selected_array[i].nextselected;
            returnVal.prevselected = selected_array[i].prevselected;
            returnVal.nextpreselected = selected_array[i].nextpreselected;
            returnVal.prevpreselected = selected_array[i].prevpreselected;
            returnVal.nextcountdifferentiates = selected_array[i].nextcountdifferentiates;
            returnVal.prevcountdifferentiates = selected_array[i].prevcountdifferentiates;
            returnVal.nextpreselecteddifferentiates = selected_array[i].nextpreselecteddifferentiates;
            returnVal.prevpreselecteddifferentiates = selected_array[i].prevpreselecteddifferentiates;
    }
  }

  return returnVal;
}

if (typeof window !== 'undefined') {
  window.addEventListener('touchstart', function onTouch() {
    isTouchDevice = true;

    window.removeEventListener('touchstart', onTouch, false);
  });
}
