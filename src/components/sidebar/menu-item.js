import PropTypes from 'prop-types'
import {
  IconButton,
  ListItem,
  Tooltip,
} from '@mui/joy'

export const MenuItem = ({ Icon, title, onClick, active }) => {
  return (
    <ListItem>
      <Tooltip
        title={ title }
        placement="right"
        arrow
      >
        <IconButton
          size="lg"
          color="primary"
          variant={ active ? 'solid' : 'soft' }
          onClick={ onClick }
        >
          <Icon />
        </IconButton>
      </Tooltip>
    </ListItem>
  )
}

MenuItem.propTypes = {
  active: PropTypes.bool.isRequired,
  Icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

