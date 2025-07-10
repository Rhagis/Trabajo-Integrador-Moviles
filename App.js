
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import {auth} from './firebase'



export default function App() {


  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [nombre, setNombre] = useState('')
  const [usuario, setUsuario] = useState(null);
  const [descrip, setDescrip] = useState('');
  const [mostrarBoton, setMostrarBoton] = useState(true);
  const [titulo,setTitulo] = useState('Iniciar Sesion');
  const [modoOscuro, setModoOscuro] = useState(false);
  



  const styles = styles2(modoOscuro);

  const registrarUsuario = async () => {
    try {
      if(email != '' && password != ''){
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await SecureStore.setItemAsync('uid', user.uid);
      setUsuario(user.uid);
      setEmail('');
      setPass('');
      await SecureStore.setItemAsync('nombre', nombre)
      await SecureStore.setItemAsync('descripciones', descrip)
      }else{
        alert('debes ingresar un email y contraseña para registrarte')
      }
    } catch (error) {
      console.log(error);
      alert('La creacion de cuenta ha fallado: ' + error.message);
    }
  };

  const loguearUsuario = async () => {
    try {
      if(email != "" && password != ""){
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await SecureStore.setItemAsync('uid', user.uid);
      console.log('usuario logueado: ', user);
      setUsuario(user.uid);
      setEmail('');
      setPass('');
      setMostrarBoton(false)
      setTitulo(`Bienvenido`)
      setNombre(await SecureStore.getItemAsync('nombre'))
      setDescrip(await SecureStore.getItemAsync('descripciones'))
      }else{
        alert('ingresa un email o contraseña valido para ingresar')
      }
    } catch(error) {
      console.log(error);
      alert('Logueo fallido: ' + error.message);
    }
  };

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      await SecureStore.deleteItemAsync('uid');
      setUsuario(null);
      setEmail('');
      setPass('');
      setNombre('')
      setDescrip('')
      alert('La sesion se cerro correctamente');
      setMostrarBoton(true)
      setTitulo('Iniciar Sesion')
    } catch (error) {
      console.log(error);
      alert('Error al cerrar la sesion');
    }
  };

  const editarNombre = async () => {
    try{
      await SecureStore.setItemAsync('nombre', nombre)
      await SecureStore.setItemAsync('descripciones', descrip)
}
    catch(error){
      alert('Error: ' + error.message);
    }
  }

  const recuperarContraseña = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Se envio un correo de recuperacion');

    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  
  

useEffect(() => {
  const verificarSesion= async() => {
    const uid = await SecureStore.getItemAsync('uid');
    if (uid){ 
      setUsuario(uid)
      setMostrarBoton(false)
      setTitulo('Bienvenido')
      setNombre(await SecureStore.getItemAsync('nombre'))
      setDescrip(await SecureStore.getItemAsync('descripciones'))
    };
    };
    verificarSesion();
},
[]);


  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>{titulo}</Text>

      {!mostrarBoton && <Text style={styles.title}>{nombre}</Text>}

      {!mostrarBoton && <Text style={styles.title}>{descrip} </Text>}

      {mostrarBoton && <TextInput style={styles.textInput} placeholder='Email' placeholderTextColor = {modoOscuro ? '#FFFFFF' : '#1E1E1E'}  value={email} onChangeText={setEmail} ></TextInput>}
      
      {mostrarBoton && <TextInput style={styles.textInput} placeholder='Password' placeholderTextColor = {modoOscuro ? '#FFFFFF' : '#1E1E1E'} value={password} onChangeText={setPass} secureTextEntry></TextInput>}
      
      {<TextInput style={styles.textInput} placeholder='Nombre' placeholderTextColor = {modoOscuro ? '#FFFFFF' : '#1E1E1E'} value={nombre} onChangeText={setNombre} ></TextInput>}
      
      {<TextInput style={styles.textInput} placeholder='Descripcion' placeholderTextColor = {modoOscuro ? '#FFFFFF' : '#1E1E1E'} value={descrip} onChangeText={setDescrip} ></TextInput>}

      {mostrarBoton && <TouchableOpacity style={styles.button} onPress={loguearUsuario}>
        <Text style={styles.text}>Loguear</Text>
        </TouchableOpacity>}

      {mostrarBoton && <TouchableOpacity style={styles.button} onPress={registrarUsuario}>
        <Text style={styles.text}>Crear Cuenta</Text>
        </TouchableOpacity>}

      {!mostrarBoton && <TouchableOpacity style={styles.button} onPress={cerrarSesion}>
        <Text style={styles.text}>Cerrar Sesion</Text>
        </TouchableOpacity>}
      {!mostrarBoton && <TouchableOpacity style={styles.button} onPress={editarNombre}>
        <Text style={styles.text}>Guardar Cambios</Text>
      </TouchableOpacity>}

      {mostrarBoton && <TouchableOpacity style={styles.button} onPress={recuperarContraseña}>
        <Text style={styles.text}>Recuperar Contraseña</Text>
        </TouchableOpacity>}

      <View style={styles.toggle}>
        <Text style={{ color: modoOscuro ? '#fff' : '#000', marginRight: 10 }}>
          {modoOscuro ? 'Modo Claro' : 'Modo Oscuro'}
        </Text>
        <Switch value={modoOscuro} onValueChange={setModoOscuro} trackColor={{ false: '#767577', true: '#81b0ff' }} thumbColor={modoOscuro ? '#f4f3f4' : '#f4f3f4'}/>
      </View>


    </View>
  );
}




const styles2 = (oscuro) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: oscuro ? '#121212' : '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 10,
    color: oscuro ? '#FFFFFF' : '#123ABC'
  },

  textInput: {
    height: 50, width: '90%', backgroundColor: oscuro ? '#1E1E1E' : '#FFFFFF',
    borderColor: oscuro ? '#333' : '#E8EAF6', borderWidth: 2, borderRadius: 15,
    marginVertical: 15, paddingHorizontal: 25, fontSize: 18,
    color: oscuro ? '#FFFFFF' : '#3C4858', shadowColor: '#9E9E9E',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3,
    shadowRadius: 4, elevation: 14,
  },

  button: {
    width: '90%', marginVertical: 15, backgroundColor: '#5C6BC0',
    padding: 20, borderRadius: 15, alignItems: 'center',
    justifyContent: 'center', shadowColor: '#5C6BC0',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4,
    shadowRadius: 5, elevation: 5
  },

  text: {
    color: oscuro ? '#FFFFFF' : '#1E1E1E', 
    fontSize: 18, 
    fontWeight: '600'
  },

  toggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,

    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent'

  },
  
});
