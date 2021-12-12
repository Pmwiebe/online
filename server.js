'use strict'

const path = require("path");
const express = require('express');
const app = express();
var http = require('http');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static('pages'));

const mysql = require('mysql');
const { response } = require("express");

let con = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'admin'
});

app.set('view engine', 'ejs')

app.get('/', (req,res) => {
    res.render('pages/main')
})

app.get('/login', (req,res) => {

    con.connect((err) => {
        if (err) {console.log(err)}
        else {console.log("Connected!")}
    })
    con.query("USE CBO;", (err, result) => {
        if (err) {console.log(err)}
    })
    res.render('pages/login')
});

app.post("/staff.html", (req,res) => {
    var num = req.body.num;
    res.redirect("/result.html");
    app.get("/results", (req,res) => {
        var statement = `SELECT * FROM staff WHERE phone='${num}'`;
        con.query(statement, (err,result) => {
            if (err) {console.log(err)}
            res.send(result);
        })
    })
})

app.post("/login.html", (req,res) => {
    var username = req.body.uname;
    var password = req.body.psw;
    var statement = `SELECT * FROM signin where username='${username}'`
    con.query(statement, (err, result) => {
        if (result.length!=0)
        {
            var psw_hash = result[0]["password"];
            const verified = bcrypt.compareSync(password, psw_hash);
            if(verified)
            {
                res.redirect("/home.html")
            }
            else{
                res.redirect("/login.html")
            }
        }
        else{
            res.redirect("/login.html")
        }
    })
})

app.post("/customer.html", (req,res) => {
    var name = req.body.firstname;
    var num = req.body.pnum;
    res.redirect("/result.html")
    app.get("/result", (req,res) => {
        var statement1 = `SELECT * FROM customers WHERE firstname='${name}'`;
        var statement2 = `SELECT * FROM customers WHERE phoneNumber='${num}'`;
        if (name != undefined)
        {
            con.query(statement1, (err, result) => {
                if (err) {console.log(err)}
                res.send(result);
            })
        }
        else{
            con.query(statement2, (err, Result) => {
                if (err) {console.log(err)}
                res.send(Result);
            })
        }
    })
})

app.post("/newstaff.html", (req,res) => {
    var fname = req.body.fname;
    var mname = req.body.mname;
    var lname = req.body.lname;
    var email = req.body.email;
    var number = req.body.num;
    var username = req.body.username;
    var password = req.body.password;
    var statement = `INSERT INTO staff (firstname, middlename, lastname, email, phone) VALUES ('${fname}','${mname}','${lname}','${email}','${number}')`;
    con.query(statement, (err, result) => {
        if (err) {console.log(err)}
        else {console.log("New staff added")}
    })
    con.query(`INSERT into signin (id, email) SELECT id, email FROM staff WHERE email='${email}'`, (Err, Result) => {
        if (Err) {console.log(Err)}
        const password_hash = bcrypt.hashSync(password,10);
        con.query(`UPDATE signin SET username='${username}', password='${password_hash}' WHERE email='${email}'`, (error,Res) => {
            if (error) {console.log(error)}
        })
    })
    res.redirect("/staff.html")
})


app.post("/addnew.html", (req,res) => {
    var fname = req.body.fname;
    var mname = req.body.mname;
    var lname = req.body.lname;
    var num = req.body.pnum;
    var income = req.body.incomeStat;
    var household = req.body.household;
    var other = req.body.other;
    var address = req.body.address;
    var statement = `INSERT INTO customers (firstname, middlename, lastname, phoneNumber, incomeStatus, numPeopleofHousehold, 
        otherServices, address) VALUES ('${fname}','${mname}','${lname}','${num}','${income}','${household}','${other}','${address}')`;
    con.query(statement, (err,result) => {
        if (err) {console.log(err)}
        else {console.log("New customer added")}
    })
    res.redirect("/customer.html")
})

app.listen(process.env.PORT)