import "./db";
import "./models/video";
import app from "./server";



/////////////////////////////////////////////////////////////////////////////////
/// server part /////////////////////////////////////////////////////////////////

const PORT = 4000;
const handleListening = () =>
console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);