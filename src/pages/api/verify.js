export default function handler(req, res) {
    const { code } = req.body;
  
    // Check if verification code is valid
    if (code.length !== 6 || code.slice(-1) === "7") {
      res.status(400).json({ error: "Verification Error" });
    } else {
      res.status(200).json({ success: true });
    }
  }