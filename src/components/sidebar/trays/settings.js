import { Card, Stack } from '@mui/joy'
import { Tune as SettingsIcon } from '@mui/icons-material'

export const icon = <SettingsIcon />

export const title = 'Settings'

export const tray = (
  <Stack gap={ 2 }>
    {
      [...Array(3).keys()].map(i => (
        <Card
          key={ `setting-card-${ i }` }
          variant="soft"
          sx={{ height: `200px` }}
        >
          settings card { i }
        </Card>
      ))
    }
  </Stack>
)
