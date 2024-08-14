const express = require('express'), 
mysql = require('mysql'),
cors = require('cors'),
app = express(),
port = 3000,
router = express.Router()
;

const corsOption = {
    origin : '*',
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders : '*'
};

app.use(cors(corsOption));
app.use(express.json());

router.post("/login",(req,res)=>{
    let data = req.body,
    values = [data.user, data.password],
    clientExist;
    conection.query("SELECT user FROM login WHERE user = ? AND password = ?",values, (e,r)=>{
      if(e){
        console.error(e)
      }else if(r.length > 0){
          clientExist = true;
      }else{
        console.log("no se encontro el usuario en la base de datos");
        clientExist = false;
      }
      res.send(clientExist);
    })
})

router.post("/register",(req,res)=>{
    let data = req.body,
    values= [data.user,data.password],userRegister;
    conection.query("SELECT * FROM login",(e,r)=>{
        for(let i = 0; i < r.length;i++){
            if(data.user == r[i].user){
                userRegister = true;
                break;
            }else{
                userRegister = false;
            }
        }
        if(userRegister == false){
            conection.query("INSERT INTO login(user,password) VALUES(?,?)",values,(e,r)=>{
                if(e){
                    console.error(e);
                }
            })
        }
        res.send(userRegister);
    })
})

router.post("/sendData",(req,res)=>{
    let data = req.body;
    values = [data.user,data.numberActivity,data.acount,data.type,data.amount];
    conection.query("INSERT INTO data (user, numberActivity, acount, type, amount) VALUES (?,?,?,?,?)",values,(e,r)=>{
        if(e){
            console.log(e)
        }else{
            console.log("Se agregaron los datos correctamente");
            res.send(true);
       }
    })
})

router.get("/getData",(req,res)=>{
    const user = 'Jesus'
    conection.query("SELECT user, numberActivity, acount, type, amount FROM data WHERE user = ?",["Jesus"],(e,r)=>{
        if(e){
            console.error(e)
        }else{
            res.json(r);
        }
    })
})

router.delete("/cleanData",(req,res)=>{
    conection.query("DELETE FROM data", (e,r)=>{
        if(e) console.error(e.message)
        else res.json(true);
    })
})

router.delete("/cleanUt",(req,res)=>{
    conection.query("DELETE FROM data WHERE acount = ?",["UTILIDAD DEL EJERCICIO"], (e,r)=>{
        if(e) console.error(e.message)
        else res.json(true);
    })
})

app.use("/api",router)

const server = app.listen(port,()=>{
    console.log("servidor inicializado en el puero: ",port);
})

const conection = mysql.createConnection({
    host : 'bdrchsbjdpo1zk0fjzrf-mysql.services.clever-cloud.com',
    database : 'bdrchsbjdpo1zk0fjzrf',
    user : 'uvug0zxh4rbmpzv2',
    password : 'zW6ehBoamdXjCFO22LAW',
})

conection.connect((err)=>{
    if(err){
        console.log("error al conectar con la base de datos");
    }else{
        console.log("coneccion exitosa a la base de datos");
    }
})