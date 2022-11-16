const { Server } = require("socket.io");
const redis = require('redis');
const client = redis.createClient();

// connect to redis
client.connect();

// initialize socket io server
const io = new Server({
    cors: {
        origin: "*"
    }
});

const randomId = () => (Math.random() + 1).toString(36).substring(7);

const listAvatar = [
    'avatar.png',
    'batman.png',
    'robot.png'
]

const random = (length) => {
    return Math.floor(Math.random() * length)
};

const winCondition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const checkWinner = (board) => {
    for (let i = 0; i < winCondition.length; i++) {
        const [x, y, z] = winCondition[i];

        if (board[x] && board[x] === board[y] && board[y] === board[z]) {
            return board[x]
        }
    }
}

const userList = io.sockets.adapter.sids;
const roomsList = io.sockets.adapter.rooms;

io.use(async (socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
        const session = await client.get(sessionID);
        if (session) {
            socket.sessionID = sessionID;
            socket.userID = session.userID;
            socket.name = session.name;
            socket.email = session.email;
            return next();
        }
    }
    const name = socket.handshake.auth.name;
    const email = socket.handshake.auth.email;
    if (!name || !email) {
        return next(new Error("invalid name or email"));
    }
    socket.sessionID = randomId();
    socket.userID = randomId();
    socket.name = name;
    socket.email = email;
    next();
});


io.on("connection", async (socket) => {

    socket.leave(socket.id);

    // persist session
    const saveSession = await client.set(socket.sessionID, JSON.stringify({
        userID: socket.userID,
        name: socket.name,
        email: socket.email,
        connected: true,
    }));

    // emit session details
    socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.userID,
        name: socket.name,
        email: socket.email,
    });

    // find room
    socket.on("find room", async () => {

        socket.leave(socket.rooms.values().next().value);

        const clientsInsideRoom = [];

        roomsList.forEach((value, key) => {
            value.forEach((v, k) => {
                clientsInsideRoom.push(v)
            })
            // console.info(value.values().next().value)
        });

        if (roomsList.size === 0 || clientsInsideRoom.length % 2 === 0) {
            socket.join("room" + (roomsList.size + 1))
            socket.emit("waitingOpponent");
        } else {

            // socket.join("room" + roomsList.size);
            // cek jumlah user di tiap room
            roomsList.forEach((value, key) => {
                // jika jumlah user === 1
                if (value.size === 1) {
                    // join room tersebut
                    socket.join(key)
                }

            })

            const roomSocket = await io.in(socket.rooms.values().next().value).fetchSockets();

            const listSocket = roomSocket.map((s) => {

                const avatarImage = listAvatar[random(3)]

                return {
                    name: s.name,
                    avatarImage: avatarImage
                }
            });

            const xPlayer = listSocket[random(2)].name;
            const lastTurn = listSocket[random(2)].name;

            socket.to(socket.rooms.values().next().value).emit("gameMatched", {
                gameData: {
                    player: listSocket,
                    xPlayer: xPlayer,
                    lastTurn: lastTurn
                }
            })
        }

        // console.info("Jumlah user: " + userList.size)
        // console.info("Jumlah room: " + roomsList.size)

    })
    // console.info("Jumlah user: " + userList.size)
    // console.info("Jumlah room: " + roomsList.size)

    socket.on("boardClick", (data) => {

        const winner = checkWinner(data.board);

        if (winner) {
            if (winner === "X") {
                socket.to(socket.rooms.values().next().value).emit("gameResult", {
                    winner: "X"
                })
                io.in(socket.rooms.values().next().value).socketsLeave(socket.rooms.values().next().value);
            } else {
                socket.to(socket.rooms.values().next().value).emit("gameResult", {
                    winner: "O"
                });
                io.in(socket.rooms.values().next().value).socketsLeave(socket.rooms.values().next().value);
            }
        }

        if (data.tileFilled === 8 && !winner) {
            socket.to(socket.rooms.values().next().value).emit("gameResult", {
                winner: "Draw"
            })
        }

        socket.to(socket.rooms.values().next().value).emit("updatedBoard", data)
    })

})


io.listen(5000);