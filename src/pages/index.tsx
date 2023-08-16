import { MdDone } from "react-icons/md";
import { useState } from "react";

const Home = () => {
    const initialTasks = [
        {completed: false, name: "This is test task 1"},
        {completed: false, name: "This is test task 2"},
        {completed: true, name: "This is test task 3"},
        {completed: false, name: "This is test task 4"},
        {completed: true, name: "This is test task 5"},
    ];

    const [tasks, setTasks] = useState(initialTasks);

    const handleTaskStatusChange = (index: number) => {
        setTasks(prevTasks => prevTasks.map((task, ind) => {
            if (ind == index) {
                return {...task, completed: !task.completed }
            }
            return task;
        }))
    }

    return (
        <div className="flex flex-col h-screen bg-[#222222] items-center">
            <div className="w-screen h-20 bg-[#000000] flex items-center shadow-lg">
                <p className="text-white text-4xl font-mono font-semibold pl-5">EZIMAPOD</p>
            </div>
            <button className="w-1/2 bg-[#000000] mt-10 rounded-2xl shadow-xl flex flex-col items-center justify-center">
                <p className="text-white font-semibold font-mono text-2xl mt-5 pb-2">TODAY'S PROGRESS</p>
                <div className="w-4/5 h-8 bg-white rounded-full mb-8">
                    <div className="w-[77%] h-8 bg-sky-500 rounded-l-full flex items-center justify-end">
                        <p className="pr-3 text-white font-semibold font-mono">77%</p>
                    </div>
                </div>
            </button>
            <div className="p-5 w-1/2 mt-10 shadow-2xl rounded-2xl bg-[#111111] flex flex-col">
                <p className="text-white font-semibold text-3xl mt-5 mb-7">TASKS</p>
                <ul className="text-gray-300">
                    {tasks.map((item, index) => {
                        return (
                            <li key={index} className="flex items-center p-2 m-2">
                                <button className="flex items-center justify-center h-10 w-10 rounded-full border-2 border-white" onClick={() => handleTaskStatusChange(index)}>
                                    {item.completed ? <div className="flex items-center justify-center h-8 w-8 rounded-full bg-sky-600">
                                        <MdDone size={22} color="white"/>
                                    </div> : null}
                                </button>
                                <p className="ml-16 font-mono text-xl font-semibold">{item.name}</p>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Home;