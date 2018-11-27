import React from 'react';
import ReactDOM from 'react-dom';
import { Autocomplete, TextInput } from 'evergreen-ui';
import firebase from 'firebase';
import ReactModal from 'react-modal';
let data = require('./drugs.json');



var config = {
    apiKey: "AIzaSyDHxznkQDd7XjwqjXBiAEHyf6exCMZOSi4",
    authDomain: "fikradrugs.firebaseapp.com",
    databaseURL: "https://fikradrugs.firebaseio.com",
    projectId: "fikradrugs",
    storageBucket: "fikradrugs.appspot.com",
    messagingSenderId: "905052087085"
};
firebase.initializeApp(config);



class App extends React.Component {

    constructor() {
        super();
        this.state = {
            items: data,
            modal: false,
            prescriptions: [],
            fireDrug: '',
            names: '',
            age: ''
        }


        firebase.firestore().collection("patientsPres").orderBy('date', 'asc').onSnapshot(snapshot => {
            let prescription = [];
            snapshot.forEach(doc => {
                prescription.push(doc.data());
            });
            this.setState({
                prescriptions: prescription
            })
        })


    }

    modalStatus() {
        let modalst = !this.state.modal
        this.setState({
            modal: modalst
        })
    }


    render() {
        return (
            <div>
                <header>
                    <button onClick={() => { this.modalStatus() }}>New prescription</button>

                    <ReactModal
                        isOpen={this.state.modal}
                        contentLabel="MODAL">
                        <input type="text" placeholder="ENTER THE PATIENT NAME" />
                        <input type="number" placeholder="ENTER THE PATIENT AGE" />
                        <Autocomplete
                            title="DRUGS"
                            onChange={changedItem => {
                                this.setState({
                                    fireDrug: changedItem
                                })
                            }}
                            items={this.state.items}>
                            {(props) => {
                                const { getInputProps, getRef, inputValue, openMenu } = props
                                return (
                                    <TextInput
                                        placeholder="SELECT A DRUG"
                                        value={inputValue}
                                        innerRef={getRef}
                                        {...getInputProps({
                                            onFocus: () => {
                                                openMenu()
                                            }
                                        })}
                                    />
                                )
                            }}
                        </Autocomplete>



                        <button onClick={() => {
                            this.modalStatus()
                            if (this.state.fireDrug != '') {
                                firebase.firestore().collection('patientsPres').add({
                                    date: Date.now(),
                                    items: this.state.fireDrug
                                })
                            }
                        }}>Save</button>

                    </ReactModal>
                </header>
                <div>
                    {
                        this.state.prescriptions.map((item, i) => {
                            return (
                                <div key={i}>
                                    {item.items}
                                </div>
                            )
                        })
                    }
                </div>


            </div>
        )
    }
}
ReactDOM.render(<App />, document.getElementById('root'))