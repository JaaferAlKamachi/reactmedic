//import all what i need after installing them
import React from 'react';
import ReactDOM from 'react-dom';
import { Autocomplete, TextInput, Icon } from 'evergreen-ui';
import firebase from 'firebase';
import ReactModal from 'react-modal';
import styled from 'styled-components'

//declare some params
let data = require('./drugs.json');
let drugAlt = [];
let changeItem;

//styling some tags to use after
let InputN = styled.input `
display:block;
margin-bottom:5px;
border-radius:3px;
background-color: white;
height: 30px;
width: 257px;
border : 1.5px solid rgb(211, 211, 211);
outline:none;
padding: 0px 10px;
font-size: 0.75rem;
&:hover {
border: 1px solid rgba(70, 106, 179, 0.726);
box-shadow: 0 0 10px rgba(0, 140, 255, 0.526);
`
let ModalDiv = styled.div `
margin:30px;
`
let Warning = styled.p `
font-size : 0.75rem;
color:rgba(255, 0, 0, 0.411);
margin-bottom:20px;
`
let Input = styled.input`
display:block;
border-radius:3px;
background-color: white;
height: 30px;
width: 257px;
border : 1.5px solid rgb(211, 211, 211);
outline:none;
padding: 0px 10px;
font-size: 0.75rem;
margin-bottom: 33px
&:hover {
border: 1px solid rgba(70, 106, 179, 0.726);
box-shadow: 0 0 10px rgba(0, 140, 255, 0.526);
`
let Button = styled.button`
background-color: #466AB3;
padding: 10px;
border-radius: 3px;
border: none;
color: #f2f2f2;
font-weight: bold;
height:40px
min-width:100px;
`
let MyClinic = styled.div`
padding: 10px;
color: #466AB3;
font-weight: bold;
height:40px;
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
font-weight:bold;
width:90%;
padding: 20px 10px
text-transform: capitalize;

`

//firebase init
var config = {
    apiKey: "AIzaSyDHxznkQDd7XjwqjXBiAEHyf6exCMZOSi4",
    authDomain: "fikradrugs.firebaseapp.com",
    databaseURL: "https://fikradrugs.firebaseio.com",
    projectId: "fikradrugs",
    storageBucket: "fikradrugs.appspot.com",
    messagingSenderId: "905052087085"
};
firebase.initializeApp(config);

//creating the main class App
class App extends React.Component {

    // main's class constructor
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

        //firebase one snapshot updating the DB annd setting a new state for the prescription state that contains all the firebase data that we uplaod it during the input to map it and present it in the main list tha t contains the patient name , age and drugs
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

    //modal status controler method , it's controled by the "new prescription" button
    modalStatus() {
        let modalst = !this.state.modal
        this.setState({
            modal: modalst
        })
    }

    //printing the prescription method that is controled by the printing icon button
    print(name,age,drugs) {
        //this to open a new page
        let print = window.open()
        //this is the writing od=f the new html page
        print.document.write(`
        <html>
            <head>
                <title>printing page</title>
                <style>
                #body{
                    margin:0px 0px 0px 0px;
                    padding:0px 0px 0px 0px;
                }
                #header{
                    font-family: Arial, Helvetica, sans-serif;
                    margin: 0px ;
                    padding: 0px ;
                    width: 100%;
                    height: 100px;
                    box-shadow: 0 0 20px rgba(128, 128, 128, 0.541);
                    margin-bottom:50px;
                }
                #myClinic {
                    text-align: center;
                    color: #466AB3;
                    font-weight: bold;
                    height: 40px;
                    font-size: 3rem;
                    padding-top:20px;
                }
                #drugList{
                    font-family: Arial, Helvetica, sans-serif;
                    background-color: #f2f2f2;
                    padding: 10px;
                    border-radius: 3px;
                    border: none;
                    color: #466AB3;
                    font-weight:bold;
                    width:90%;
                    padding: 20px 10px;
                    margin:0 5%;
                    text-transform: capitalize;
                    font-size:1rem;
                    
                }
                .printDiv{
                    margin-bottom:10px;
                }
            </style>
            </head>
            <body id="body">
                <header id="header">
                    <h1 id="myClinic">
                        My Clinic
                    </h1>
                </header>
                <section id="drugList">
                    <div class="printDiv">patient name : ${name}</div>
                    <div class="printDiv">patient age : ${age}</div>
                    <div class="printDiv">patient drugs list : ${drugs}</div>
                </section>
            </body>
        </html> `)
        //to open the browser printing modal
        print.print()
    }

    //this is the main rendering function that contains the main page objects
    render() {
        //it returns jsx code
        return (
            //the ultimate parent of the elements
            <div>
                
                <header>

                    <MyClinic>My Clinic</MyClinic>
                    <Button id="button1" onClick={() => { this.modalStatus() }}>New prescription</Button>

                    <ReactModal
                        isOpen={this.state.modal}
                        contentLabel="MODAL">
                        <ModalDiv>
                            {/*the first input that controles the name state*/}
                        <InputN type="text" placeholder="PATIENT NAME" onChange={(event) => {
                            this.setState({
                                name: event.target.value
                            })
                        }} value={this.state.name} />
                        <Warning>YOU HAVE TO INPUT THE PATIENT NAME TO SAVE THE PRESCRIPTION</Warning>

                            {/*the second input that controles the age state*/}
                        <Input type="number" placeholder="PATIENT AGE" onChange={(event) => {
                            this.setState({
                                age: event.target.value
                            })
                        }} value={this.state.age} />

                            {/*this is the third input that controles the drugs list its an auto complete tage from the evergreen lib*/}
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
                                            {/*here we set the state for the firebase DB to upload it next*/}
                                            <Icon id="plus" marginBottom={20} icon="plus" color="466AB3" size={30} margin={0} padding={0} onClick={() => {
                                                drugAlt.push(changeItem)
                                                this.setState({
                                                    fireDrug: drugAlt
                                                })
                                            }} />
                                        </ICON>
                                        {/*to view the list of the drugs*/}
                                        <Drugs>{this.state.fireDrug + ''}</Drugs>
                                    </div>

                                )
                            }}

                        </Autocomplete>


                            {/*this button is to save and close the modal and also to delete the  old values of the state so it wont stay in the inputs , its also uplaod the same states before deleting it*/}
                        <Button id="save" onClick={() => {

                            this.modalStatus()
                            if (this.state.name != '') {
                                firebase.firestore().collection('patientsPres').add({
                                    date: Date.now(),
                                    items: this.state.fireDrug,
                                    name: this.state.name,
                                    age: this.state.age
                                })
                            }

                            drugAlt = [];
                            this.setState({
                                fireDrug: [],
                                name: '',
                                age: ''
                            })
                        }}>Save</Button>
                    </ModalDiv>
                    </ReactModal>
                </header>
                {/*the drugs list div that maps the prescription state and return the infos , its also have the printing button in it and an event that pass the values to the printing method*/}
                <div >
                    {this.state.prescriptions.map((item, i) => {
                        return (
                            <DrugList className="DrugList" key={i}>
                                name : {item.name}
                                <br />
                                age : {item.age}
                                <br />
                                drugs : {item.items + ''}
                                <Icon className="print" key={i} marginRight={10} icon="print" size={20} onClick={() => {
                                    this.print(item.name,item.age,item.items)
                                }} />
                            </DrugList>
                        )
                    })}
                </div>


            </div>
        )
    }
}

//rendering the reacT virtual dom to the inner html and changing what was update only
ReactDOM.render(<App />, document.getElementById('root'))