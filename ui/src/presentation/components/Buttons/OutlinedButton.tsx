import './Buttons.scss'
const OutlinedButton: React.FC<{ text: string, onClick: () => void, className?: string }> = ({ text, onClick, className }) => {
  return (
    <button onClick={(e) => { e.preventDefault(); onClick(); }} className={className} >{text}</button>
  )
}

export default OutlinedButton