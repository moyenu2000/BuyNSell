const express=require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.json(
        [
            {
                username: 'Moyen',
                age: 23
            },
            {
                username: 'alu',
                age: 32
            }
        ]
    )
})

module.exports =router;