import React, {PureComponent} from 'react';
import classNames from 'classnames';
import parse from 'date-fns/parse';
import styles from './Day.scss';

export default class Day extends PureComponent {

  handleClick = () => {
    let {date, beforeLastDisabled, isDisabled, isPreSelected, onClick, onClear, originalDisabledDates} = this.props;

    if (isDisabled) {
      onClear();
    } else if (!(beforeLastDisabled && !isPreSelected) && !isDisabled && typeof onClick === 'function') {
      onClick(parse(date), beforeLastDisabled, isPreSelected, originalDisabledDates);
    }
  };

  /*handleMouseDown = () => {
      let {date, beforeLastDisabled, isDisabled, isPreSelected, onMouseDown, originalDisabledDates} = this.props;

      if (!(beforeLastDisabled && !isPreSelected) && !isDisabled && typeof onMouseDown === 'function') {
        onMouseDown(parse(date), beforeLastDisabled, isPreSelected, originalDisabledDates);
      }
  };*/

  getDayColors = () => {
      const {
        date,
        preselectedColors,
        isPreSelected
      } = this.props;

      if (!isPreSelected || !preselectedColors.length) {
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

      for (var j = 0, len = preselectedColors.length; j < len; ++j) {
          if (date === preselectedColors[j].date) {
              for (var x = 0, col = preselectedColors[j].colors.length; x < col; ++x) {
                  returnable[classes[preselectedColors[j].colors[x]]] = true;
              }
          }
      }

      return returnable;
  }

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
      preselectedColors,
      isDisabled,
      isHighlighted,
      isToday,
      isSelected,
      isPreSelected,
      prevDisabled,
      nextDisabled,
      monthShort,
    } = this.props;

    let colors = isPreSelected ? this.getDayColors() : {
        purple: false,
        blue: false,
        green: false,
        orange: false
    };

    return (
      <li
        className={classNames(styles.root, {
          [styles.today]: isToday,
          [styles.highlighted]: isHighlighted,
          [styles.selected]: isSelected,
          [styles.preselected]: isPreSelected,
          [styles.prevdisabled]: prevDisabled,
          [styles.nextdisabled]: nextDisabled,
          [styles.disabled]: isDisabled || (beforeLastDisabled && !isPreSelected),
          [styles.enabled]: !isDisabled,
          [styles.beforelast]: beforeLastDisabled,
          [styles.purple]: (isPreSelected && colors.purple),
          [styles.blue]: (isPreSelected && colors.blue),
          [styles.green]: (isPreSelected && colors.green),
          [styles.orange]: (isPreSelected && colors.orange)
      }, className)}
        onClick={this.handleClick}
        data-date={date}
        data-disabled={isDisabled ? isDisabled : false}
        {...handlers}
      >
        {day}
        {!beforeLastDisabled && isVacation ? <div className={styles.vacationCircle}></div> : null}
        {isSelected && this.renderSelection()}
      </li>
    );
  }
}
