const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

const app = express();
const accessTokenSecret = 'FlyingFoxMansRealNameIsNotJonJohnman';

const users = [
    {
        username: 'AlienManStalker',
        password: 'password123admin',
        role: 'admin'
    }, {
        username: 'SuperStrongMan',
        password: 'password123member',
        role: 'member'
    }
];

const message = {
    message: "Hello, world!"
}

const goodGuys = [
    {
        "heroName": "Super Strongman",
        "power": "Super Strong"
    },
    {
        "heroName": "Alien Man Stalker",
        "power": "Weird Alien Stuff"
    },
    {
        "heroName": "Green Beacon",
        "power": "Shoots Green Beams "
    },
    {
        "heroName": "Speed",
        "power": "Goes Fast"
    },
    {
        "heroName": "Amazing Woman",
        "power": "Strong and has rope."
    },
    {
        "heroName": "Flying Fox Man",
        "power": "Rich, Dresses as Flying Fox"
    },
    {
        "heroName": "Avian Girl",
        "power": "Has Wings"
    },
];

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

app.use(bodyParser.json());

app.listen(port, () => {
    console.log('Authentication service started on port 3000');
});

app.get('/', (req, res) => {
    res.json(message);
});

app.post('/v1/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => { return u.username === username && u.password === password });
    if (user) {
        const accessToken = jwt.sign({ username: user.username,  role: user.role }, accessTokenSecret);
        res.json({
            accessToken
        });
    } else {
        res.send('Username or password incorrect');
    }
});

app.get('/v1/goodguys', authenticateJWT, (req, res) => {
    res.json(goodGuys);
});

app.get('/v1/goodguys/1', authenticateJWT, (req, res) => {
    res.json(goodGuys[1]);
});

app.get('/v1/goodguys/3', authenticateJWT, (req, res) => {
    res.json(goodGuys[3]);
});

app.get('/v1/goodguys/5', authenticateJWT, (req, res) => {
    res.json(goodGuys[5]);
});