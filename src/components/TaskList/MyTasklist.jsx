import TaskItem from "./TaskItem";

const MyTasklist = ({
  tasks,
  getGridClass,
  editId,
  setEditId,
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  updateTaskInState,
  API_URL,
  handleDelete,
}) => {
  return (
    <div className="row g-2 g-md-3">
      {tasks.length === 0 ? (
        <div className="col-12 text-center py-5">
          <div className="text-muted" style={{ fontSize: "1.1rem" }}>No tasks found!</div>
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className={getGridClass()}>
            <TaskItem
              task={task}
              editId={editId}
              setEditId={setEditId}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editDescription={editDescription}
              setEditDescription={setEditDescription}
              updateTaskInState={updateTaskInState}
              API_URL={API_URL}
              handleDelete={handleDelete}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default MyTasklist;
