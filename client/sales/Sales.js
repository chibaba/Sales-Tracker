import React, {useState, useEffect} from 'react'
import { makeStyle } from  '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import  ExpansionPanelSummary  from '@material-ui/core/ExpansionPanelSummary';
import  ExpansionPanelDetails  from '@material-ui/core/ExpansionPanelDetails';
import  Typography  from '@material-ui/core/Typography';
import Divider  from '@material-ui/core/Divider';
import TextField  from '@material-ui/core/TextField';
import  Button from  '@material-ui/core/Button';
import Edit from '@material-ui/icons/Edit';
import auth from '../auth/auth-helper';
import { listByUser, update } from './api-sales';
import DeleteSales from './DeleteSales'
import Icon  from '@material-ui/core/Icon'

import {Redirect} from 'react-router-dom'
import DateFnsUtils from '@date-io/date-fns/build/date-fns-utils';
import { DateTimePicker, DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"
