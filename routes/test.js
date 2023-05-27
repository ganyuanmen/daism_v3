function a(req, res, next)
{
    console.log('a');
    next()
}

function b(req, res, next)
{
    console.log('b');
    res.status(202).json({msg:'ookk'})

}


function c(req, res, next)
{
    console.log('c');
    res.status(200).json({msg:'ok'})
}

module.exports = {
    post:[
        a,b,c
    ]
}