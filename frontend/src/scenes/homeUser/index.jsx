import React, { Component } from 'react';

import classNames from 'classnames';

import styles from './styles.module.css';
import moment from 'moment';


import Top from '../../components/top/index.jsx';
import MapContainer from '../../components/mapContainer/index.jsx';
import ModalContainer from '../../components/modal/index.jsx';
import Modal from "react-bootstrap/Modal";

import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import validator from 'validator';

const URL = 'http://localhost:3001'

interface State {

    show : boolean;
    showStart : boolean;
    showEnd : boolean;
    showDescription: boolean;
    date : Date;
    time : Date;
    description : string;
    weight : string;
    start : {};
    end : {};
    formatedDate : {};
    formatedTime : {};
}

class HomeUser extends Component {

  constructor(props){
    super(props);
    
    this.modalElement = React.createRef();
    this.mapElement = React.createRef();
    this.handleStart = this.handleStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);


    this.state = {
      show : true,
      showStart : false,
      showEnd : false,
      showDescription : false,
      date : new Date(),
      time : new Date(),
      description : "",
      weight: "",
      start : {},
      end : {},
      formatedDate : {},
      formatedTime : {}
      //
    }

    
  }

  //notification functions declaration
  notifySuccess = (text) => toast.success(text, {containerId: 'notification'});
  notifyWarning = (text) => toast.warning(text, {containerId: 'notification'});
  notifyError = (text) => toast.error(text, {containerId: 'notification'});
  notifyInfo = (text) => toast.info(text, {containerId: 'notification'});
  
  //Function used to check the request fields
  check_fields = async (data) => {
    for (const key of Object.keys(data)) {
      var field = data[key]
      if(key == 'Date') {
        if (field.Year === undefined) {
          return "No se ha asignado una fecha"
        }
        if (field.Hour === undefined) {
          return "No se ha asignado una hora de inicio"
        }

        // Check date after today
        var today = new Date()
        today.setSeconds(0)
        today.setMilliseconds(0)
        today.setMinutes(today.getMinutes() + 15)
        var inserted = new Date(parseInt(field.Year),parseInt(field.Month),parseInt(field.Day),parseInt(field.Hour),parseInt(field.Minute))
        if (inserted <= today) {
          return "La fecha y hora de la reserva debe ser al menos 15 minutos posterior al tiempo actual"
        }

      }
      if(key == 'Origin_coord' && field === undefined) {
        return "No se ha asignado una coordenada de origen"
      }
      if(key == 'Destination_coord' && field === undefined ) {
        return "No se ha asignado una coordenada de destino"
      }
      if(key == 'Description' && validator.isEmpty(field)) {
        return "La descripción no puede esta vacia"
      }
      if(key == 'Weight' && (!validator.isNumeric(field) || parseInt(field) <= 0)) {
        return "El peso debe ser un número mayor a 0"
      }
      if(key == 'Id_user') {
      }
      if(key == 'Duration' && !validator.isNumeric(field)) {
        return "Eddl peso debe ser un valor numerico"
      }
    }
    return true;
  }

  handleDate(){
    this.modalElement.current.openDateModal();
  }

  handleTimer(){
    this.modalElement.current.openTimerModal();
  }

  handleStart(){
    this.setState({showStart :true})
    
  }

  handleEnd(){
    
    this.setState({showEnd :true})
  }

  handleDescription(){
    
   this.modalElement.current.openDescriptionModal();
  }

  setDate = (date) =>{

    var newDate = {
      day : moment(date).format('DD'),
      month : (moment(date).month()).toString(),
      year : moment(date).year().toString()  
    };



    var formatDate = moment(date).format('MMMM DD YYYY'); 

    this.setState({date :formatDate})
    this.setState({formatedDate :newDate})
    console.log("test" ,  newDate);
    
  }

  setTime = (time) =>{

    var newTime = {
      hour : moment(time).format('HH'),
      minute : moment(time).format('mm')
    };

    var formatTime = moment(time).format('HH mm'); 

    this.setState({time :formatTime})
    this.setState({formatedTime :newTime})
    console.log(newTime);
    
  }

  setDescription = (description) =>{

    this.setState({description :description})
    
    
  }

  setWeight = (weight) =>{

    this.setState({weight :weight})
    
    
  }

  setStart = (start) =>{
    
    this.setState({start :start})
  }

  setEnd = (end) =>{
    
    this.setState({end :end})
  }

  async search() {

    const {formatedDate , formatedTime} = this.state
    console.log(this.state.formatedDate);

    url = URL+'/api/haulage/create'

    var info = JSON.parse(sessionStorage.login_info);

    var url;

    try{
      
      console.log(url)
    }
    catch(err){
      
      return ;
    }

    var request = { Date:{Year:formatedDate.year, Month:formatedDate.month, Day:formatedDate.day, Hour:formatedTime.hour, Minute:formatedTime.minute}, 
                    Origin_coord: this.state.start.lat ? this.state.start.lat.toString() : undefined , 
                    Destination_coord: this.state.end.lat? this.state.end.lat.toString(): undefined, 
                    Description: this.state.description, 
                    Comments: "",
                    Weight: this.state.weight, 
                    Duration: "2",
                    Id_user: info.Id_user.toString()
                  } 
    
    console.log(request);
    
    const valid_fields = await this.check_fields(request);
    if(valid_fields !== true){
      this.notifyWarning(valid_fields)
      return;
    }

    axios.post(url, {request})
        .then(res =>{
            if(res.data.status == 1){
                //vehicle registered
                console.log("Registro Exitoso")
                this.notifySuccess('Su reserva ha sido asignada con exito')
                info = ""
                for (var i in res.data.data) {
                  info += "Vehiculo " + (parseInt(i)+1) + "\n"
                  info += "     Placa: " + res.data.data[i].Plate + "\n"
                  info += "     Marca: " + res.data.data[i].Brand + "\n"
                  info += "     Modelo: " + res.data.data[i].Model + "\n"
                  info += "     Conductor: " + res.data.data[i].Driver_name + " " + res.data.data[i].Driver_last_name + "\n"
                  info += "     Telefono: " + res.data.data[i].Driver_phone + "\n"
                }   
                alert(info)
            }else{
                // error management
                this.notifyWarning(res.data.error)
                
            }
        }).catch((error) => {
          if (error.response) {
            
            console.log(error.response.data.error);	
            this.notifyError('Ha ocurrido un error en el servidor')

          }
        })
    
  }
    
  render() {

    const {show, showStart, showEnd} = this.state;

     return(
      <div>
        <ToastContainer enableMultiContainer containerId={'notification'} position={toast.POSITION.TOP_RIGHT} />
        
        <Top message = {"UNAcarreo"}
             isUser = {true}
             isDriver = {false}/>
        
        <ModalContainer ref = {this.modalElement}
                        onDateSelected = {this.setDate}
                        onTimeSelected = {this.setTime}
                        onDescriptionSaved = {this.setDescription}
                        onWeightSaved = {this.setWeight}
                         />

            <div className = {styles.test}>

                <div class="btn-group-vertical" style={{  width: '50%' }}>
                  <button type="button" class="btn btn-secondary" style={{  background: 'black' }} onClick = {() => this.handleDate()}>FECHA</button>
                  <button type="button" class="btn btn-secondary" style={{  background: 'black' }} onClick = {() => this.handleTimer()}>HORA DE INICIO</button>
                  <button type="button" class="btn btn-secondary" style={{  background: 'black' }} onClick = {() => this.handleStart()}>ORIGEN</button>
                  <button type="button" class="btn btn-secondary" style={{  background: 'black' }} onClick = {() => this.handleEnd()}>DESTINO</button>
                  <button type="button" class="btn btn-secondary" style={{  background: 'black' }} onClick = {() => this.handleDescription()}>DESCRIPCION</button>
                  <button type="button" class="btn btn-secondary" style={{  background: 'black' }} onClick = {() => this.search()}>BUSCAR</button>
                </div>

                <MapContainer
                              ref = {this.mapElement}
                              showStart = {showStart}
                              showEnd = {showEnd}
                              onStartSelected = {this.setStart}
                              onEndSelected = {this.setEnd}
                              />
            
        </div> 
            
      </div>
    )
  }
}

export default HomeUser;
