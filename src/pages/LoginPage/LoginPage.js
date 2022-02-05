import React, { useContext, useEffect, useState } from "react";
import { Paper, Avatar, Typography, TextField, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db, login } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

import Loader from "../../components/Loader/Loader";
import { AuthContext } from "../../context/authContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all the inputs!");
    } else {
      try {
        setLoading(true);
        const result = await login(email, password);
        await updateDoc(doc(db, "users", result.user.uid), {
          isOnline: true,
        });
        setLoading(false);
        toast.success("Welcome back!");
        setEmail("");
        setPassword("");
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
      <div className="container loginPage__wrapper">
        <Paper elevation={20} style={paperStyle}>
          <div align="center">
            <Avatar style={avatarStyle}>
              <PersonIcon />
            </Avatar>
            <h2 style={headerStyle}>Login</h2>
            <Typography variant="h6" gutterBottom style={marginTop}>
              Login and enjoy your chats!
            </Typography>
          </div>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              placeholder="Enter your email"
              className="loginPage__input"
            />
            <TextField
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Enter your password"
              className="loginPage__input"
            />
            <Button
              type="submit"
              variant="contained"
              style={{
                backgroundColor: "#1bbd7e",
                marginTop: 8,
                width: "100%",
              }}
            >
              Login
            </Button>
            <Typography variant="subtitle1" style={{ marginTop: 8 }}>
              New here? <Link to="/register">Register</Link>{" "}
            </Typography>
          </form>
        </Paper>
      </div>
    );
  }
};

export default LoginPage;
