'use client'
import styles from "./page.module.css";
import {
  Button,
  Typography,
  Box,
  Grid,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardActions,
  Container,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'; 
import getStripe from './api/checkout_sessions/utilis/get-stripe'; 

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    });
    const checkoutSessionJson = await checkoutSession.json();

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <main className={styles.main}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Flashcard SaaS
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            The easiest way to create flashcards from your text.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} href="/generate">
            Get Started
          </Button>
          <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
            Learn More
          </Button>
        </Box>

        <Box sx={{ my: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h3">
                    Easy to Use
                  </Typography>
                  <Typography variant="body2">
                    Create flashcards in just a few clicks. Our intuitive interface makes it simple.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h3">
                    Customizable
                  </Typography>
                  <Typography variant="body2">
                    Customize your flashcards with different styles, colors, and fonts.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h3">
                    Accessible Anywhere
                  </Typography>
                  <Typography variant="body2">
                    Access your flashcards from any device, anytime, anywhere.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ my: 6, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h3">
                    Free Plan
                  </Typography>
                  <Typography variant="h6" component="p">
                    $0 / month
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Basic flashcard creation" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Access to all templates" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Limited to 50 flashcards" />
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Choose Plan
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h3">
                    Pro Plan
                  </Typography>
                  <Typography variant="h6" component="p">
                    $10 / month
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Unlimited flashcard creation" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Advanced customization options" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Priority support" />
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Choose Plan
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </main>
  );
}

