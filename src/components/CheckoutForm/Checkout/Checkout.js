import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { commerce } from '../../../lib/commerce';
import { Link } from 'react-router-dom';

const steps = ['Shipping Address', 'Payment details'];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});

    useEffect(() => {
        if (activeStep < 0) {
            setActiveStep(0);
        }
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });
                console.log(token);
                setCheckoutToken(token);
            } catch (error) {
                console.log(error);
            }
        }
        generateToken();
    }, [cart])

    const nextStep = () => setActiveStep(() => setActiveStep((prevActiveStep) => prevActiveStep + 1))
    const backStep = () => setActiveStep(() => setActiveStep((prevActiveStep) => prevActiveStep - 2))

    const next = (data) => {
        setShippingData(data);
        nextStep();
    }

    console.log(activeStep);

    let Confirmation = () => order.customer ? (
        <>
            <CssBaseline />
            <div>
                <Typography variant="h5">Thank you for the purchase , {order.customer.firstname} {order.customer.lastname}</Typography>
                <Divider className={classes.divider} />
                <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>) :
        (isFinished ?
            (
                <>
                    <CssBaseline />
                    <div>
                        <Typography variant="h5">Thank you for the purchase </Typography>
                        <Divider className={classes.divider} />
                        <Typography variant="subtitle2">Order ref: 34242343</Typography>
                    </div>
                    <br />
                    <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
                </>
            ) :
            <div className={classes.spinner}>
                <CircularProgress />
            </div>
        );

    const timeout = () => {
        setTimeout(() => {
            setIsFinished(true);
        }, 3000)
    }

    if (error) {
        <>
            <Typography variant="h5"> Error : {error}</Typography>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    }

    const Form = () => activeStep === 0 ? <AddressForm checkoutToken={checkoutToken} next={next} /> : <PaymentForm onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} backStep={backStep} checkoutToken={checkoutToken} shippingData={shippingData} timeout={timeout} />;
    return (
        <>
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep > steps.length + 1 ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </>
    )
}

export default Checkout
