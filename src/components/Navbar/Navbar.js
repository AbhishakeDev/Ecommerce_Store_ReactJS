import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import useStyles from './styles';
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({ totalItems }) => {
    const classes = useStyles();
    const location = useLocation();

    return (
        <>
            <AppBar position="fixed" className={classes.appBar} color="inherit">
                <Toolbar>
                    <Typography to='/' component={Link} variant="h6" className={classes.title} color="inherit">
                        <img src="https://i.ibb.co/Qp1SXBw/commerce.png" alt="Commerce.js" height="25px" className={classes.image} />
                        RoverTech E-COM
                    </Typography>
                    <div className={classes.grow} />
                    {location.pathname === '/' &&
                        <div className={classes.button}>
                            <IconButton to='/cart' component={Link} aria-label="Show cart Items" color="inherit">
                                <Badge badgeContent={totalItems} color="secondary">
                                    <ShoppingCart />
                                </Badge>
                            </IconButton>
                        </div>
                    }
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Navbar
