
const express =  require("express");
const { writeFileSync } = require("fs");
const app = express();

fs = require("fs");
file = fs.readFileSync("products.json" , "utf8");
file = JSON.parse(file)


app.use(express.json());


app.get("/", function(req, res){
    res.redirect('/todos');
})


app.get("/todos", function(req, res){
    try{
        res.send(file)
    }
    catch{
        res.send("there is no data here ")
    }
})


app.get("/todos/:id", function(req, res){
    var {id} = req.params
    if (!file.find( el => el.id == id)){
        res.send("there is no data with id: " + id)
    }

    try{
        var query = file.find( el => el.id == id)
        res.send(query)
    }
    catch{
        res.send("there is no data matches the id")
    }
})


app.post("/todos", function(req, res){
    var data =req.body
    if (Object.keys(data).length == 0 ){
        res.send("there is no data sent")
    }

    file.push(data)
    writeFileSync("products.json",JSON.stringify(file));
    res.send(data)
})


app.patch("/todos/:id", function(req, res){
    var {id} = req.params
    var querys = file.find( el => el.id == id)
    var datas =req.body

    if (! querys ){
        res.send("there is no data with id : " + id)
    }

    if (Object.keys(datas).length == 0 ){
        res.send("there is no data sent")
    }


    var valid = true ;
    var arr=[] ;

    for( data in datas){
        if ( ! querys[`${data}`] ) {
            valid = false  ;
            arr.push(data) ;
        }
    }

    
    if(valid) {
        for( data in datas){
            querys[`${data}`] = datas[`${data}`]
        }
    }else{
        res.send(`( ${arr.toString().replace(/,/g, " and ")} ) is invalid data`)
    }


    writeFileSync("products.json",JSON.stringify(file));
    res.send("data modified")
    
})

app.delete("/todos/:id", function(req, res){
   
    var {id} = req.params
    if (!file.find( el => el.id == id) ){
        res.send("there is no data whit id : " + id)
    }

    file = file.filter( el => el.id != id)

    writeFileSync("products.json",JSON.stringify(file));
    res.send("data deleted")
    
})






app.listen(2500)
