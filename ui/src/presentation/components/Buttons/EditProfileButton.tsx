import { Link } from 'react-router-dom'
import './Buttons.scss'

interface Props{
  value: string;
  onTap: () => void;
}

const EditProfileButton: React.FC<Props> = ({value, onTap, }) => {
  return (
    <Link className='editButton' to="/update-profile" onClick={onTap} >{value}</Link>
  )
}

export default EditProfileButton