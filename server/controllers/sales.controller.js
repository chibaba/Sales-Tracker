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

const currentMonthReview = async(req, res) => {
  const date = new Date(), y = date.getFullYear(), m = date.getMonth()
  const firstDay = new Date(y, m, 1)
  const lastDay = new Date(y, m + 1, 0)

const today = new Date()
today.setUTCHours(0,0,0,0)

  const tomorrow = new Date()
  tomorrow.setUTCHours(0,0,0,0)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const yesterday = new Date()
  yesterday.setUTCHours(0,0,0,0)
  yesterday.setDate(yesterday.getDate() -1)

  try {
    let currentPreview = await Sales.aggregate([
      { 
        $facet:  { month: [
          { $match : {sold_on : {$gte : firstDay, $lt: lastDay }, recorded_by: 
           mongoose.Types.ObjectId(req.auth._id)
        } },
        {$group : { _id: "currentMonth", totalBought: {$sum: "$amount"}}}
        ],
        today: [
          { $match: {sold_on : { $gte: today,  $lt: tomorrow},  recorded_by: mongoose.Types.
        ObjectId(req.auth._id)}},
        { $group: { _id: "today", totalBought: {$sum: "$amount"}}}
        ],
        yesterday: [
          { $match: {sold_on : { $gte: yesterday, $lt: today }, recorded_by: mongoose.Types.
        ObjectId(req.auth._id)}},
        {$group: { _id: "yesterday", totalBought: {$sum: "$amount"}}},
        ]
      }
      }
    ])

    let salesPreview = {month: currentPreview[0].month[0], today: currentPreview[0].today[0], yesterday: currentPreview[0].yesterday[0]}
    res.json(salesPreview)
  } catch (err) {
    console.log(err)
    return res.status(400).json({error: errorHandler.getErrorMessage(err)})
  }
}

const salesByCategory = async(req, res) => {
  const date = new Date(), y = date.getFullYear(), m = date.getMonth()
  const firstDay = new Date(y, m, 1)
  const lastDay = new Date(y, m + 1, 0)

  try {
    let categoryMonthlyAvg = await Sales.aggregate([
      {
        $facet: {
          average: [
            {$match:  {recorded_by: mongoose.Types.ObjectId(req.auth._id)}},
            {$group: { _id: {category: "$category", month: {$month: "$incured_on"}}, totalBought: {$sum: "$amount"}}},
            { $group: { _id: "$_id.category", avgBought: {$avg: "$totalBought"}}},
            {
              $project: { 
                _id: "$_id", value: {average: "$avgBought"}
              }
            }
          ],
          total: [
            { $match : { sold_on :{ $gte : firstDay, $lte : lastDay }, recorded_by: mongoose.Types.
          ObjectId(req.auth._id) }},
          { $group : { _id: "$category", totalBought: {$sum: "$amount"}}},
          {
            $project: {
              _id: "$_id", value: {total: "totalSpent"},
            }
          }
        ]
      }
    },
          {
            $project: { overview:  { $setUnion: ['$average', '$total']},
          }
          },
          {$unwind: '$overview'},
          {$replaceRoot: { newRoot: "$overview"}},
          { $group: { _id: "$_id", mergedValues: {$mergeObjects: "$value"}}}
          ]).exec()
          res.json(categoryMonthlyAvg)
        }catch (err) {
          console.log(err)
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          })
        }
      }

    const averageCategories = async (req, res) => {
      const firstDay = new Date(req.query.firstDay)
      const lastDay = new Date(req.query.lastDay)

      try {
        let categoryMonthlyAvg = await Sales.aggregate([
          { $match:  { sold_on : {$gte : firstDay, $lte : lastDay}, recorded_by: mongoose.Types.ObjectId(req.auth._id)}},
          { $group: { _id : {category: "$category"}, totalBought: {$sum: "$amount"}}},
          {$group : { _id :  "$_id.category", avgBought: { $avg: "$totalBought"}}},
          { $project: {x: '$_id', y: '$avgBought'}}
        ]).exec()
        res.json({monthAVG: categoryMonthlyAvg})
      } catch (err) {
        console.log(err)
        return res.status(400).json({
          error:  errorHandler.getErrorMessage(err)
        })
      }
    }      

    const yearlySales = async (req, res) => {
      const y = req.query.year
      const firstDay = new Date(y, 0, 1)
      const lastDay = new Date(y, 12, 0)

      try {
        let  totalMonthly = await Sales.aggregate( [
          { $match: { sold_on: { $gte: firstDay, $lt: lastDay }, recorded_by: mongoose.Types.ObjectId(req.auth._id)}},
          { $group: { _id:{$month: "$sold_on"}, totalBought: {$sum: "$amount"}}},
          { $project: {x: '$_id', y: '$totalBought'}}
        ]).exec()
        res.json({monthTot: totalMonthly})
      } catch(err) {
        console.log(err)
        return res.status(400).json({error: errorHandler.getErrorMessage(err)})
      }
    }

    const plotSales = async(req, res) => {
      const date = new Date(req.query.month), y = date.getFullYear(), m=date.getMonth()
      const firstDay = new Date(y, m, 1)
      const lastDay = new Date(y,m + 1, 0)

      try {
        let totalMonthly = await Sales.aggregate( [
          { $match: { sold_on: { $gte : firstDay, $lt: lastDay }, recorded_by: mongoose.Types.ObjectId(req.auth._id)}},
          { $project: {x:{$dayOfMonth: '$sold_on'}, y:'$amount'}}
        ]).exec()
        res.json(totalMonthly)
      } catch(err) {
        console.log(err)
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
    }

    const update = async(req, res) => {
      try {
        let sales = req.sales
        sales = extend(sales, req.body)
        sales.updated = Date.now()
        await sales.save()
        res.json(sales)
      } catch(err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })      }
      }
        const remove = async (req, res) => {
          try {
            let sales = req.sales
            let deletedSales = await sales.remove()
            res.json(deletedSales)
          } catch (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            })
          }
      }
      
      const hasAuthorization = (req, res, next) => {
        const authorized = req.sales && req.auth && req.sales.recorded_by._id == req.auth._id
        if (!(authorized)) {
          return res.status('403').json({
            error: "User is not authorized"
          })
        }
        next()
    }
    export default {
      create,
      salesByID,
      read,
      currentMonthReview,
      salesByCategory,
      averageCategories,
      yearlySales,
      plotSales,
      listByUser,
      remove,
      update,
      hasAuthorization
  }