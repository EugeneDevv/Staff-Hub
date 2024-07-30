import './Buttons.scss'

const SubmitButton = (props : {value: string, disabled: boolean}) => {
  return (
    <input className='submitButton'  type="submit" value={props.value} disabled={props.disabled} />
  )
}

export default SubmitButton