import { Outlet } from "react-router-dom"
import {useState} from "react"
import { AdminNavbar } from "../../Features"

export function AdminRootPage(){
    const [searchParameter , setSearchParameter] = useState("")
    return(
        <div>
            <Outlet />
        </div>
    )
}