const jwt = require("jsonwebtoken");

//second possible jwt cookie authentication method below... Above is the one by web dev simplified
function authenticateTokenTwo(req: any, res: any, next: any) {
  const token = req.cookies.token;
  console.log(token);
  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    console.log(req.user); //here we can view the actual user email which is interesting
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.json({ failure: "invalid token and jwt token cookie cleared" });
  }
}

export { authenticateTokenTwo };
