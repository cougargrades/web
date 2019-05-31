import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import CGSelectionBadge from './CGSelectionBadge.jsx';

class CGSearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selection: ["MATH 2331", "ENGL 1304"]
        };
    }

    addSelection(value) {
        // Immutable solution
        this.setState({
            selection: [...this.state.items, value]
        })
        console.log(this.state.selection)
    }
    removeSelection(value) {
        // Immutable solution
        this.setState({
            selection: this.state.selection.filter(item => item !== value) 
        })
        console.log(this.state.selection)
    }
    renderSelection() {
        if(this.state.selection.length > 0) {
            return this.state.selection.map((elem) => {
                return this.renderSelectionBadge(elem)
            })
        }
        return <span className="empty">No courses selected.</span>
    }
    renderSelectionBadge(value) {
        return (
            <CGSelectionBadge course={value} key={value} onClick={() => this.handleBadgeClick(value)} />
        )
    }
    handleBadgeClick(elem) {
        this.removeSelection(elem)
    }


    render() {
        return (
        <div>
            <Form autoComplete="off">
                <Form.Group>
                    <Form.Label>Add course</Form.Label>
                    <InputGroup>
                        <Form.Control type="text" placeholder="ENGL 1304" />
                        <InputGroup.Append>
                            <Button type="submit" className="btn-cg" onClick={() => {}}>
                                <span className="add-msg">Add to selection</span>
                                <span className="confirm-msg">Search selection</span>
                                <i className="material-icons">autorenew</i>
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            </Form>
            <div className="cg-selected">
                <h5>Selected courses:</h5>
                <p>
                    {
                        this.renderSelection()
                    }
                </p>
            </div>
        </div>
        );
    }
}

export default CGSearchForm;


/* 

<Form>
    <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
        <Form.Text className="text-muted">
        We'll never share your email with anyone else.
        </Form.Text>
    </Form.Group>
    <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
    </Form.Group>
    <Form.Group controlId="formBasicChecbox">
        <Form.Check type="checkbox" label="Check me out" />
    </Form.Group>
    <Button variant="primary" type="submit">
        Submit
    </Button>
</Form>

*/


/* <form id="search" autocomplete="off">
    <div class="form-group">
        <label for="searchbar_btn">Add course</label>
        <div class="input-group ">
            <input type="text" class="form-control" placeholder="ENGL 1304" />
            <div class="input-group-append">
                <button class="btn btn-cg" type="submit" id="searchbar_btn">
                    
                </button>
            </div>
        </div>
    </div>
</form> */