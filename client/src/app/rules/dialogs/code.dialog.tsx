import Dialog from 'react-toolbox/lib/dialog';
import React = require('react');
import Input from 'react-toolbox/lib/input';
import { observable } from 'mobx';
import {Trig, TrigsStore} from '../trigs/trigs.store'

export class CodeDialog extends React.Component<any> {
  onRef
 @observable state = {
   active: false,
   code:'',
   error:''
  }
  curTrig:Trig
  curTrigsStore:TrigsStore

  handleToggle = (trig?:Trig, trigsStore?:TrigsStore) => {
    this.curTrig = trig
    //console.log('handleToggle:'+trig)
    this.curTrigsStore = trigsStore
    if(trig && trig.condition) this.setState({...this.state,code:trig.condition})
    else this.setState({...this.state,code:''})
    this.setState({active:!this.state.active});
  }

  handleOnSave(){
    let code = this.state.code.replace(/\[\d+\s+\d+\.?\d?[f,u]?\]/g,'(-111)')
        .replace(/\=/g,'===').replace(/or/ig,'||').replace(/and/ig,'&&').replace(/not/ig,'!')
    try{
      new Function(code)() 
      
      this.curTrig.condition = this.state.code
      console.log('hadleOnSave:',this.curTrig)
      this.curTrigsStore.updTrig( this.curTrig )
      this.handleToggle()
    }catch(err){
      this.setState({...this.state, error:err.toString()}) 
    }
   
  }
  actions = [
    { label: "Сохранить", onClick: this.handleOnSave.bind(this) },
    { label: "Отмена", onClick: this.handleToggle }
  ];
  handleChange(name:string, value:string){
    if(name === 'code'){
      value = value.replace(/[^\+^\-^\*^\>^\<^\=^\s^\]^\[^\d^\.^O^R^A^N^D^T\(\)]/ig,'')//.replace(/(?<!&)&(?!&)/g, ' && ').replace(/O$/g,'OR ').replace(/N$/g,'NOT ')
    }
    this.setState({...this.state, [name]: value});
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
          title='Условие'
        >
         <Input type='text' multiline rows={10} error={this.state.error} hint='Здесь, вы можете вводить условия состоящие из: >, <, =, >=, <= , OR, AND, NOT 
            а также круглые скобки и содержащие  числовые константы  и арифметические операции +, -, *, / , а также адреса регистров modbus в квадратных скобках,
            например: ([12] + 4 > 10) AND [3 12.1] 
            По умолчанию для запросов modbus используется функция 3 — чтение значений из нескольких регистров хранения (Read Holding Registers). 
            Возможно явно указать функцию [4 12] (поддержаны функции 1,2,3 и 4), 
            также возможно использовать квалификаторы типа данных [12u] – для беззнаковых величин (uint16, по умолчанию int16) и [4 12f] – float32. 
            Также возможно извлечь бит из регистра, например [12.9] будет интерпретирован как 0 или 1 в зависимости от состояния бита №9 регистра 12' 
            icon='code' value={this.state.code} onChange={this.handleChange.bind(this,'code') }/>
        </Dialog>
      </div>
    )
  }
}