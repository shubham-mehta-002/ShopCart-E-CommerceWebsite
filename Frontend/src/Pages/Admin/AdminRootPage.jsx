import { Outlet } from "react-router-dom"
import {useState} from "react"

export function AdminRootPage(){
    const [searchParameter , setSearchParameter] = useState("")
    return(
        <div>
            <Outlet />
        </div>
    )
}