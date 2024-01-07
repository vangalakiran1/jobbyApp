import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import './index.css'

const JobCardItem = props => {
  const {jobDetailsData} = props

  const {
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
    id,
  } = jobDetailsData

  return (
    <Link to={`/jobs/${id}`} className="job-card-item-details-container">
      <div className="job-card-item">
        <div className="job-card-inner">
          <img src={companyLogoUrl} alt="" className="job-card-img" />
          <div>
            <h3>{title}</h3>
            <p className="job-card-rating">
              <AiFillStar className="job-card-star-icon job-card-icon" />
              {rating}
            </p>
          </div>
        </div>
        <div className="job-card-location-container">
          <div className="job-card-location-inner">
            <div className="job-card-location">
              <MdLocationOn className="job-card-icon" />
              {location}
            </div>
            <div className="job-card-description">
              <BsBriefcaseFill className="job-card-icon" />
              {employmentType}
            </div>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <div className="description">
          <h3>Description</h3>
          <p>{jobDescription}</p>
        </div>
      </div>
    </Link>
  )
}

export default JobCardItem
