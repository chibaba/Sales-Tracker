import Sales from '../models/sales.model'
import extend from 'lodash/extend'
import errorHandler from '../helpers/dbErrorHandler'
import mongoose  from 'mongoose'

const create  = async (req, res) => {
  try {
    req.body.recorded_by =req.auth._id
    const sales = new Sales(req.body)
    await sales.save()
    return res.status(200).json({
      message: "Sales Recorded!!"
    })
  } catch(err) {
    return res.status(400).json({
      error:errorHandler.getErrorMessage(err)
    })
  }
}
const  salesByID = async(req, res, next, id) => {
  try {
    let sales = await Sales.findById(id).populate('recorded_by', "_id name").exec()
    if(!sales)
    return res.status('400').json({
     error: "Sales record not found"
    })
    req.sales = sales
    next()
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const read = (req, res) => {
  return res.json(req.sales)
}

const listByUser = async(req, res) => {
  let  firstDay = req.query.firstDay
  let lastDay = req.query.lastDay
  
  try {
    let sales = await Sales.find({'$and':[{'sold_on': {'$gte': firstDay, '$lte': lastDay}}, 
    {'recorded_by': req.auth._id}]}).sort('sold_on').populate('recorded_by', '_id name')
    res.json(sales)
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}