const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const { isAuthenticatedUser, authorizeRoles } = require('./middlewares/authenticate');

//Routes imports
const userRoute = require('./routes/users');
const loginRoute = require('./routes/login');
const unitRoute = require('./routes/units');
const departmentRoute = require('./routes/departments');
const projectRoute = require('./routes/projects');
const taskRoute = require('./routes/tasks');
const adminDashRoute = require('./routes/admindash');

const singleuserRoute = require('./routes/userController');
const timelogRoute = require('./routes/timelogs');

//Middlewares
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,  
}));
app.use(cookieParser());

//DB Connect
mongoose.connect('mongodb://localhost:27017/timesheet').
then( () => {
    console.log(`MongoDB is connected`);
}).
catch( (error) => {
    console.log(error);
});

//Use Routes Admin
app.use('/api/users/',isAuthenticatedUser,authorizeRoles('Admin'),userRoute);
app.use('/api/login/',loginRoute);
app.use('/api/unit/',isAuthenticatedUser,authorizeRoles('Admin'),unitRoute);
app.use('/api/department/',isAuthenticatedUser,authorizeRoles('Admin'),departmentRoute);
app.use('/api/project/',isAuthenticatedUser,authorizeRoles('Admin'),projectRoute);
app.use('/api/task/',isAuthenticatedUser,authorizeRoles('Admin'),taskRoute);
app.use('/api/admindash/',isAuthenticatedUser,authorizeRoles('Admin'),adminDashRoute);

//Use Routes User
app.use('/api/user/',isAuthenticatedUser,authorizeRoles('User'),singleuserRoute);
app.use('/api/timelog/',isAuthenticatedUser,authorizeRoles('User'),timelogRoute);

//Server listen
const PORT = 8000;
app.listen(PORT, () =>{
    console.log(`Server is listening to the port ${PORT}`);
});