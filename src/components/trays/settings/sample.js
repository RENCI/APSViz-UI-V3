import { IconButton, Stack, Typography } from '@mui/joy'
import {
  CheckCircle as OnIcon,
  Cancel as OffIcon,
} from '@mui/icons-material'
import { usePreferences } from '@context'

export const SampleToggle = () => {
  const { booleanValue } = usePreferences()
  
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      gap={ 2 }
    >
      <Toggler />
      <div>
        <Typography level="title-md">
          Boolean Value <Typography variant="soft" color="primary">{
            booleanValue.enabled ? 'Enabled' : 'Disabled'
          }</Typography>
        </Typography>
        <Typography level="body-xs">
          Lorem ipsum labore voluptate irure labore sed adipisicing
          enim eiusmod nisi dolor pariatur enim culpa.
        </Typography>
      </div>
    </Stack>
  )
}

export const Toggler = () => {
  const { booleanValue } = usePreferences()

  const handleClick = () => {
    booleanValue.toggle()
  }

  return (
    <IconButton
      id="boolean-value-toggler"
      size="lg"
      onClick={ handleClick }
      variant="outlined"
    >
      {
        booleanValue.enabled
          ? <OnIcon color="primary" />
          : <OffIcon color="neutral" />
      }
    </IconButton>
  )
}
