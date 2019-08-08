import React from 'react';

import anime from 'animejs/lib/anime.es.js';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import PropTypes from 'prop-types';

import CGSelectionBadge from './CGSelectionBadge';

class CGSearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selection: ['COSC 1430'],
            searchbar: "default",
            form_disabled: false
        };
    }

    // Selection display
    addSelection(value, callback) {
        callback = typeof(callback) === 'function' ? callback : function(){}; 

        // Immutable solution
        if(!this.state.selection.includes(value)) {
            this.setState({
                selection: [...this.state.selection, value]
            }, function() {
                this.updateButtonColor()
                // Change the URL to be the current selection
                //window.location.hash = this.generateUrlHash()
                callback()
            })
        }
        
    }
    removeSelection(value, callback) {
        callback = typeof(callback) === 'function' ? callback : function(){}; 
        
        // Immutable solution
        // TODO: use animejs to animate the removal
        this.setState({
            selection: this.state.selection.filter(item => item !== value) 
        }, function() {
            this.updateButtonColor()
            // Change the URL to be the current selection
            //window.location.hash = this.generateUrlHash()
            callback()
        })
        
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
        // TODO: use css to animate the addition
        return (
            <CGSelectionBadge course={value} key={value} onClick={() => this.handleBadgeClick(value)} />
        )
    }
    handleBadgeClick(elem) {
        // Don't remove any badges while the form is in the middle of processing
        if(!this.state.form_disabled) {
            anime({
                targets: this.getBadgeNodeByName(elem),
                rotateX: 90,
                complete: () => {
                    this.removeSelection(elem, () => {
                        this.props.onQuery(this.state.selection)
                    })
                }
            })
        }
    }
    getBadgeNodeByName(course) {
        let badges = document.querySelectorAll('.cg-selected p span.badge')
        for(let i = 0; i < badges.length; i++) {
            if(badges[i].firstChild.textContent === course) {
                return badges[i]
            }
        }
    }
    generateUrlHash() {
        // Generates a URL has based on the current selection
        return (this.state.selection.length > 0 ? '#!' : '') + this.state.selection.map(e => encodeURI(e)).join(',')
    }
    pullFieldToSelection() {
        // Add the query to the selection and empty the search bar
        let field = document.querySelector('form#search input[type=text]')
        this.addSelection(field.value.toUpperCase())
        field.value = ''
    }

    // Input box
    handleSubmit(event) {
        if(event) event.preventDefault()

        let field = document.querySelector('form#search input[type=text]')
        if(this.state.searchbar === "confirm") {
            
            // Lock the inputs
            this.setState({
                form_disabled: true,
                searchbar: 'loading'
            })

            this.props.onQuery(this.state.selection)

            this.setState({
                form_disabled: false,
                searchbar: 'confirm'
            })

        }
        else if(this.state.searchbar === 'default' && field.value.length > 0) {
            // Add the query
            this.pullFieldToSelection()
        }
    }
    updateButtonColor() {
        // Manually create field reference so handleKeyUp can be artificially called
        let field = document.querySelector('form#search input[type=text]');

        //console.log('updateButtonColor', this.state.selection, field.value == '' ? undefined : field.value)

        if(field.value.length > 0 || this.state.selection.length === 0) {
            //console.log('default')
            // If selected courses is empty OR text field has text in it
            this.setState({
                searchbar: 'default'
            })
        }
        else if(this.state.selection.length > 0 && field.value.length === 0) {
            //console.log('confirm')
            // If selected courses is not empty AND text field is empty
            this.setState({
                searchbar: 'confirm'
            })
        }
    }

    componentDidMount() {
        // Automatically search for URLs with the courses specified

        let hash = window.location.hash ? window.location.hash.split('#!')[1].split(',').map(e => decodeURI(e)) : null
        if(hash !== null) {
            this.setState({
                selection: hash.slice()
            }, function() {
                this.props.onQuery(this.state.selection)
            })
        }
    }

    render() {
        return (
        <div>
            <Form id="search" autoComplete="off" onSubmit={e => this.handleSubmit(e)}>
                <Form.Group>
                    <Form.Label>Add course</Form.Label>
                    <InputGroup>
                        <Form.Control type="text" placeholder="ENGL 1304, CHEM 1331, POLS 1336, ..." defaultValue="MATH 3336" disabled={this.state.form_disabled} onKeyUp={(e) => {if (e.key !== 'Enter') this.updateButtonColor()}}/>
                        <InputGroup.Append>
                            <Button type="submit" className={`btn-cg ${this.state.searchbar}`} disabled={this.state.form_disabled} id="searchbar_btn">
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

CGSearchForm.propTypes = {
    onQuery: PropTypes.func.isRequired
};

export default CGSearchForm;