import React, { useContext, useState, useEffect } from "react";
import { Paper, Avatar, Typography, TextField, Button } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import PersonIcon from "@mui/icons-material/Person";
import "./RegisterPage.css";
import { Link } from "react-router-dom";
import { signup } from "../../firebase";
import { toast } from "react-toastify";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { AuthContext } from "../../context/authContext";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const paperStyle = {
    padding: "30px 20px",
    margin: "20px auto",
  };
  const headerStyle = { margin: 0 };
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const marginTop = { marginTop: 8 };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error("Please fill all the required fields!");
    } else if (password.length < 6) {
      toast.error("Password should be atlast 6 characters long!");
    } else {
      setLoading(true);
      try {
        const result = await signup(email, password);
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          name,
          email,
          createdAt: Timestamp.fromDate(new Date()),
          isOnline: true,
        });
        setLoading(false);
        toast.success("Account Registered!");
        setEmail("");
        setPassword("");
        setName("");
        navigate("/");
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
        navigate("/");
      }
    }
  };
  if (loading) {
    return (
      <Loader
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  } else {
    return (
      <div className="container registerPage__wrapper">
        <Paper elevation={20} style={paperStyle}>
          <div align="center">
            <Avatar style={avatarStyle}>
              <PersonIcon />
            </Avatar>
            <h2 style={headerStyle}>Register</h2>
            <Typography variant="h6" gutterBottom style={marginTop}>
              Create an account !
            </Typography>
          </div>
          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              type="text"
              value={name}
              placeholder="Enter your name"
              className="registerPage__input"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="registerPage__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="registerPage__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox name="checkedA" />}
              label="I accept the terms and conditions."
            />
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#1bbd7e", width: "100%" }}
              disabled={!email || !password || !name}
            >
              Register
            </Button>
            <Typography variant="subtitle1" style={{ marginTop: 8 }}>
              Already have an account? <Link to="/login">Login</Link>{" "}
            </Typography>
          </form>
        </Paper>
      </div>
    );
  }
};

export default RegisterPage;
