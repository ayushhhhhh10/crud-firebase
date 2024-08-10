import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "./firebase/firebase";

const App = () => {
  const [emp, setEmp] = useState(null);
  const [data, setData] = useState({
    name: "",
    email: "",
    address: "",
    salary: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [docId, setDocId] = useState("");

  const getEmp = async () => {
    const d = await getDocs(collection(db, "emp"));
    setEmp(d.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    if (isUpdate) {
      e.preventDefault();
      const updateEmps = async () => {
        await updateDoc(doc(collection(db, "emp"), docId), data);
        setData({ name: "", email: "", address: "", salary: "" });
        setIsUpdate(false);
      };
      updateEmps();
    } else {
      e.preventDefault();
      const addEmp = async () => {
        await addDoc(collection(db, "emp"), data);
        setData({ name: "", email: "", address: "", salary: "" });
      };
      addEmp();
    }
  };

  const deleteEmp = async (id) => {
    const empRef = doc(collection(db, "emp"), id);
    await deleteDoc(empRef);
  };

  const updateEmp = (data) => {
    setIsUpdate(true);
    setData({
      name: data.name,
      email: data.email,
      address: data.address,
      salary: data.salary,
    });
    setDocId(data.id);
  };

  useEffect(() => {
    getEmp();
  }, [emp]);

  return (
    <div className="w-full h-screen p-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full sm:w-1/4 gap-2"
      >
        <input
          onChange={inputHandler}
          className="px-2 py-1 text-sm border border-black"
          type="text"
          name="name"
          placeholder="Enter your name"
          value={data.name}
        />
        <input
          onChange={inputHandler}
          className="px-2 py-1 text-sm border border-black"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={data.email}
        />
        <input
          onChange={inputHandler}
          className="px-2 py-1 text-sm border border-black"
          type="text"
          name="address"
          placeholder="Enter your address"
          value={data.address}
        />
        <input
          onChange={inputHandler}
          className="px-2 py-1 text-sm border border-black"
          type="number"
          name="salary"
          placeholder="Enter your salary"
          value={data.salary}
        />
        <button className="bg-blue-600 px-3 py-1 text-white">
          {isUpdate ? "Update" : "Add"}
        </button>
      </form>
      <table className="w-2/3 text-sm text-left text-gray-500 dark:text-gray-400 mt-5">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Address
            </th>
            <th scope="col" className="px-6 py-3">
              Salary
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {emp?.map((v, i) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              key={i}
            >
              <td className="px-6 py-3">{v.id}</td>
              <td className="px-6 py-3">{v.name}</td>
              <td className="px-6 py-3">{v.email}</td>
              <td className="px-6 py-3">{v.address}</td>
              <td className="px-6 py-3">{v.salary}</td>
              <button
                onClick={() => deleteEmp(v.id)}
                className="px-6 py-3 rounded-lg text-white"
              >
                Delete
              </button>
              <button
                onClick={() => updateEmp(v)}
                className="px-6 py-3 rounded-lg text-white"
              >
                Update
              </button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
