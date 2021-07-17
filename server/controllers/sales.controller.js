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

      
