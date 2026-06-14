import { Box, Typography } from '@mui/joy'
import { memo, useEffect, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person'
import AccessTimeIcon from '@mui/icons-material/AccessTime'




const ReusableTopBar = ({
    title = "Dashboard",
    leftIcon: LeftIcon,
    userName = "User",
    showClock = true,
    showMood = true,
    background = '#fffdfd',
    Department
}) => {

    const [time, setTime] = useState(new Date())

    // Live Clock
    useEffect(() => {
        if (!showClock) return

        const timer = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [showClock])



    return (
        <Box
            sx={{
                height: 55,
                px: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: background,
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 10px 15px rgba(119, 116, 116, 0.15)',
                m: 1,
                borderRadius: 3
            }}
        >
            {/* LEFT SECTION */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {LeftIcon && <LeftIcon sx={{ color: 'black' }} />}

                    <Typography
                        level="body-md"
                        sx={{
                            fontWeight: 800,
                            fontSize: 26,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {title}
                    </Typography>
                </Box>
                <Typography sx={{
                    fontWeight: 800,
                    fontSize: 8,
                    display: 'flex',
                    alignItems: 'center'
                }}>{Department}</Typography>
            </Box>

            {/* RIGHT SECTION */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PersonIcon sx={{ fontSize: 16 }} />
                    <Typography level="body-md" sx={{ fontWeight: 600 }}>
                        {userName}
                    </Typography>
                </Box>

                {showClock && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 14 }} />
                        <Typography level="body-sm" sx={{ fontSize: 12 }}>
                            {time.toLocaleTimeString()}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default memo(ReusableTopBar)