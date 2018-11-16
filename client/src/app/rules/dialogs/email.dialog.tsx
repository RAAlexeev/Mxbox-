import Dialog from 'react-toolbox/lib/dialog';
import React = require('react');
import Input from 'react-toolbox/lib/input';
import { observable } from 'mobx';
import {Trig, TrigsStore} from '../trigs/trigs.store'
import { Act, ActsStore } from '../acts/acts.store';
import { Email } from '../rules.store';

export class EmailDialog extends React.Component<any> {
  onRef
 @observable state = {
   active: false,
   email:'',
   address:'',
   subject:'',
   body:'',
   error:''
  }
 
  upd:Function
  obj
  handleToggle = (obj?,upd?:Function) => {
    
    this.upd = upd
    this.obj = obj
    this.setState({...this.state, address:'', subject:'', body:'', error:''})
    if(obj){
    if(!obj.email) obj.email = {address:'',subject:'', body:''}
      if(obj.email.address) this.setState({...this.state,address:obj.email.address})
      if(obj.email.subject) this.setState({...this.state,subject:obj.email.subject})
      if(obj.email.body) this.setState({...this.state,body:obj.email.body})
    }
    this.setState({active:!this.state.active});
  }

  handleOnSave(){ 
    this.obj.email = {address:this.state.address, subject:this.state.subject, body:this.state.body}
    this.upd(this.obj)
    this.handleToggle()
  }
  actions = [
    { label: "Сохранить", onClick: this.handleOnSave.bind(this) },
    { label: "Отмена", onClick: this.handleToggle }
  ]
  handleChange(name:string, value:string){
    this.setState({...this.state, [name]: value})
  }
  constructor(props) {
    
    super(props)
    //this.onRef = React.createRef();
    this.onRef = props.onRef

  }

  componentWillMount() {
   
    this.onRef(this)
  }

  componentWillUnmount() {
     this.onRef(null)
  }
  render () {
    return (
      <div>
      
        <Dialog
          actions={this.actions}
          active={this.state.active}
          onEscKeyDown={this.handleToggle}
          onOverlayClick={this.handleToggle}
          title='Email'
        >
         <Input type='email' label='Email адреса' icon='email' value={this.state.email} onChange={this.handleChange.bind(this, 'email')} />
         <Input type='text' label='Тема' icon='subject' value={this.state.subject} onChange={this.handleChange.bind(this, 'subject')} />
         <Input type='text' multiline rows={10} error={this.state.error} hint='Здесь вы  также можете вставлять ссылки на modbus адреса в квадратных скобках [03 12], [12f](p.s. и в теме тоже)'
                icon='email' value={this.state.body} onChange={this.handleChange.bind(this,'body') }/>
        </Dialog>
      </div>
    )
  }
}