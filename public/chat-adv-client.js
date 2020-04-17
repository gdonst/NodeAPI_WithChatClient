// chat will be on port 4000
const socket = io('http://localhost:4000');

// get user name, display it, and then tell the server
let username = prompt("What's your username?");
// send message to server
socket.emit('username', username);

//user info
let userInfo = "";

// a new user connection message has been received
socket.on('user joined', msg => {
    //edit header
    document.querySelector('.messages-header h3').textContent = 'Chat [' + username + ']';

    //set user info for leaving process
    if(userInfo == ""){
        userInfo = msg;
        document.querySelector('.messages-header h3').setAttribute("id", msg.id);
        document.querySelector('.messages-header h3').setAttribute("name", username);
    }

    //join message
    const li = document.createElement('li');
    const p = document.createElement('p');
    const p2 = document.createElement('p');
    li.className = "message-user";
    p.innerHTML = `${msg.user} <span>Today</span>`;
    p.className = "message-data";
    p2.innerHTML = `Has joined`;
    p2.className = "message-text";
    li.appendChild(p);
    li.appendChild(p2);
    document.querySelector('.messages-body ul').appendChild(li);

    document.querySelector('#users ul').innerHTML = "";

    //for each joined user
    msg.userList.forEach(user => {
        //add user to side bar
        const liSide = document.createElement('li');
        const imgSide = document.createElement(`img`);
        const divSide = document.createElement('div');
        const pSide = document.createElement('p');
        const p2Side = document.createElement('p');
        imgSide.src = `https://randomuser.me/api/portraits/med/men/${user.id}.jpg`;
        imgSide.setAttribute("id" ,`${user.id}`);
        divSide.className = "name";
        pSide.innerHTML = `${user.name}`;
        p2Side.innerHTML = `Online`;
        divSide.appendChild(pSide);
        divSide.appendChild(p2Side);
        liSide.appendChild(imgSide);
        liSide.appendChild(divSide);
        document.querySelector('#users ul').appendChild(liSide);
    });
});

socket.on('user has left', msg => {
        //edit header
        document.querySelector('.messages-header h3').textContent = 'Chat [' + username + ']';

        //join message
        const li = document.createElement('li');
        const p = document.createElement('p');
        const p2 = document.createElement('p');
        li.className = "message-user";
        p.innerHTML = `${msg.user} <span>Today</span>`;
        p.className = "message-data";
        p2.innerHTML = `Has left`;
        p2.className = "message-text";
        li.appendChild(p);
        li.appendChild(p2);
        document.querySelector('.messages-body ul').appendChild(li);
    
        document.querySelector('#users ul').innerHTML = "";
    
        //for each joined user
        msg.userList.forEach(user => {
            //add user to side bar
            const liSide = document.createElement('li');
            const imgSide = document.createElement(`img`);
            const divSide = document.createElement('div');
            const pSide = document.createElement('p');
            const p2Side = document.createElement('p');
            imgSide.src = `https://randomuser.me/api/portraits/med/men/${user.id}.jpg`;
            imgSide.setAttribute("id" ,`${user.id}`);
            divSide.className = "name";
            pSide.innerHTML = `${user.name}`;
            p2Side.innerHTML = `Online`;
            divSide.appendChild(pSide);
            divSide.appendChild(p2Side);
            liSide.appendChild(imgSide);
            liSide.appendChild(divSide);
            document.querySelector('#users ul').appendChild(liSide);
        });
});

// user has entered a new message
document.querySelector("#chatForm").addEventListener('submit', e => {
    e.preventDefault();
    const entry = document.querySelector("#entry");
    //show sent message
    const li = document.createElement('li');
    const p = document.createElement('p');
    const p2 = document.createElement('p');
    li.className = "message-sent";
    p.className = "message-data";
    p.innerHTML = `${username} <span>Today</span>`;
    p2.className = "message-text";
    p2.innerHTML = `${entry.value}`;
    li.appendChild(p);
    li.appendChild(p2);
    document.querySelector('.messages-body ul').appendChild(li);

    // send message to server
    socket.emit('chat from client', entry.value);
    entry.value = "";
});

// a new chat message has been received from server
socket.on('chat from server', msg => {
    const li = document.createElement('li');
    const p = document.createElement('p');
    const p2 = document.createElement('p');
    li.className = "message-received";
    p.className = "message-data";
    p.innerHTML = `${msg.user} <span>Today</span>`;
    p2.className = "message-text";
    p2.innerHTML = `${msg.message}`;
    li.appendChild(p);
    li.appendChild(p2);
    document.querySelector('.messages-body ul').appendChild(li);
});


// user leaves
document.querySelector("#leave").addEventListener('click', e => {
    e.preventDefault();

    //get user who is leaving
    const userID = document.querySelector('.messages-header h3').getAttribute("id");
    const userName = document.querySelector('.messages-header h3').getAttribute("name");

    //hide chat
    document.querySelector('.chat').style.display = 'none';

    // send info to server
    socket.emit('user left', { user: userName, id: userID});
});
