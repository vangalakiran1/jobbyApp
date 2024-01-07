import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="nav-bar">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="nav-logo-img"
        />
      </Link>
      <ul className="menu">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            <AiFillHome size={25} className="nav-icon" />
            <p className="nav-link-large-device">Home</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/jobs" className="nav-link">
            <BsBriefcaseFill size={25} className="nav-icon" />
            <p className="nav-link-large-device">Jobs</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link">
            <FiLogOut onClick={onClickLogout} size={25} className="nav-icon" />
            <button
              type="button"
              className="nav-link-large-device logout-btn"
              onClick={onClickLogout}
            >
              Logout
            </button>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
