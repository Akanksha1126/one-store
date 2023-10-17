exports.handleOptionReq = (req, res) => {
    res.set({
        "Access-Control-Allow-Headers" : "Content-Type,x-access-token",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE"
      });
    res.status(200).send({ message: "hello from Onestore" });
};