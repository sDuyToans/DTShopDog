module.exports = fn  =>{
    // return Promise
    //     .resolve(fn(req, res, next))
    //     .catch(next)
    return (req, res, next) =>{
                fn(req, res, next).catch(next);
            }
};

//function fn de bat loi Async thay vi su dung try catch 
//function nay cung co the viet vang tat dieu quan trong la no se ve 1 Promise(resolve va reject) cai ma se thuc hien function fn(resolve(fn(req, res, next))) 
//neu co loi(bi reject) xay ra thi .catch then call next: tiep can trinh xu li nhanh va se avoid duoc UnhandledPromiseRejectionWarning

// const fn = (req, res, next) =>{
//     return (req, res, next) =>{
//         fn(req, res, next).catch(next);
//     }
// }