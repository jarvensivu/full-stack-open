import { useState, forwardRef, useImperativeHandle } from 'react'
import { Button } from '@mui/material'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button
          id="accept-button"
          variant="contained"
          color="primary"
          onClick={toggleVisibility}
          sx={{ mt: 2 }}
        >
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          id="cancel-button"
          variant="contained"
          color="warning"
          onClick={toggleVisibility}
          sx={{ mt: -12 }}
        >
          cancel
        </Button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

export default Togglable
