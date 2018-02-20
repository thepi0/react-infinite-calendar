import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import parse from 'date-fns/parse';
import styles from './Day.scss';

export default class Day extends PureComponent {

  handleClick = () => {
    let {date, beforeLastDisabled, isDisabled, isPreSelected, onClick, onClear, selectionType, originalDisabledDates} = this.props;

    var fromTop = ReactDOM.findDOMNode(this)
      .getBoundingClientRect().top;

    if ((isDisabled && selectionType === 'preselected' && !isPreSelected) || (isDisabled && selectionType === 'not_preselected' && isPreSelected) || (beforeLastDisabled && !isPreSelected) || (!isPreSelected && selectionType === 'preselected') || (isPreSelected && selectionType === 'not_preselected')) {
      onClear();
  } else if (typeof onClick === 'function') {
      onClick(parse(date), beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop);
    }
  };

  handleTouchStart = () => {
    let {date, beforeLastDisabled, isDisabled, isPreSelected, onTouchStart, onClear, selectionType, originalDisabledDates} = this.props;

    var fromTop = ReactDOM.findDOMNode(this)
      .getBoundingClientRect().top;

    if ((isDisabled && selectionType === 'preselected' && !isPreSelected) || (isDisabled && selectionType === 'not_preselected' && isPreSelected) || (beforeLastDisabled && !isPreSelected) || (!isPreSelected && selectionType === 'preselected') || (isPreSelected && selectionType === 'not_preselected')) {
      onClear();
  } else if (typeof onTouchStart === 'function') {
      onTouchStart(parse(date), beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop);
    }
  };

  handleTouchEnd = () => {
    let {date, beforeLastDisabled, isDisabled, isPreSelected, onTouchEnd, onClear, selectionType, originalDisabledDates} = this.props;

    var fromTop = ReactDOM.findDOMNode(this)
      .getBoundingClientRect().top;

    if ((isDisabled && selectionType === 'preselected' && !isPreSelected) || (isDisabled && selectionType === 'not_preselected' && isPreSelected) || (beforeLastDisabled && !isPreSelected) || (!isPreSelected && selectionType === 'preselected') || (isPreSelected && selectionType === 'not_preselected')) {
      onClear();
  } else if (typeof onTouchEnd === 'function') {
      onTouchEnd(parse(date), beforeLastDisabled, isPreSelected, originalDisabledDates, fromTop);
    }
  };

  getDayColors = (date, preselected) => {
      if (!preselected || !preselected.length) {
          return;
      }

      let returnable = {
          purple: false,
          blue: false,
          green: false,
          orange: false
      };

      const classes = {
          '#ca569a': 'purple',
          '#2cb1d8': 'blue',
          '#85bd4c': 'green',
          '#ea992f': 'orange'
      }

      for (var j = 0, len = preselected.length; j < len; ++j) {
          if (date === preselected[j].start_time) {
              for (var x = 0, col = preselected[j].colors.length; x < col; ++x) {
                  returnable[classes[preselected[j].colors[x]]] = true;
              }
              break;
          }
      }

      return returnable;
  };

  renderSelection(selectionColor) {
    const {
      day,
      date,
      isToday,
      isDisabled
    } = this.props;

    return (
      <div
        className={styles.selection}
        data-date={date}
        data-disabled={isDisabled ? isDisabled : false}
      >
      </div>
    );
  }

  render() {
    const {
      className,
      date,
      day,
      beforeLastDisabled,
      originalDisabledDates,
      handlers,
      isVacation,
      selected,
      preselected,
      isDisabled,
      isToday,
      isSelected,
      isArraySelected,
      isPreSelected,
      selectionType,
      prevDisabled,
      nextDisabled,
      monthShort,
      isWeekend,
      vacationObject
    } = this.props;

    let colors = isPreSelected ? this.getDayColors(date, preselected) : {
        purple: false,
        blue: false,
        green: false,
        orange: false
    };

    return (
      <li
        className={classNames(styles.root, {
          [styles.today]: isToday,
          [styles.selected]: isSelected || isArraySelected,
          [styles.preselected]: isPreSelected,
          [styles.prevdisabled]: prevDisabled,
          [styles.nextdisabled]: nextDisabled,
          [styles.disabled]: isDisabled || (beforeLastDisabled && !isPreSelected) || (!isPreSelected && selectionType === 'preselected') || (isPreSelected && selectionType === 'not_preselected'),
          [styles.holiday]: (vacationObject.vacation === true && vacationObject.vacation_type === 'holiday'),
          [styles.enabled]: !isDisabled,
          [styles.beforelast]: beforeLastDisabled,
          [styles.purple]: (isPreSelected && colors.purple),
          [styles.blue]: (isPreSelected && colors.blue),
          [styles.green]: (isPreSelected && colors.green),
          [styles.orange]: (isPreSelected && colors.orange),
          [styles.weekend]: isWeekend,
          [styles.preselecteddisabled]: isPreSelected && selectionType === 'not_preselected',
          [styles.preselectedenabled]: !isPreSelected && selectionType === 'preselected'
      }, className)}
        onClick={this.handleClick}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        data-date={date}
        data-disabled={isDisabled || (beforeLastDisabled && !isPreSelected) || (!isPreSelected && selectionType === 'preselected') || (isPreSelected && selectionType === 'not_preselected') ? true : false}
        {...handlers}
      >
        {day}
        {isVacation ? <div className={styles.vacationCircle}></div> : null}
        {(isSelected || isArraySelected) && this.renderSelection()}
      </li>
    );
  }
}
