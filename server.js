
const express = require('express');
const app = express();
const fs = require('fs')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const normalizr = require("normalizr")
const normalize = normalizr.normalize
const denormalize = normalizr.denormalize
const schema = normalizr.schema;
const authorSchema = new schema.Entity('autores')
const commentSchema = new schema.Entity('text')
const postSchema = new schema.Entity('posts', {
    author: authorSchema,
    comments: [ commentSchema ]
   });
   

function save(object) {
    const leer = JSON.parse(fs.readFileSync("./mensajes.json", "utf-8"));
    leer.mensaje.push(object);
    const a = JSON.stringify(leer);
    fs.writeFileSync("./mensajes.json", a);
}

function normalizationProcess(){
    return normalize(JSON.parse(fs.readFileSync("./mensajes.json","utf-8")), postSchema);
}

function denormalizationProcess(){
    return denormalize(normalizationProcess().result, postSchema, normalizationProcess().entities);
}

function compression(){
    return JSON.stringify(denormalizationProcess()).length/JSON.stringify(normalizationProcess()).length*100
}

//Websocket
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado', socket.id);
    socket.on('new-message', data => {
        save(data);
    });
    io.sockets.emit('messages', denormalizationProcess().mensaje)
    io.sockets.emit('compression', compression())

});

app.get('/', (req,res) =>{
    res.redirect("/form.html")
})

httpServer.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
})
