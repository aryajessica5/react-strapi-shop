import { useEffect, useState } from "react"

export default function AddTodo(props) {
    const [importance, setImportance] = useState(props.editItem?.importance || 0)
    const [timely, setTimely] = useState(props.editItem?.timely || 0)
    const [due, setDue] = useState(props.editItem?.timely || "")
    const [text, setText] = useState(props.editItem?.text || "")
    const [timeRequired, setTimeRequired] = useState(props.editItem?.timeRequired || 1)
    const [timeString, setTimeString] = useState('1 hour')


    const handleSubmit = event => {
        event.preventDefault();
        // send todo data back to parent
        props.onSaveTodo({
            'id': props.editItem?.id || null,
            'text': text,
            'due': due,
            'timely': timely,
            'importance': importance,
        })

        //reset todo form after save
        setText('')
        setDue("")
        setImportance(0)
        setTimely(0)
    }

    const handleRangeSlider = event => {
        event.preventDefault()
        setTimeRequired(event.target.value)
        var days = Math.floor(timeRequired / 24);
        var hours = timeRequired % 24;
        setTimeString(`${days ? days + ' days' : ''} ${hours + ' hours'}`);
    }


    // update slider text 
    useEffect(() => {
        console.log(timeRequired);
        var days = Math.floor(parseInt(timeRequired) / 24);
        var hours = parseInt(timeRequired) % 24;
        setTimeString(`${days ? days + ' days' : ''} ${hours + ' hours'}`);
    }, [])

    return (
        <div className="add-todo">
            <h1>{props.editMode ? 'Edit Todo' : 'New Todo'}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Todo</label> <br/>
                    <input
                        required
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        name="text"
                        placeholder="Todo"
                        type="text" />
                </div>
                <div>
                    <label>Due Date</label> <br />
                    <input
                        value={due}
                        onChange={(e) => setDue(e.target.value)}
                        name="due"
                        placeholder="Due date"
                        type="date" />
                </div>
                <div className="stars-input">
                    {/* Estimate of time required - scrollbar */}
                    <label>Estimate of time required <span className="label low">{timeString}</span> </label><br />
                    <input type="range" id="time" name="time" min="0" max="100" value={timeRequired} onChange={handleRangeSlider} />
                </div>

                <div className="stars-input">
                    {/* Task importance stars*/}
                    <label>Importance of completion</label><br />
                    {
                        [...Array(5)].map((i, e) => {
                            return (
                                <span key={e + 'im'} className="rating-star" onClick={() => setImportance(e + 1)}>
                                    <span className={importance >= e + 1 ? 'fa fa-star checked' : 'fa fa-star unchecked'}></span>
                                </span>
                            )
                        })
                    }
                </div>
                <div className="stars-input">
                    {/* importance of timely completion stars*/}
                    <label>Importance of timely completion</label><br />
                    {
                        [...Array(5)].map((i, e) => {
                            return (
                                <span key={e + 'ti'} className="rating-star" onClick={() => setTimely(e + 1)}>
                                    <span className={timely >= e + 1 ? 'fa fa-star checked' : 'fa fa-star unchecked'}></span>
                                </span>
                            )
                        })
                    }
                </div>

                <button type="submit" className="button button-primary">Save</button>
                <button className="button margin-left-10" onClick={props.toggleAddTodo}>Close</button>
            </form>
        </div>
    )
}