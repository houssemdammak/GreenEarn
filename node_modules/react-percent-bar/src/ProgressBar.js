import React from 'react';

/**
 * ProgressBar react component
 *
 * @param {Object} props
 * @param {String|Number} props.percent
 * @param {String} props.height
 * @param {String} props.width
 * @param {String} props.radius
 * @param {String} props.borderColor
 * @param {String} props.fillColor
 * @param {Boolean} props.colorShift
 *
 * @returns {React component}
 */

export const ProgressBar = ({
  percent,
  height = '20px',
  width = '350px',
  radius = '50px',
  borderColor = '#eee',
  fillColor = 'lime',
  colorShift = false
}) => {
  return (
    <div
      style={{
        height,
        width,
        borderRadius: radius,
        border: `1px solid ${borderColor}`
      }}>
      <div
        style={{
          width: `${percent}%`,
          height: '100%',
          borderRadius: 'inherit',
          backgroundColor: fillColor,
          transition: 'all .2s ease',
          [colorShift ? 'filter' : null]: `hue-rotate(-${percent}deg)`
        }}
      />
    </div>
  );
};
