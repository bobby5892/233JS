import React from 'react';

class TaskForm extends React.Component {

    render() {
        return (
            <div className="row input-area">
                <form onSubmit={this.submitTask}>
                    <div class="col-md-1">
                        <label htmlFor="task">Task:</label>
                    </div>
                    <div class="form-group col-md-10">
                        <input className="form-control"
                            type="input" name="task" 
                            value={this.state.task}
                            onInput={this.inputUpdated}
                        />
                    </div>
                    <div class="form-group col-md-1">
                        <button type="submit" className="btn btn-success"> Add Task </button>
                    </div>
                    <div class="col-md-1"></div>
                </form>
            </div>
        );
    }
}

export default TaskForm;