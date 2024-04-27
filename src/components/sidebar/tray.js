import PropTypes from 'prop-types'
import {
  DialogContent,
  DialogTitle,
  Divider,
  Sheet,
} from '@mui/joy'

export const Tray = ({ active, contents, title }) => {
  return (
    <Sheet
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        transform: active ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 250ms',
        height: '100vh',
        width: '400px',
        zIndex: 998,
        pl: '68px',
        filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))',
        overflowX: 'hidden',
        overflowY: 'auto',
        "> .tray-title": { p: 2 },
        "> .tray-contents": { p: 2 },
      }}
    >
      <DialogTitle className="tray-title">
        { title }
      </DialogTitle>

      <Divider />

      <DialogContent className="tray-contents">
        { contents }
      </DialogContent>
    </Sheet>
  )
}

Tray.propTypes = {
  active: PropTypes.bool.isRequired,
  contents: PropTypes.node,
  title: PropTypes.string,
}
