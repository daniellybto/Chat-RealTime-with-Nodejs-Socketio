const express = require('express');
const path = require('path');

const app = express();
//definindo o protocolo HTTP
const server = require('http').createServer(app);

//definindo o protocolo WSS para o socket.io
const io = require('socket.io')(server);

//definindo onde ficaram os arquivos públicos da nossa aplicação:
app.use(express.static(path.join(__dirname, 'public')));
//definindo que as views serão em formato HTML, já que por padrão o Nodejs as views são em formato EJS que é a template engine padrão do NodeJs
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// +++++++++++++++++++++++++++++++++++++++
// +++++++++++ DEFININDO ROTAS +++++++++++
// +++++++++++++++++++++++++++++++++++++++
app.use('/', (req, res) => {
  res.render('index.html');
});


//array responsável por armazenar as mensagens:
let messages = [];

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++ DEFININDO A FORMA DE CONEXÃO DO USUÁRIO COM O NOSSO WEBSOCKET ++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
io.on('connection', socket => {
  console.log(`Socket Conectado: ${socket.id}`);

  //aqui eu faço um evento, para que quando um novo dipositivo/cliente se conecte a aplicação ele receba também as mensagens anteriores...
  socket.emit('previousMessages', messages);

  //o mesmo nome do evento que eu criei no frontEnd eu irei receber aqui no BackEnd...
  // então eu tenho que colocar o mesmo nome que está no FrontEnd!
  socket.on('sendMessage', data => {
    messages.push(data);

    //a função broadcast vai 'emitir' a todos os dispositivos conectados na URL da aplicação!!
    socket.broadcast.emit('receivedMessage', data);
  });
});



server.listen(3000);