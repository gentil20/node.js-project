

const requestlogger=(req,res,next)=>{
    console.log(`[${req.method}] ${req.url} ${new Date()}`);
    next();


    //[POST] HTTP:


}

module.exports =requestlogger;