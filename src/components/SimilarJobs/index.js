import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobs = props => {
  const {similarJobs} = props
  const {
    companyLogoUrl,
    title,
    rating,
    jobDescription,
    location,
    employmentType,
  } = similarJobs
  return (
    <div className="similar-jobs-item">
      <div className="card-details-heading">
        <img
          alt="similar job company logo"
          className="card-details-img"
          src={companyLogoUrl}
        />
        <div className="card-details-heading-name">
          <h3>{title}</h3>
          <p>
            <AiFillStar className="job-card-star-icon job-card-icon" />
            {rating}
          </p>
        </div>
      </div>
      <h3>Description</h3>
      <p>{jobDescription}</p>
      <div className="location-container">
        <div className="location-heading">
          <p className="job-card-location">
            <MdLocationOn className="job-card-icon" /> {location}
          </p>
          <p className="job-card-description">
            <BsBriefcaseFill className="job-card-icon" /> {employmentType}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SimilarJobs
