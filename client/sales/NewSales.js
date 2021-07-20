import React, {useState} from 'react';
import Card from  '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import auth from '../auth/auth-helper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import {makeStyles} from '@material-ui/core/styles'
import { create } from './api-sales.js'
import { Link, Redirect} from 'react-router-dom'
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';



