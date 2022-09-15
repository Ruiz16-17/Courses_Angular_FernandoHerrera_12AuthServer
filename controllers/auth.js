const { response } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {    

    const { email, name, password} = req.body;

    try {
        
        //verify unique email

        const user = await User.findOne({ email: email});

        if (user) {
            return res.status(400).json({ 
                ok: false,
                msg: 'User already exists'
            });
        }

        //create user with the model
        const dbUser = new User( req.body );

        //encrypting password

        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );

        //generate JWT
        
        const token = await generateJWT(dbUser.id, name );

        //create user in database
        await dbUser.save();

        //generate successful response
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: email,
            message: 'Create user /new',
            token: token
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Please, contact to admin',
        });
    }

};

const loginUser = async(req, res = response) => {

    const { email, password} = req.body;

    try {
        
        const  dbUser = await User.findOne({ email: email});

        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'Credentials are not available'
            })
        }

        const validPassword = bcrypt.compareSync( password, dbUser.password );
        
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Credentials are not available'
            });
        }

        const token = await generateJWT(dbUser.id, dbUser.name, dbUser.email );

        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token: token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please, contact to admin'
        });
    }

};

const revalidateToken = async(req, res) => {

    const { uid } = req;

    const dbUser = await User.findById(uid);

    const token = await generateJWT( uid, dbUser.name );

    return res.json({
        ok: true,
        uid: uid,
        name: dbUser.name,
        email: dbUser.email,
        token: token
    });
};

module.exports = {
    createUser,
    loginUser,
    revalidateToken
};