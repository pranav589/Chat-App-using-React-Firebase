import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Avatar, Button, Paper, TextField, Typography } from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [userName, setUserName] = useState("");
  const [img, setImg] = useState("");
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });
  }, [img, userName]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (img) {
      const imgRef = ref(
        storage,
        `avatar/${new Date().getTime()} - ${img.name}`
      );
      try {
        if (user.avatarPath) {
          await deleteObject(ref(storage, user.avatarPath));
        }
        const snap = await uploadBytes(imgRef, img);
        const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: url,
          avatarPath: snap.ref.fullPath,
        });
        setImg("");
        toast.success("Profile Image Updated!");
        navigate("/");
      } catch (error) {
        console.log(error.message);
        toast.error("Error!");
        navigate("/");
      }
    }
    if (userName) {
      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          name: userName,
        });
        setUserName("");
        toast.success("Username Updated!");
      } catch (error) {
        console.log(error.message);
        toast.error("Error!");
        navigate("/");
      }
    }
    setLoading(false);
  };

  if (!user || loading) {
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
  }

  return (
    <Paper elevation={20} className="profilePage">
      <div className="profilePage__img">
        <Avatar
          src={
            user?.avatar ||
            "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=20&m=1223671392&s=612x612&w=0&h=lGpj2vWAI3WUT1JeJWm1PRoHT3V15_1pdcTn2szdwQ0="
          }
          className="profilePage__avatar"
        />
        <div className="file">
          <label htmlFor="file-upload" className="custom-file-upload">
            <CameraAltIcon />
          </label>
          <input
            id="file-upload"
            type="file"
            accept="'image/*"
            onChange={(e) => setImg(e.target.files[0])}
            className="profile__img"
          />
        </div>
      </div>
      <Typography variant="h6">{user?.name}</Typography>
      <Typography variant="h6">{user?.email}</Typography>
      <div className="profilePage__userData">
        <TextField
          fullWidth
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          label="Name"
          placeholder="Enter your name"
        />
      </div>
      <Button
        variant="contained"
        style={{
          backgroundColor: "#1bbd7e",
          marginTop: 8,
          width: "100%",
        }}
        disabled={!img && !userName}
        onClick={handleUpdate}
      >
        Update
      </Button>
    </Paper>
  );
}

export default ProfilePage;
