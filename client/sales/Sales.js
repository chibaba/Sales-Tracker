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
import DateFnsUtils from '@date-io/date-fns'
import { DateTimePicker, DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"


const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
    maxWidth: '800px',
    margin: 'auto',
    marginTop: 40,
    marginBottom: 40
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
  },
  info: {
    marginRight: 32,
    width: 90
  },
  amount: {
    fontSize: '2em',
    color: '#2bbd7e'
  },
  search: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  textField: {
    margin: '8px 16px',
    width: 240
  },
  buttons: {
    textAlign: 'right'
  },
  status: {
    marginRight: 8
  },
  date: {
    fontSize: '1.1em',
    color: '#88bb8b',
    marginTop: 4
  }
}))

export default function Sales() {
  const classes = useStyles()
  const [redirectToSignin, setRedirectToSignin] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [sales, setSales] = useState([])
  const jwt = auth.isAuthenticated()
  const date = new Date(), y = date.getFullYear(), m=date.getMonth()
  const [firstDay, setFirstDay] = useState(new Date(y, m, 1))
  const [lastDay, setLastDay] = useState(new Date(y, m +1, 0))
  useEffect(() =>{
    const abortController = new AbortController()
    const signal = abortController.signal
    listByUser({firstDay: firstDay, lastDay: lastDay}, {t: jwt.token}, signal).then((data) =>{
      if(data.error) {
        setRedirectToSignin(true)
      } else {
        setSales(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  },  [])

  const handleSearchFieldChange = name => date =>{
    if(name=='firstDay') {
      setFirstDay(date)
    } else {
      setLastDay(date)
    }
  }

  const searchClicked = () => {
    listByUser({firstDay: firstDay, lastDay: lastDay}, {t: jwt.token}).then((data) => {
      if(data.error) {
        setRedirectToSignin(true)
      } else {
        setSales(data)
      }
    })
  }
  const handleChange = (name, index) => event => {
    const updatedSales = [...sales]
    updatedSales[index][name] = event.target.value
    setSales(updatedSales)
  }
  const handleDateChange = index => date => {
    const updatedSales = [...sales]
    updatedSales[index].incurred_on = date
    setSales(updatedSales)
  }
  const clickUpdate = (index) => {
    let sale = sales[index]
    update({
     salesId: sale._id
    }, {t: jwt.token}, sale).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setSaved(true)
        setTimeout(() =>{setSaved(false)}, 3000)
      }
    })
  }
   const removeSale = (sale) => {
     const updatedSales = [...sales]
     const index  = updatedSales.indexOf(sale)
     updatedSales.splice(index, 1)
     setSales(updatedSales)
   }
   if(redirectToSignin) {
     return <Redirect to="/signin"/>
   }
   return (
     <div className={classes.root}>
       <div className={classes.search}>
         <MuiPickersUtilsProvider utils={DateFnsUtils}>
           <DatePicker
            disableFuture
            format="dd/MM/yyyy"
            label="SHOWING RECORDS FROM"
            className={classes.textField}
            views={["year", "month", "date"]}
            value={firstDay}
            onChange={handleSearchFieldChange('firstDay')}
            />
            <DatePicker
            format="dd/MM/yyyy"
            label="TO"
            className={classes.textField}
            views={["year", "month", "date"]}
            value={lastDay}
            onChange={handleSearchFieldChange('lastDay')}
            />
         </MuiPickersUtilsProvider>
         <Button variant="contained" color="secondary" onClick={searchClicked}>GO</Button>
       </div>

       {sales.map((sale, index) => {
         return <span key={index}>
         <ExpansionPanel className={classes.panel}>
           <ExpansionPanelSummary
           expandIcon={<Edit />}
           >
             <div className={classes.info}>
               <Typography className={classes.amount}>$ {sale.amount}</Typography><Divider style={{marginTop: 4, marginBottom: 4}} />
               <Typography className={classes.date}>{new Date(sale.sold_on).toLocaleDateString()}</Typography>
             </div>
             <div>
               <Typography className={classes.heading}>{sale.title}</Typography>
               <Typography className={classes.notes}>
                 {sale.notes}
               </Typography>
             </div>
           </ExpansionPanelSummary>
           <Divider />
           <ExpansionPanelDetails style={{display: 'block'}}>
             <div>
               <TextField label="Title" className={classes.textField} value={sale.title} onChange={handleChange('title', index)} margin="normal" />
               <TextField label="Amount($)" className={classes.textField} value={sale.amount} onChange={handleChange('amount', index)} margin="normal" type="number" />
             </div>
             <div>
               <MuiPickersUtilsProvider utils={DateFnsUtils}>
                 <DateTimePicker
                 label="sold_on"
                 className={classes.textField}
                 views={["year", "month", "date"]}
                 value={sale.sold_on}
                 onChange={handleDateChange(index)}
                 showTodayButton
                 />
               </MuiPickersUtilsProvider>
               <TextField label="Category" className={classes.textField} value={sale.category} onChange={handleChange('category', index)} margin="normal" />
                           </div>
                           <TextField
                           label="Notes"
                           multiline
                           rows="2"
                           value={sale.notes}
                           onChange={handleChange('notes', index)}
                           className={classes.textField}
                           margin="normal"
                           />
                           <div className={classes.buttons}>
                             {
                               error && (<Typography component="p" color="error">
                                 <Icon color="error" className={classes.error}>error</Icon>
                                 {error}
                               </Typography>)
                             }
                             {
                               saved && <Typography component="span" color="secondary" className={classes.status}>Saved</Typography>
                             }
                             <Button color="primary" variant="contained" onClick={()=> clickUpdate(index)} className={classes.submit}>Update</Button>
                             <DeleteSales sale={sale} onRemove={removeSale} />
                           </div>
           </ExpansionPanelDetails>
           </ExpansionPanel>
         </span>
       })}
     </div>
   )
}