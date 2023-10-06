var express = require('express')
var router = express.Router()
const db = require('../utils/db')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a user resource')
})

router.get('/subuser/:customernumber', async function (req, res, next) {
  const { customernumber } = req.params
  const [data] = await db.execute(
    `
		select
			c.*,
			JSON_ARRAYAGG(
			JSON_OBJECT(
				'ordernumber', o.ordernumber,
				'orderdate', o.orderdate,
				'requireddate', o.requireddate,
				'shippeddate', o.shippeddate,
				'status', o.status,
				'customernumber', o.customernumber,
				'orderprice', od.orderprice
			)
			) AS orders
		from
			customers as c
			left join orders as o on c.customernumber = o.customernumber
			left join (
			SELECT
				ordernumber,
				SUM(priceeach * quantityordered) AS orderprice
			FROM
				orderdetails
			GROUP BY
				ordernumber
			) as od on o.ordernumber = od.ordernumber
		where
			c.customernumber = ?
		GROUP BY
			c.customernumber;
	`,
    [customernumber],
  )
  res.status(200).json({ data })
  // Input for the method is the customernumber
  // 1. Connect to the database. The credentials are
  /*
  host: "codechallenge.cluster-cnbhrzqf4iok.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "Ananya2021",
  database: 'cc_db'
  */
  // 2. Get all customer information from the customers table for the given customer numbers
  // 3. Get all orders for the customer from the orders table. Also get the full price for each order from orderdetails table
  // 4. Give back the results. The result set should look like that:
  /*
 {
	 "customerNumber": 363,
	 "customerName": "Online Diecast Creations Co.",
	 "contactLastName": "Young",
	 "contactFirstName": "Dorothy",
	 "phone": "6035558647",
	 "addressLine1": "2304 Long Airport Avenue",
	 "addressLine2": null,
	 "city": "Nashua",
	 "state": "NH",
	 "postalCode": "62005",
	 "country": "USA",
	 "salesRepEmployeeNumber": 1216,
	 "creditLimit": 114200,
	 "orders":[
		 {
			 "ordernumber": 10100,
			 "orderdate": "2003-01-05T23:00:00.000Z",
			 "requireddate": "2003-01-12T23:00:00.000Z",
			 "shippeddate": "2003-01-09T23:00:00.000Z",
			 "status": "Shipped",
			 "customernumber": 363,
			 "orderprice": 10223.83
			},
			{
				"ordernumber": 10192,
				"orderdate": "2003-11-19T23:00:00.000Z",
				"requireddate": "2003-11-28T23:00:00.000Z",
				"shippeddate": "2003-11-24T23:00:00.000Z",
				"status": "Shipped",
				"customernumber": 363,
				"orderprice": 55425.77
			},
			{
				"ordernumber": 10322,
				"orderdate": "2004-11-03T23:00:00.000Z",
				"requireddate": "2004-11-11T23:00:00.000Z",
				"shippeddate": "2004-11-09T23:00:00.000Z",
				"status": "Shipped",
				"customernumber": 363,
				"orderprice": 50799.69
			}
		]
	}
	*/
})

router.get('/employeeCustomers/:salesemployeeNumber', async function (req, res, next) {
  const { salesemployeeNumber } = req.params
  const [data] = await db.execute(
    `
	  select
		  c.*,
		  JSON_ARRAYAGG(
		  JSON_OBJECT(
			  'ordernumber', o.ordernumber,
			  'orderdate', o.orderdate,
			  'requireddate', o.requireddate,
			  'shippeddate', o.shippeddate,
			  'status', o.status,
			  'customernumber', o.customernumber,
			  'orderprice', od.orderprice
		  )
		  ) AS orders
	  from
		  customers as c
		  left join orders as o on c.customernumber = o.customernumber
		  left join (
		  SELECT
			  ordernumber,
			  SUM(priceeach * quantityordered) AS orderprice
		  FROM
			  orderdetails
		  GROUP BY
			  ordernumber
		  ) as od on o.ordernumber = od.ordernumber
	  where
		  c.salesRepEmployeeNumber = ?
	  GROUP BY
		  c.customernumber;
  `,
    [salesemployeeNumber],
  )
  res.status(200).json({ data })
  // Input for the method is the salesemployeeNumber
  // 1. Connect to the database. The credentials are
  /*
	host: "codechallenge.cluster-cnbhrzqf4iok.us-east-1.rds.amazonaws.com",
	user: "admin",
	password: "Ananya2021",
	database: 'cc_db'
	*/
  // 2. Get all customer information from the customers table for the given sales employee --> This might be multiple customers
  // 3. Get all orders for the customer from the orders table for all customernumbers from step #2. Also get the full price for each order from orderdetails table
  // 4. Map all orders to the right customers
  // 4. Give back the results. The result set should look like that:
  /*
	[
		{
			"customerNumber": 124,
			"customerName": "Mini Gifts Distributors Ltd.",
			"contactLastName": "Nelson",
			"contactFirstName": "Susan",
			"phone": "4155551450",
			"addressLine1": "5677 Strong St.",
			"addressLine2": null,
			"city": "San Rafael",
			"state": "CA",
			"postalCode": "97562",
			"country": "USA",
			"salesRepEmployeeNumber": 1165,
			"creditLimit": 210500,
			"orders":[
				{"ordernumber": 10113, "orderdate": "2003-03-25T23:00:00.000Z", "requireddate": "2003-04-01T22:00:00.000Z", "shippeddate": "2003-03-26T23:00:00.000Z",…},
				{"ordernumber": 10135, "orderdate": "2003-07-01T22:00:00.000Z", "requireddate": "2003-07-11T22:00:00.000Z", "shippeddate": "2003-07-02T22:00:00.000Z",…},
				{"ordernumber": 10142, "orderdate": "2003-08-07T22:00:00.000Z", "requireddate": "2003-08-15T22:00:00.000Z", "shippeddate": "2003-08-12T22:00:00.000Z",…},
				{"ordernumber": 10182, "orderdate": "2003-11-11T23:00:00.000Z", "requireddate": "2003-11-20T23:00:00.000Z", "shippeddate": "2003-11-17T23:00:00.000Z",…},
				{"ordernumber": 10229, "orderdate": "2004-03-10T23:00:00.000Z", "requireddate": "2004-03-19T23:00:00.000Z", "shippeddate": "2004-03-11T23:00:00.000Z",…},
				{"ordernumber": 10271, "orderdate": "2004-07-19T22:00:00.000Z", "requireddate": "2004-07-28T22:00:00.000Z", "shippeddate": "2004-07-22T22:00:00.000Z",…},
				{"ordernumber": 10282, "orderdate": "2004-08-19T22:00:00.000Z", "requireddate": "2004-08-25T22:00:00.000Z", "shippeddate": "2004-08-21T22:00:00.000Z",…},
				{"ordernumber": 10312, "orderdate": "2004-10-20T22:00:00.000Z", "requireddate": "2004-10-26T22:00:00.000Z", "shippeddate": "2004-10-22T22:00:00.000Z",…},
				{"ordernumber": 10335, "orderdate": "2004-11-18T23:00:00.000Z", "requireddate": "2004-11-28T23:00:00.000Z", "shippeddate": "2004-11-22T23:00:00.000Z",…},
				{"ordernumber": 10357, "orderdate": "2004-12-09T23:00:00.000Z", "requireddate": "2004-12-15T23:00:00.000Z", "shippeddate": "2004-12-13T23:00:00.000Z",…},
				{"ordernumber": 10368, "orderdate": "2005-01-18T23:00:00.000Z", "requireddate": "2005-01-26T23:00:00.000Z", "shippeddate": "2005-01-23T23:00:00.000Z",…},
				{"ordernumber": 10371, "orderdate": "2005-01-22T23:00:00.000Z", "requireddate": "2005-02-02T23:00:00.000Z", "shippeddate": "2005-01-24T23:00:00.000Z",…},
				{"ordernumber": 10382, "orderdate": "2005-02-16T23:00:00.000Z", "requireddate": "2005-02-22T23:00:00.000Z", "shippeddate": "2005-02-17T23:00:00.000Z",…},
				{"ordernumber": 10385, "orderdate": "2005-02-27T23:00:00.000Z", "requireddate": "2005-03-08T23:00:00.000Z", "shippeddate": "2005-02-28T23:00:00.000Z",…},
				{"ordernumber": 10390, "orderdate": "2005-03-03T23:00:00.000Z", "requireddate": "2005-03-10T23:00:00.000Z", "shippeddate": "2005-03-06T23:00:00.000Z",…},
				{"ordernumber": 10396, "orderdate": "2005-03-22T23:00:00.000Z", "requireddate": "2005-04-01T22:00:00.000Z", "shippeddate": "2005-03-27T22:00:00.000Z",…},
				{"ordernumber": 10421, "orderdate": "2005-05-28T22:00:00.000Z", "requireddate": "2005-06-05T22:00:00.000Z", "shippeddate": null,…}
			]
		},
		{
			"customerNumber": 129,
			"customerName": "Mini Wheels Co.",
			"contactLastName": "Murphy",
			"contactFirstName": "Julie",
			"phone": "6505555787",
			"addressLine1": "5557 North Pendale Street",
			"addressLine2": null,
			"city": "San Francisco",
			"state": "CA",
			"postalCode": "94217",
			"country": "USA",
			"salesRepEmployeeNumber": 1165,
			"creditLimit": 64600,
			"orders":[
				{"ordernumber": 10111, "orderdate": "2003-03-24T23:00:00.000Z", "requireddate": "2003-03-30T22:00:00.000Z", "shippeddate": "2003-03-29T23:00:00.000Z",…},
				{"ordernumber": 10201, "orderdate": "2003-11-30T23:00:00.000Z", "requireddate": "2003-12-10T23:00:00.000Z", "shippeddate": "2003-12-01T23:00:00.000Z",…},
				{"ordernumber": 10333, "orderdate": "2004-11-17T23:00:00.000Z", "requireddate": "2004-11-26T23:00:00.000Z", "shippeddate": "2004-11-19T23:00:00.000Z",…}
			]
		},
		...
	]
	*/
})

module.exports = router
