import jwt from "jsonwebtoken";


const encodeToken = (payload)=>{
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}
const decodeToken = (payload)=>{
    return jwt.verify(payload, process.env.JWT_SECRET);
  
}
export {encodeToken, decodeToken}