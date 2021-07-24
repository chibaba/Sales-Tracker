import React, {useState, useEffect} from 'react'
import { makeStyles } from  '@material-ui/core/styles';
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


const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
    maxWidth: '800px',
    margin: 'auto',
    marginTop: '40',
    marginBottom: '40'
  },
  heading: {
    fontSize: '1.5em',
    fontWeight: theme.typography.fontWeightRegular,
    marginTop: 12,
    marginBottom: 4
  },
  error: {
    verticalAlign: 'middle',
  },
  notes: {
      color: 'grey'
  },
  panel: {
    border: '1px solid #58cd3d',
    margin: 6
  }
}))