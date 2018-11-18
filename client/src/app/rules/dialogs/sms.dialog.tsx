import Dialog from 'react-toolbox/lib/dialog';
import React = require('react');
import Input from 'react-toolbox/lib/input';
import { observable } from 'mobx';
import Button from 'react-toolbox/lib/button';
import * as appStyle from '../../app.css'

export class SmsDialog extends React.Component<any> {
  onRef
 @observable state = {
   active: false,
   numbers:[],
   text:'',
   error:''
  }
  addNumber:Function
  upd:Function
  obj
  handleToggle = (obj?,upd?:Function) => {
    
    this.upd = upd
  
    this.obj = obj
   
    if(obj){
      if(!obj.sms) obj.sms = {numbers:[''],text:''}
      if(!obj.sms.numbers) obj.sms = {numbers:[''],text:''}
      this.setState({...this.state,numbers:obj.sms.numbers,text:obj.sms.text})
    }else  this.setState({...this.state, numbers:[], text:'', error:''})
    //console.log(this.obj)
    this.setState({active:!this.state.active});
  }

  handleOnSave(){ 
    this.obj.sms = {numbers:this.state.numbers.map((number, index)=>number!=''||!index?number:undefined), text:this.state.text}
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

  handleChangeNumber(index:number,value:string){
    let numbers = this.state.numbers.slice()
    numbers[index] = value
    this.setState({...this.state, numbers: numbers})
 }

 handleAddNumber(){
   
  this.setState({...this.state, numbers: [...this.state.numbers, '']})
 
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
          title='SMS'
        >
         {this.state.numbers.map((number, index)=>number!=undefined||!index?
            <Input key={index}  type='phone' label='Номер' icon='phone' value={number} onChange={this.handleChangeNumber.bind(this, index)} maxLength={15}/>:''
          )}
          {this.state.numbers[this.state.numbers.length-1]!=''?<Button icon='add' onClick={this.handleAddNumber.bind(this)} floating  mini  />:''}
         
         <Input type='text' multiline rows={5} error={this.state.error} hint='Здесь вы  также можете вставлять ссылки на modbus адреса в квадратных скобках [03 12], [12f] [1]'
           icon='message' value={this.state.text} onChange={this.handleChange.bind(this,'text') } maxLength={70}/>
        </Dialog>
      </div>
    )
  }
}


