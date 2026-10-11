const express=require('express');
require('dotenv').config()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const app=express()

const db=require('./db.js')
const requestlogger=require('./logger')


app.use(express.json());
app.use(requestlogger);

const port=8000 

//routes
//end point for get all students

app.get('/',(req,res)=>{
    res.send('wecome to our server')
    })
    app.get('/api/get_teacher',(req,res)=>{
        let sql='select * from teacher'
db.query(sql,(err,result)=>{
    if(err){
        res.status(500).json({'message':'failed'

        })
        console.log(err)

    }
    res.status(200).json(result)

})
    })
    app.get('/',(req,res)=>{
    res.send('wecome to our server')
    })
    app.get('/api/get_students',(req,res)=>{
        let sql='select * from students'
db.query(sql,(err,result)=>{
    if(err){
        res.status(500).json({'message':'failed'

        })
        console.log(err)

    }
    res.status(200).json(result)

})
    })
//endpoint for creating students
app.post('/api/student',(req,res)=>{
    // let name = req.body.names; //let {name} = request.body
    // let email = req.body.email;
    // let courses = req.body.courses;

    let {name,email,courses} =req.body

    let sql =`insert into students
    (names,email,courses) 
    values(?,?,?)`;//prepared statement
db.query(sql,[name,email,courses],(err,result)=>{ 
    if(err){
        res.status(500).json({'message':'failed to create students' })
        console.log(err)

    }
    res.status(200).json({message: "students created success full"})

})
})

//get by id

app.get('/api/student/:id',(req,res)=>{

    let {id}=req.params;
    let sql=`select * from students where id=?`;
    db.query(sql,[id],(err,result)=>{
        
if(err){
    res.status(500).json({"message":"fail to get students"})
    console.log(err);
}
res.status(200).json(result)
    })
})

//delete students by id
app.delete(`/api/students/:id`,(req,res)=>{
    let{id}=req.params;
    let sql=`delete from students where id=?`;
    db.query(sql,[id],(err,result)=>{
        if(err){
            res.status(500).json({"message":"fail to delete students"})
            console.log(err);
        }
        res.status(200).json({message:"deleted successfull"})
    })
})


//update

app.put('/api/student/:id',(req,res)=>{
    // let name = req.body.names; //let {name} = request.body
    // let email = req.body.email;
    // let courses = req.body.courses;

    let {names,email,courses} =req.body
let {id}= req.params
    let sql =`update students set names =?,email=?,courses=?
    where id =?`
db.query(sql,[names,email,courses,id],(err,result)=>{ 
    if(err){
        res.status(500).json({'message':'failed to update students' })
        console.log(err)

    }
    res.status(200).json({message: "students update success full"})

})
})

//Authentication
//1.register
 
app.post('/api/register',async(req,res)=>{
    let {names,email,password,role} =req.body;

let hashed_password = await bcrypt.hash(password ,10); //salt value

    let sql =`insert into users(names,email,password_hash,role) values (?,?,?,?)`;
    db.query(sql,[names,email,hashed_password,role],(err,result)=>{
        if(err){
            res.status(500).json({message:"failed to register user"})
            console.log(err.message);
        }
        res.status(201).json({message:"register successfull"})
    }) 

})

//login

app.post('/api/login',(req,res)=>{
    let{email,password} =req.body;
    let user_sql=`select * from users where email=?`
    db.query(user_sql,[email],(err,result)=>{
        if(err){
            res.status(500).json({message:"fail to login"})
            console.log(err);
        }
        else if(result.length==0){
            res.status(400).json({message:"invalid email or password"})
        } else{
            let user=result[0];
            let match=bcrypt.compare(password,user.password_hash)
            if(!match){
                res.status(400).json({message:"invalid email or password"})
            }

            //token
            let token =jwt.sign(
                {id:user.id,email:user.email,role:user.role},
           process.env.JWT_SECRETE,
            {expiresIn:'24h'}
        )
        res.status(200).json({
          message:"login successfull",
          taken: token,
          user:user  
        })
        }
    })

    })


    app.listen(process.env.PORT,()=>{
    console.log(`welcome to our server is now running on:${port}`)
})