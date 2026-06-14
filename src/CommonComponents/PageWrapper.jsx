import React, { memo } from 'react'
import { Box } from '@mui/joy'

const PageWrapper = ({ children, sx = {} }) => {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0, // prevents sidebar break
        bgcolor: '#ffffff',
        borderRadius: 12,
        boxShadow: 'sm',
        p: 2,
        boxSizing: 'border-box',
        height: '100%',
        position: 'relative',
        overflowY: 'auto',
        ...sx // allow custom overrides
      }}
    >
      {children}
    </Box>
  )
}

export default memo(PageWrapper)