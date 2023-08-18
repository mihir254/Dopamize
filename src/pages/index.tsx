import { HiPlus, HiX, HiCheck, HiOutlineTrash } from "react-icons/hi";
import { RxTrash } from "react-icons/rx";
import { useEffect, useState } from "react";
import { DragDropContext, DragStart, DragUpdate, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

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

    useEffect(() => {
        setReady(true);
    }, []);

    const handleTaskStatusChange = (index: number) => {
        setTasks(prevTasks => prevTasks.map((task, ind) => {
            if (ind == index) {
                return {...task, completed: !task.completed }
            }
            return task;
        }));
    }

    const handleTaskDelete = (index: number) => {
        setTasks(prevTasks => prevTasks.filter((task, ind) => index !== ind));
    }

    const handleAddTask = () => {
        setTaskFormActive(!taskFormActive);
    }

    const handleSaveTask = () => {
        setTaskFormActive(false);
        setTaskForm(initialTaskForm);
        setTasks(prevTasks => [taskForm, ...prevTasks]);
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

    return (
        ready &&
        <DragDropContext
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
            onDragEnd={onDragEnd}
        >
            <div className="flex flex-col h-screen bg-[#222222] items-center">
                <div className="w-screen h-20 bg-[#000000] flex items-center shadow-lg">
                    <p className="text-white text-4xl font-sans font-semibold pl-5">EZIMAPOD</p>
                </div>
                <button className="w-1/2 bg-[#000000] mt-10 rounded-2xl shadow-xl flex flex-col items-center justify-center">
                    <p className="text-white font-semibold font-mono text-2xl mt-5 pb-2">TODAY'S PROGRESS</p>
                    <div className="w-4/5 h-8 bg-white rounded-full mb-8 overflow-hidden">
                        {tasks.length > 0 && <div className="h-8 bg-sky-500 rounded-l-full flex items-center justify-end" style={{width: `${((tasks.filter(task => task.completed).length / tasks.length * 100).toFixed(0))}%`}}>
                            <p className="pr-3 text-white font-semibold font-mono">{(tasks.filter(task => task.completed).length / tasks.length * 100).toFixed(0)}%</p>
                        </div>}
                    </div>
                </button>
                <div className="h-2/3 w-1/2 mt-10 shadow-2xl rounded-2xl bg-[#111111] flex flex-col">
                    <div className="flex items-center justify-between py-3 px-5 rounded-t-2xl bg-[#000000]">
                        <p className="text-white font-semibold text-3xl">TASKS</p>
                        <button className="flex border-4 border-gray-500 w-14 h-14 rounded-full items-center justify-center" onClick={handleAddTask}>
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
                                            onClick={handleSaveTask}
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
                                                    <button className="flex items-center justify-center h-10 w-10 rounded-full border-2 border-white" onClick={() => handleTaskStatusChange(index)}>
                                                        {item.completed ? <div className="flex items-center justify-center h-8 w-8 rounded-full bg-sky-600">
                                                            <HiCheck size={22} color="white"/>
                                                        </div> : null}
                                                    </button>
                                                    <p className="ml-16 font-mono text-xl font-semibold">{item.task}</p>
                                                    <button className="ml-auto flex items-center justify-center h-10 w-10 rounded-xl bg-red-500" onClick={() => handleTaskDelete(index)}>
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
                </div>
            </div>
        </DragDropContext>
    )
}

export default Home;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const server = process.env.SERVER;
		let initialTasks = await fetch(`${server}/api/tasks`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
        console.log(initialTasks);
		return {
			props: {
                initialTasks: []
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