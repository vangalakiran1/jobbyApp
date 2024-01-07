import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <div className="home-container">
      <Header />
      <div className="home-banner">
        <h1 className="home-banner-heading">
          Find The Job That Fits Your Life
        </h1>
        <p className="home-banner-text">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits yours abilities and potential
        </p>
        <Link to="/jobs">
          <button type="button" className="home-banner-btn">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home
