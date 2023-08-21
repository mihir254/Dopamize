import { HiPlus, HiX, HiCheck, HiOutlineTrash } from "react-icons/hi";
import { RxTrash } from "react-icons/rx";
import { useEffect, useState } from "react";
import { DragDropContext, DragStart, DragUpdate, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import TaskData from "./components/data";

type Task = {
    _id: string,
    completed: boolean,
    task: string,
}

const initialTaskForm: Task = {
    _id: '-1',
    completed: false,
    task: '',
}

const Home = ({ initialTasks }: { initialTasks: Task[] }) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks || []);
    const [taskFormActive, setTaskFormActive] = useState <boolean> (false);
    const [taskForm, setTaskForm] = useState<Task>(initialTaskForm);
    const [ready, setReady] = useState <boolean> (false);
    const [activeScreen, setActiveScreen] = useState<string>('Daily');

    useEffect(() => {
        setReady(true);
    }, []);

    const handleTaskAdd = async () => {
        setTaskFormActive(false);
        const response = await fetch("/api/tasks", {
            method: "POST",
            body: JSON.stringify(taskForm),
        });
        if (response.ok) {
            const data = await response.json();
            setTasks(prevTasks => [{_id: data?.data, task: taskForm.task, completed: false}, ...prevTasks]);
        }
        setTaskForm(initialTaskForm);
    }

    const handleTaskUpdate = async (id: string) => {
        const taskToUpdate = tasks.filter((task: Task) => task._id === id)[0];
        const response = await fetch (`/api/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                task: taskToUpdate.task,
                completed: !taskToUpdate.completed,
            })
        });
        if (response.ok) {
            const data = await response.json();
            setTasks(prevTasks => prevTasks.map((task, ind) => {
                if (task._id == id) {
                    return {...task, completed: !task.completed }
                }
                return task;
            }));
        }
    }

    const handleTaskDelete = async (id: string) => {
        const response = await fetch(`/api/tasks/${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            const data = await response.json();
            setTasks(prevTasks => prevTasks.filter((task, ind) => task._id !== id));
        }
    }

    const handleAddTask = () => {
        setTaskFormActive(!taskFormActive);
    }

    const onDragStart = (start: DragStart) => {
        const { source } = start;
    }

    const onDragUpdate = (update: DragUpdate) => {
        const { source, destination } = update;
    }

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const reorderedTasks = reorderTasks(tasks, source.index, destination.index);
        setTasks(reorderedTasks);
    }

    const reorderTasks = (list: Task[], sourceIndex: number, destinationIndex: number) => {
        const reorderedList = Array.from(list);
        const [removed] = reorderedList.splice(sourceIndex, 1);
        reorderedList.splice(destinationIndex, 0, removed);
        return reorderedList;
    }

    const toggleActiveScreen = () => {
        if (activeScreen === 'Daily') {
            setActiveScreen('Monthly');
        } else {
            setActiveScreen('Daily');
        }
    }

    return (
        ready &&
        <DragDropContext
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
            onDragEnd={onDragEnd}
        >
            <div className="flex flex-col h-screen bg-[#222222] items-center">
                <div className="w-screen h-20 bg-[#000000] flex items-center shadow-lg">
                    <p className="text-white text-2xl sm:text-4xl font-sans font-semibold px-5 py-5 sm:py-0">EZIMAPOD</p>
                </div>
                <button className="w-5/6 md:w-3/4 lg:w-1/2 bg-[#000000] mt-7 sm:mt-10 rounded-2xl shadow-xl flex flex-col items-center justify-center" onClick={toggleActiveScreen}>
                    <p className="text-white font-semibold font-mono text-lg sm:text-xl md:text-2xl mt-5 pb-2">TODAY'S PROGRESS</p>
                    <div className="w-4/5 h-8 bg-white rounded-full mb-8 overflow-hidden">
                        {tasks.length > 0 && <div className="h-8 bg-sky-500 rounded-l-full flex items-center justify-end" style={{width: `${((tasks.filter(task => task.completed).length / tasks.length * 100).toFixed(0))}%`}}>
                            <p className="pr-3 text-white font-semibold font-mono">{(tasks.filter(task => task.completed).length / tasks.length * 100).toFixed(0)}%</p>
                        </div>}
                    </div>
                </button>
                {activeScreen === 'Daily' ? <div className="mb-3 overflow-hidden w-6/7 md:w-3/4 lg:w-1/2 mt-7 sm:mt-10 shadow-2xl rounded-2xl bg-[#111111] flex flex-col">
                    <div className="flex items-center justify-between py-3 px-5 rounded-t-2xl bg-[#000000]">
                        <p className="text-white font-semibold text-xl sm:text-2xl md:text-3xl">TASKS</p>
                        <button className="flex border-4 border-gray-500 w-10 h-10 md:w-14 md:h-14 rounded-full items-center justify-center" onClick={handleAddTask}>
                            {taskFormActive ? <HiX color="white" size={28}/> : <HiPlus color="white" size={28}/>}
                        </button>
                    </div>
                    <ul className="p-5 flex-1 text-gray-300 overflow-y-auto scrollbar-hidden">
                        <Droppable droppableId="col">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {taskFormActive ? <div className="flex items-center p-4 m-2 border-2 border-slate-500 rounded-lg">
                                        <input type="text" value={taskForm.task} placeholder="What would you like to do today?" autoFocus
                                            className="font-mono text-xl font-semibold w-4/5 pl-5 pr-3 py-2
                                            rounded-sm bg-transparent border-b-2 border-slate-500
                                            focus:ring-0 focus:outline-none focus:border-sky-500"
                                            onChange={(e) => setTaskForm({ ...taskForm, task: e.target.value })}
                                        />
                                        <button disabled={taskForm.task === ''} className="ml-auto flex items-center justify-center h-12 w-12
                                            rounded-full border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                                            onClick={handleTaskAdd}
                                        >
                                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-500">
                                                <HiCheck size={26} color="white"/>
                                            </div>
                                        </button>
                                    </div> : null}
                                    {tasks.map((item, index) => (
                                        <Draggable key={item._id} draggableId={item._id} index={index}>
                                            {(provided, snapshot) => (
                                                <li key={index}
                                                    className="flex items-center p-4 m-2 rounded-lg cursor-pointer bg-slate-700 outline-2 shadow-2xl"
                                                    {...provided.dragHandleProps}
                                                    {...provided.draggableProps}
                                                    ref={provided.innerRef}
                                                >
                                                    <button className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-white" onClick={() => handleTaskUpdate(item._id)}>
                                                        {item.completed ? <div className="flex items-center justify-center h-8 w-8 rounded-full bg-sky-600">
                                                            <HiCheck size={22} color="white"/>
                                                        </div> : null}
                                                    </button>
                                                    <p className="ml-5 sm:ml-8 md:ml-16 font-mono text-md sm:text-lg md:text-xl font-semibold">{item.task}</p>
                                                    <button className="ml-auto flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-red-500" onClick={() => handleTaskDelete(item._id)}>
                                                        <RxTrash size={22} color="white"/>
                                                    </button>
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </ul>
                </div> : null}
            </div>
        </DragDropContext>
    )
}

export default Home;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const server = process.env.SERVER;
		let response = await fetch(`${server}/api/tasks`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
        const taskResponse = await response.json();
        const initialTasks = taskResponse?.data;
		return {
			props: {
                initialTasks
			}
		}
	} catch (error) {
		console.log("Something went wrong in getServerProps: ", error);
		return {
			props: {
			}
		}
	}
}