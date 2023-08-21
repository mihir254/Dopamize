const TaskData = () => {
    return (
        <div className="w-1/2 border text-white flex flex-1">
            {[1, 2, 3, 4, 5].map((item, index) => (
                <div className="w-10 h-10 rounded-full border flex flex-row">

                </div>
            ))}
        </div>
    )
}

export default TaskData;