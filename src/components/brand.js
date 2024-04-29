import PropTypes from 'prop-types'
import apsLogo from '@images/aps-trans-logo.png'

const SIZES = {
  tiny: 40,
  small: 80,
  medium: 150,
  large: 200,
}

export const Brand = ({ size }) => {
  return (
    <a
      href="https://www.adcircprediction.org"
      target="_blank"
      rel="noreferrer noopener"
    >
      <img
        className="apsLogo"
        src={apsLogo}
        alt=""
        width={ SIZES?.[size] || SIZES.large }
      />
    </a>
  )  
}

Brand.propTypes = {
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large']),
}
