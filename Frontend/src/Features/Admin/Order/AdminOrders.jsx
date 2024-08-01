import { useSelector , useDispatch } from "react-redux"
import { useEffect , useState , useRef} from "react"
import {fetchAllOrdersAsync , selectAllOrders ,selectTotalOrders ,selectAdminAPIStatus} from "../AdminSlice"
import { AdminOrderTile } from "./AdminOrderTile"
import { MdKeyboardArrowDown } from "react-icons/md";
import {Pagination} from "../../Common/Pagination"
import {Loader} from "../../../utils/Loader"


export function AdminOrders() {
  const orders = useSelector(selectAllOrders)
  const totalOrders = useSelector(selectTotalOrders)
  const fetchOrdersStatus = useSelector(selectAdminAPIStatus)
  console.log({fetchOrdersStatus})

  const dispatch = useDispatch()

  const [showSortMenu , setShowSortMenu] = useState(false)
  const sortMenuRef = useRef(null)

  const apiStatus = useSelector(selectAdminAPIStatus)

  const sortOptions = [
    { name: "Total Amount : Low to High", sortBy: "totalAmount", order: "asc" },
    { name: "Total Amount : High to Low", sortBy: "totalAmount", order: "desc" },
    { name: "Latest Orders", sortBy: "createdAt", order: "desc" },
    { name: "Past orders", sortBy: "createdAt", order: "asc" },
  ]


  const [sort , setSort] =  useState({_sort : "createdAt" , _order:"desc"})
  const [page , setPage] = useState(1)

  useEffect(()=>{
    dispatch(fetchAllOrdersAsync({page,sort}))
  },[dispatch , page,sort])


  useEffect(()=>{
    function handleClickOutside(e){
      setShowSortMenu(false)
    }

    window.addEventListener('click', handleClickOutside)

    return ()=>{
      window.removeEventListener('click', handleClickOutside)
    }
  },[])

  return (
    <>
    
    <div className="wrapper md:m-10 bg-white p-2 md:p-4">
      <header className="text-5xl font-bold">
        Orders
      </header>

      <div className="relative hover:cursor-pointer flex justify-end mr-5  ">
        <div 
          className="flex items-center gap-1"
          onClick={(e)=>{
            e.stopPropagation();
            setShowSortMenu(prev => !prev)
          }}
        >
        <div className="text-2xl">Sort</div>
        <MdKeyboardArrowDown className="h-6 w-6" />
        </div>

      {/* sort menu  */}
        <div
          ref= {sortMenuRef}
          className={`${
            showSortMenu ? "flex" : "hidden"
          } sort-menu h-[180px] w-[250px] absolute top-[90%] right-0 z-10 bg-white  shadow-2xl rounded-md border-2 border-gray-200 flex flex-col justify-around`}
        >
          {sortOptions.map((sortOption) => (
            <div
              className={`hover:cursor-pointer ${sort._sort === sortOption.sortBy &&  sort._order === sortOption.order  ? "bg-gray-200" : "" } flex items-center cursor-pointer text-slate-700 p-2 pl-4 text-md font-normal`}
              onClick={() =>
                setSort({ _sort: sortOption.sortBy, _order: sortOption.order })
              }
            >
              {sortOption.name}
            </div>
          ))}
        
        </div>
      </div>


      <hr className="h-2 mt-5 mb-10"/>

      <div> 
      <div className="hidden md:flex column-headings mx-6 md:flex-row mt-4 ">
      <div className="text-lg font-semibold flex items-center justify-center w-[10%]">Order ID</div>
      <div className="text-lg font-semibold flex items-center justify-center w-[30%]">Items</div>
      <div className="text-lg font-semibold flex items-center break-words text-center justify-center w-[10%]">Total Amount</div>
      <div className="text-lg font-semibold flex items-center break-words text-center justify-center w-[10%]">Ordered At</div>
      <div className="text-lg font-semibold flex items-center justify-center w-[30%]">Shipping Details</div>
      <div className="text-lg font-semibold flex items-center justify-center w-[10%]">Actions</div>
    </div>
      {fetchOrdersStatus==="loading" && <Loader/>}
      
      {
        apiStatus==="loading" ? <p w-full text-center mt-10 text-4xl font-semibold>Loading</p> : 
        !orders || orders?.length === 0 ? <p className="w-full text-center mt-10 text-4xl font-semibold">No orders found</p> 
        : 
        orders?.map((order)=> <AdminOrderTile order={order}/>)
      }
      </div>
    </div>

    <div className="mx-12">
    <Pagination page={page}  setPage={setPage} totalDocs={totalOrders}/>
    </div>
    </>
  )
}


