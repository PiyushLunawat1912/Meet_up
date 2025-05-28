const express = require("express");
const { signupUser, loginUser } = require("../handlers/auth-handler.js"); 

const router = express.Router();



 router.post("/sign-up", async(req,res)=>{
    let model = req.body;
    
    if (model.name && model.email && model.password) {
        //TO Do Sign-Up
        await signupUser(model);
        res.send({
            message: "User Signed Up Successfully",
        })
    }
    else{
        res.status(400).json({
            error: "Please Provide Proper Details"
        })
    }
 });
 
router.post("/login", async (req, res) => {
  const model = req.body;

  if (!model.email || !model.password) {
    return res.status(400).json({
      error: "Please provide email and password"
    });
  }

  try {
    const result = await loginUser(model);
    if (result) {
      res.send(result);
    } else {
      res.status(400).json({
        error: "Invalid credentials"
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      error: "Internal server error"
    });
  }
});


module.exports = router;