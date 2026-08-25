import clsx from 'clsx';
import styles from './Button.module.scss';
import React from 'react';
import PropTypes from 'prop-types';

Button.propTypes = {
  className: PropTypes.string,
  id: PropTypes.any,
  onClick: PropTypes.func,
  light: PropTypes.bool,
  dark: PropTypes.bool,
  highlight: PropTypes.bool,
  icon: PropTypes.bool,
  link: PropTypes.bool,
  disable: PropTypes.bool,
  small: PropTypes.bool,
  large: PropTypes.bool,
  textHighLight: PropTypes.bool,
  radius: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.string,
  backgroundColor: PropTypes.string,
  badge: PropTypes.number,
};
Button.defaultProps = {
  className: '',
  light: false,
  dark: false,
  highlight: false,
  icon: false,
  link: false,
  disable: false,
  small: false,
  large: false,
  textHighLight: false,
  radius: '',
  color: '',
  fontSize: '',
  backgroundColor: '',
  badge: null,
};

function Button(props) {
  const defaultClasses = props.className;
  return (
    <button
      className={clsx(
        styles.default,
        {
          [styles.light]: props.light,
          [styles.dark]: props.dark,
          [styles.highlight]: props.highlight,
          [styles.icon]: props.icon,
          [styles.disable]: props.disable,
          [styles.small]: props.small,
          [styles.large]: props.large,
          [styles.textHighLight]: props.textHighLight,
          [styles.link]: props.link,
        },
        defaultClasses,
      )}
      onClick={() => props.onClick(props.id)}
      style={{
        borderRadius: props.radius,
        color: props.color,
        fontSize: props.fontSize,
        backgroundColor: props.backgroundColor,
      }}
    >
      {props.children}
      {props.badge && <div className={styles.badge}>{props.badge}</div>}
    </button>
  );
}
export default Button;
