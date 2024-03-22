"use client";
import Todo from "@/Components/Todo";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast, useToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [todoData, setTodoData] = useState([]);
  const fetchTodos = async () => {
    const response = await axios('/api')
    setTodoData(response.data.todos);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const deleteTodo = async(id)=>{
    const response = await axios.delete('/api' , {
      params:{
        mongoId:id
      }
    })
    toast.success(response.data.msg);
    fetchTodos();
  }
  const completeTodo  = async(id)=>{
    const response = await axios.put('/api' ,{}, {
      params:{
        mongoId:id
      }
    })
    toast.success(response.data.msg);
    fetchTodos();
  }
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((form) => ({ ...form, [name]: value }));
    console.log(formData);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api", formData);
      toast.success(response.data.msg);
      setFormData({
        title: "",
        description: "",
      });
      await fetchTodos();
    } catch (err) {
      toast.error("Error");
    }  
  };
  return (
    <>
      <ToastContainer theme="dark" />
      <form
        onSubmit={onSubmit}
        className="flex items-start flex-col gap-2 w-[80%] max-w-[600px] mx-auto mt-24 px-2"
      >
        <input
          type="text"
          value={formData.title}
          name="title"
          placeholder="Enter Title"
          className="px-3 py-2 border-2 w-full"
          onChange={onChangeHandler}
        />
        <textarea
          name="description"
          value={formData.description}
          placeholder="Enter Description "
          onChange={onChangeHandler}
          className="px-3 py-2 border-2 w-full"
        ></textarea>
        <button type="submit" className="bg-orange-600 py-3 px-11 text-white ">
          Add Todo
        </button>
      </form>

      <div className="relative overflow-x-auto mx-auto w-[55%] mt-16">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-100 uppercase bg-gray-600">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {todoData.map((item, index) => {
              return (
                <Todo
                  key={index}
                  title={item.title}
                  description={item.description}
                  complete={item.isCompleted}
                  mongoId={item._id}
                  fetchTodos={fetchTodos}
                  deleteTodo={deleteTodo}
                  completeTodo={completeTodo}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
