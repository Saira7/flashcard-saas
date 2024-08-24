'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  Grid,
  CardContent,
  CardActionArea,
} from '@mui/material'
import { useUser } from '@supabase/auth-helpers-react'
import { collection, doc, getDocs } from 'firebase/firestore'
import { useSearchParams } from 'next/navigation'
import { db } from '../firebase' // Import your firebase config

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return

            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [search, user])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    return (
        <Container maxWidth="md">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard) => (
                    <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                        <Card sx={{ perspective: '1000px' }}>
                            <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '200px',
                                        transformStyle: 'preserve-3d',
                                        transition: 'transform 0.6s',
                                        transform: flipped[flashcard.id]
                                            ? 'rotateY(180deg)'
                                            : 'rotateY(0deg)',
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#f0f0f0',
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography variant="h5" component="div">
                                            {flashcard.front}
                                        </Typography>
                                    </CardContent>
                                    <CardContent
                                        sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#e0e0e0',
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography variant="h5" component="div">
                                            {flashcard.back}
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
