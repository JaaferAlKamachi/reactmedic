import React from 'react';
import ReactDOM from 'react-dom';
import { Autocomplete, TextInput, Icon } from 'evergreen-ui';
import firebase from 'firebase';
import ReactModal from 'react-modal';
import styled from 'styled-components'
let data = require('./drugs.json');
let drugAlt = [];
let changeItem;

let Input = styled.input`
display:block;
border-radius:3px;
background-color: white;
height: 30px;
width: 200px;
border : 1.5px solid rgb(211, 211, 211);
outline:none;
padding: 0px 10px;
font-size: 0.75rem;
margin-bottom: 20px

`

let Button = styled.button`
background-color: #466AB3;
padding: 10px;
border-radius: 3px;
border: none;
color: white;
font-weight: bold;
height:40px
min-width:100px;
`

let MyClinic = styled.div`
padding: 10px;
border-radius: 3px;
border: none;
color: #466AB3;
font-weight: bold;
height:40px
font-size:3rem;
margin-left:5%;
margin-top:10px
`

let ICON = styled.div`
margin-bottom: 20px
`

let Drugs = styled.div`
background-color: #f2f2f2;
padding: 10px;
border-radius: 3px;
border: none;
color: grey;
margin-bottom: 20px
`

let DrugList = styled.div`
background-color: #f2f2f2;
padding: 10px;
border-radius: 3px;
border: none;
color: #466AB3;
margin-bottom: 20px;
font-weight:bold;
width:90%;
margin : auto;
padding: 20px 10px
text-transform: capitalize;

`

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
            fireDrug: [],
            name: '',
            age: '',
            prescriptions: [],

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
                    <MyClinic>My Clinic</MyClinic>
                    <Button id="button" onClick={() => { this.modalStatus() }}>New prescription</Button>


                    <ReactModal
                        isOpen={this.state.modal}
                        contentLabel="MODAL">
                        <Input type="text" placeholder="PATIENT NAME" onChange={(event) => {
                            this.setState({
                                name: event.target.value
                            })
                        }} value={this.state.name} />
                        <Input type="number" placeholder="PATIENT AGE" onChange={(event) => {
                            this.setState({
                                age: event.target.value
                            })
                        }} value={this.state.age} />

                        <Autocomplete
                            title="DRUGS"
                            onChange={changedItem => {
                                changeItem = changedItem
                            }}
                            items={this.state.items}>
                            {(props) => {
                                const { getInputProps, getRef, inputValue, openMenu } = props
                                return (
                                    <div>
                                        <TextInput marginBottom={20}
                                            placeholder="SELECT A DRUG"
                                            value={inputValue}
                                            innerRef={getRef}
                                            {...getInputProps({
                                                onFocus: () => {
                                                    openMenu()
                                                }
                                            })}
                                        />
                                        <ICON>
                                            <Icon marginBottom={20} icon="plus" color="466AB3" size={30} margin={0} padding={0} onClick={() => {
                                                drugAlt.push(changeItem)
                                                this.setState({
                                                    fireDrug: drugAlt
                                                })
                                            }} />
                                            <Drugs>{this.state.fireDrug + ''}</Drugs>
                                        </ICON>
                                    </div>

                                )
                            }}

                        </Autocomplete>



                        <Button id="save" onClick={() => {
                            this.setState({
                                fireDrug: [],
                                name: ''
                            })
                            this.modalStatus()
                            if (this.state.name != '') {
                                firebase.firestore().collection('patientsPres').add({
                                    date: Date.now(),
                                    items: this.state.fireDrug,
                                    name: this.state.name,
                                    age: this.state.age
                                })
                            }
                        }}>Save</Button>

                    </ReactModal>
                </header>
                <div >
                    {this.state.prescriptions.map((item, i) => {
                        return (
                            <DrugList className="DrugList" key={i}>
                                patient name : {item.name}
                                <Icon key={i} marginRight={10} icon="print" size={20} onClick={window.print}/>
                            </DrugList>

                        )
                    })}
                </div>


            </div>
        )
    }
}
ReactDOM.render(<App />, document.getElementById('root'))