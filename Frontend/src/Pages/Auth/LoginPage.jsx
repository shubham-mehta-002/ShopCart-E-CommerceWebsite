import { LoginForm } from "../../Features";
import {selectLoggedInUser} from "../../Features/Auth/AuthSlice"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {useEffect} from "react"

export function LoginPage() {
  return (
    <LoginForm />
  )
  ;
}
