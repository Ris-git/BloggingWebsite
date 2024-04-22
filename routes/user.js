
const {Router} = require('express');
const User = require('../models/user');
const multer = require('multer');
const path = require('path'); 
const router = Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.resolve('./public/images/'));
    },
    filename: function(req, file, cb){
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({storage: storage});




router.get('/signin', (req, res) => {
    return res.render('signin');
});

router.post('/signin', async(req, res) => {
    const {email, password} = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken(email, password);
        console.log()
        return res.cookie('token', token).redirect('/');
    }
    catch(error){
        return res.render('signin', {
            error: "Incorrect Email or Password",
        });
    }

});

router.get('/logout', (req, res) => {
    return res.clearCookie('token').redirect('/');
});


router.get('/signup', (req, res) => {
    return res.render('signup');
});

router.post('/signup', upload.single('profileImage'), async (req, res) => {
    const { fullName, email, password, userName} = req.body;

   
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', {
                error: "Account Already Exists"
            });
        }

        const user = await User.create({
            fullName,
            email,
            password,
            userName,
            profileImageUrl: `/images/${req.file.filename}`,
        });
        return res.redirect('/');
    
});

module.exports = router;


