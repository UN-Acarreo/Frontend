import React, { Component } from 'react';
import styles from './styles.module.css';
import axios from 'axios';

import classNames from "classnames";

const URL = 'http://localhost:3001'

interface Props{
  isDriver : boolean;
  isHome : boolean;

}

interface State {

    nombre: string,
    apellido: string,
    email: string,
    direccion: string,
    ciudad: string,
    contraseña: string,
    confirmar_contraseña: string,
    
    goToDriver :boolean,
    goToUser : boolean

}

class RegisterForm extends Component {
constructor(props){
    super(props);

    this.state = {
      nombre: '',
      apellido: '',
      email: '',
      direccion: '',
      ciudad: '',
      contraseña: '',
      confirmar_contraseña: '',
      
      goToDriver :true,
      goToUser :false
      
      //
    }
  }

  changeForm(){

    this.setState({goToDriver : !this.state.goToDriver});
    this.setState({goToUser : !this.state.goToUser});

    
    
  }

  handleChange = (e) =>{
    this.setState({ [e.target.id] : e.target.value});

  }

  sign_up(){
    if(this.state.contraseña != this.state.confirmar_contraseña){
      //show passwords dont match error
      return;

    }
    var url;
    this.props.isDriver ? url = URL+'driver-signup' : url = URL+'/api/client-signup';
    
    var request = {nombre: this.state.nombre, apellido: this.state.apelido, email: this.state.email,
                   direccion: this.state.direccion, ciudad: this.state.ciudad, contraseña: this.state.contraseña}
    axios.post(url, { request })
        .then(res => {
          if(res.data.status == 'added'){
             //user has been added
             console.log('User successfuly added');
          }

          else{
            //show an error
          }
        })
  }

  render() {

    const {isDriver, isHome} = this.props;
    const {goToDriver, goToUser} = this.state;

    return (

      <div className={styles.container}>

        {console.log(this.state.goToDriver, "Driver")}
        {console.log(this.state.goToUser, "User")}
       {isHome ?
       <div className = {styles.container_options}>
          <button className = {goToDriver ?  classNames(styles.button_driver) : classNames(styles.button_driver_active)} onClick = {() => this.changeForm()}>
            CONDUCTOR
          </button>
          <button className = {goToUser ?  classNames(styles.button_user) : classNames(styles.button_user_active)} onClick = {() => this.changeForm()}>
            USUARIO
        </button>
      </div> : null}

      {!isHome?
        <form>

          <div class="form-group" >
            <label  className = {styles.input}>Nombre:</label>
            <input  type="text"
                    name="name"
                    class="form-control"
                    placeholder = "NOMBRE"
                    value={this.state.nombre}
                    id='nombre'
                    onChange={this.handleChange}

            />
          </div>

          <div class="form-group" >
            <label  className = {styles.input}>Apellido:</label>
            <input  type="text"
                    name="lastname"
                    class="form-control"
                    placeholder = "APELLIDO"
                    value={this.state.apellido}
                    id='apellido'
                    onChange={this.handleChange}

            />
          </div>

          <div class="form-group">
            <label  className = {styles.input}>E-Mail:</label>
            <input  type="text"
                    name="e-mail"
                    class="form-control"
                    placeholder = "E-MAIL"
                    value={this.state.email}
                    id='email'
                    onChange={this.handleChange}
            />
          </div>

          <div class="form-group">
            <label  className = {styles.input}>Direccion:</label>
            <input  type="text"
                    name="address"
                    class="form-control"
                    placeholder = "DIRECCION"
                    value={this.state.direccion}
                    id='direccion'
                    onChange={this.handleChange}
            />
          </div>

          <div class="form-group">
          <label  className = {styles.input}>Ciudad:</label>
          <input  type="text"
                  name="city"
                  class="form-control"
                  placeholder = "CIUDAD"
                  value={this.state.ciudad}
                  id='ciudad'
                  onChange={this.handleChange}
          />
          </div>

          <div class="form-group">
          <label  className = {styles.input}>Contraseña:</label>
          <input  type="password"
                  name="password"
                  class="form-control"
                  placeholder = "CONTRASEÑA"
                  value={this.state.contraseña}
                  id='contraseña'
                  onChange={this.handleChange}
          />
          </div>

          <div class="form-group">
          <label  className = {styles.input}>Confirmar Contraseña:</label>
          <input  type="password"
                  name="password"
                  class="form-control"
                  placeholder = "CONFIRMAR CONTRASEÑA"
                  value={this.state.confirmar_contraseña}
                  id='confirmar_contraseña'
                  onChange={this.handleChange}
          />
          </div>

          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
            <label className = {styles.input_check} for="exampleCheck1">Acepto los terminos y condiciones</label>
          </div>

          {!isDriver ?<button type="button" class="btn btn-dark" onClick={()=>this.sign_up()}>REGISTRARSE</button> :

          <button  type="button" class="btn btn-dark">CONTINUAR REGISTRO</button> }
      </form> :

        <form>

          <div class="form-group">
            <label  className = {styles.input}>E-Mail:</label>
            <input  type="text"
                    name="e-mail"
                    class="form-control"
                    placeholder = "E-MAIL"
                    id='email'
            />
          </div>

          <div class="form-group">
          <label  className = {styles.input}>Contraseña:</label>
          <input  type="password"
                  name="password"
                  class="form-control"
                  placeholder = "CONTRASEÑA"
                  id='contraseña'
          />
          </div>

          <div class="col-md-12 text-center">
            
            <a href="/homeUser" className={classNames("btn btn-dark")} > INGRESAR</a>
          </div>

          <label className = {styles.label}>

            No tienes cuenta ? Registrate! : 

          </label>
  
          <div class="col-md-12 text-center">
          
            <a {...goToDriver ? {href:"/loginDriver"} : {href:"/login"}} className={classNames("btn btn-dark")}>REGISTRARSE</a>
          </div>
          
      </form>
        }
      </div>
    )
  }
}

export default RegisterForm;
