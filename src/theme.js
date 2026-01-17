import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FFAB40', // Orange to complement Blue
            contrastText: '#000000',
        },
        secondary: {
            main: '#377cfb', // Matching Tailwind 'secondary' DEFAULT
            contrastText: '#ffffff',
        },
        background: {
            default: '#181c21', // Matching base app background
            paper: '#181c21',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        button: {
            textTransform: 'none', // Keep buttons sentence/title case like before
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12, // Slightly rounded corners like HeroUI
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 9999, // Full pill shape for buttons
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                },
            },
        },
    },
});

export default theme;
