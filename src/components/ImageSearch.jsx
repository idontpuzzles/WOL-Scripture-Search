import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import { motion } from 'framer-motion';

export default function ImageSearch() {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        if (!searchTerm.trim()) return;
        const query = `${searchTerm} (site:jw.org OR site:wol.jw.org)`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`;
        window.open(url, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.01 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
            <Card sx={{
                minWidth: 300,
                maxWidth: 600,
                width: '100%',
                // Restoration of the 'glow' (shadow) and subtle border, but keeping background opaque/dark
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    borderColor: 'primary.main', // Hints at interaction
                    boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.5)' // Intensify glow
                }
            }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'white', mb: 0.5 }}>
                            Image Search
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'primary.main', opacity: 0.8 }}>
                            Search for images on JW.org
                        </Typography>
                    </Box>

                    <TextField
                        fullWidth
                        placeholder="Enter search keyword..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        sx={{
                            input: {
                                color: 'white',
                                textAlign: 'center'
                            }
                        }}
                    />

                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={handleSearch}
                        sx={{
                            px: 4,
                            py: 1.5,
                            alignSelf: 'center',
                            width: { xs: '100%', sm: 'auto' },
                            borderRadius: 99,
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            textTransform: 'none',
                            boxShadow: '0 4px 14px 0 rgba(55, 124, 251, 0.39)'
                        }}
                    >
                        Search Images
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}
