class TaskClient {
  
    constructor() {
      this.idSeq = 3;
      this.tasks = [
        { id: 1, name: 'Follow up SRE Support' },
        { id: 2, name: 'Read IAM Service Spec' },
        { id: 3, name: 'Research chat protocols', completed: true },
      ];
    }
  
    addTask(name) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.tasks.push({
            id: ++this.idSeq,
            name
          });
          resolve();
          // reject(new Error('Oops, plase try again'));
        }, 500);
      });
    }
  
    allTasks() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([...this.tasks]);
          // reject(new Error('Oops, plase try again'));
        }, 500);
      });
    }
  
    outstandingTasks() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(this.tasks.filter((task) => !task.completed));
          // reject(new Error('Oops, plase try again'));
        }, 500);
      });
    }
  
    completedTasks() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(this.tasks.filter((task) => task.completed))
          // reject(new Error('Oops, plase try again'));
        }, 500);
      });
    }
  
    updateTaskStatus(id, completed) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.tasks = this.tasks.map((task) => {
            if (task.id === id) {
              task.completed = completed
            }
  
            return task;
          });
          resolve();
          // reject(new Error('Oops, plase try again'));
        }, 500);
      });
    }
  }


  export default TaskClient;