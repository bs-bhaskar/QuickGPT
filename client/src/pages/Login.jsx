import React,{useState} from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();//👉 login ke baad redirect
  const [state, setState] =useState("login");//state → login or register mode
  const [name, setName] = useState("");//name → only in signup
  const [email, setEmail] = useState("");//email/password → auth data
  const [password, setPassword] = useState("");
  const {axios,setToken}=useAppContext()
  // 👉 axios → API
  // 👉 setToken → login success

  const handleSubmit=async (e)=>{
    e.preventDefault();//👉 form reload prevent
    // 🔥 Dynamic URL
    const url=state==="login"?'/api/user/login':'/api/user/register'//👉 same form → 2 APIs
    try {
      // 🌐 API Call
      const {data}=await axios.post(url,{name,email,password})//👉 backend: login / register
      if(data.success){
        setToken(data.token)
        localStorage.setItem('token',data.token)
        navigate('/')
      }
      // 💥 Flow:
      // token set in context
      // save in localStorage
      // AppContext trigger
      // user fetch
      // UI switch → main app
      // 🔥 full auth cycle
      else{
         toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
      <p className="text-2xl font-medium m-auto">
        <span className="text-purple-700">User</span>{" "}
        {state === "login" ? "Login" : "Sign Up"}
      </p>
      {state === "register" && (//👉 sirf signup me name
        <div className="w-full">
          <p>Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-700"
            type="text"
            required
          />
        </div>
      )}
      <div className="w-full ">
        <p>Email</p>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="type here"
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-700"
          type="email"
          required
        />
      </div>
      <div className="w-full ">
        <p>Password</p>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="type here"
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-700"
          type="password"
          required
        />
      </div>
      {state === "register" ? (
        <p>
          Already have account?{" "}
          <span
            onClick={() => setState("login")}
            className="text-purple-700 cursor-pointer"
          >
            click here
          </span>
        </p>
      ) : (
        <p>
          Create an account?{" "}
          <span
            onClick={() => setState("register")}//👉 same form reuse
            className="text-purple-700 cursor-pointer"
          >
            click here
          </span>
        </p>
      )}
      <button type="submit" className="bg-purple-700 hover:bg-purple-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
        {state === "register" ? "Create Account" : "Login"}
      </button>
    </form>
  );
};

export default Login;
// 🧠 FULL FLOW

// User → form fill
// → submit
// → API
// → token
// → AppContext
// → user fetch
// → UI change

// 👉 what Login.jsx do?

// login/register toggle
// API call
// token store
// app unlock