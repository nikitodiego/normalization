
function render(data) {
    const html = data.map((elem) => {
        return(`<div>
            <strong> mail: ${elem.author.id}</strong>
            <strong style="color: green;">nombre: ${elem.author.nombre}</strong>
            <em>,apellido: ${elem.author.apellido}</em> 
            <em>,edad${elem.author.edad}</em>
            <em>, comentario: ${elem.text}</em></div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}

function renderCompression(data){
    const valor = `<strong>Compression: ${data}%</strong>`
    document.getElementById('compression').innerHTML = valor;
}

function addMessage() {
    let a = document.getElementById('id').value;
    if (a.includes("@")) {

        const mensaje = {
            author: {
                id: document.getElementById('id').value,
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apellido').value,
                edad: document.getElementById('edad').value
            },
            text: document.getElementById('mensaje').value
        }
        
        socket.emit('new-message', mensaje);
        console.log("New message sent");
        return false;
    } else (alert("Ingrese una dirección de e-mail válida"));
}

const socket = io.connect();
socket.on('messages', data => render(data));
socket.on('compression',data => renderCompression(data))

