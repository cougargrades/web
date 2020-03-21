import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

import anime from 'animejs/lib/anime.es.js';

import InstructorResultCard from './InstructorResultCard'
import firebase from '../_common/firebase';

import './instructors.scss';

class Instructors extends Component {
    constructor(props) {
        super(props)
        this.state = {
            results: [ ],
            searchbar: 'default',
            form_disabled: true
        };
    }

    // Input box
    handleSubmit(event) {
        if(event) event.preventDefault()

        let field = document.querySelector('form#search input[type=text]');

        (async () => {
            let db = firebase.firestore();
            db.collection('instructors')
            .where('keywords', 'array-contains', field.value.toLowerCase())
            .orderBy('lastName')
            .limit(10)
            .get()
            .then((querySnapshot) => {
                let docs = []
                for(let doc of querySnapshot.docs) {
                    docs.push(doc.data());
                }
                this.setState({
                    results: docs
                }, () => {
                    anime({
                        targets: '.instructor-result-card',
                        translateY: 0,
                        opacity: 1.0,
                        delay: anime.stagger(100) // increase delay by 100ms for each elements.
                    });
                })
            });
        })();


        this.setState({
            form_disabled: true
        })
    }

    updateButtonColor() {
        // Manually create field reference so handleKeyUp can be artificially called
        let field = document.querySelector('form#search input[type=text]');

        if(field.value.length > 0) {
            // field must have text in it for button to work
            this.setState({
                form_disabled: false
            })
        }
        else {
            this.setState({
                form_disabled: true
            })
        }
    }

    render() {
        return (
            <Container>
                <div>
                    <h2>Instructor search</h2>
                    <p>Type in the name of the instructor you're interested in and press <em>Search</em>. This will generate a list of results of the instructors you might be looking for.</p>
                    <Form id="search" autoComplete="off" onSubmit={e => this.handleSubmit(e)}>
                        <Form.Group>
                            <InputGroup>
                                <Form.Control type="text" placeholder="Renu Khator" onKeyUp={(e) => {if (e.key !== 'Enter') this.updateButtonColor()}}/>
                                <InputGroup.Append>
                                    <Button type="submit" className={`btn-cg ${this.state.searchbar}`} disabled={this.state.form_disabled} id="searchbar_btn">
                                        <span className="add-msg">Search</span>
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                    <div className="instructor-results">
                        {this.state.results.map(prof => {
                            return <InstructorResultCard key={prof.fullName} instructor={prof}/>
                        })}
                        {this.state.results.length === 0 ? <small className="text-muted">No results loaded</small> : <></>}
                    </div>
                    
                </div>
            </Container>
        )
    }
}

export default Instructors;