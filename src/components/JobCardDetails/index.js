import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class JobCardDetails extends Component {
  state = {
    jobCardJobDetails: [],
    jobCardSimilarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCardDetailsDataFromApi()
  }

  getCardDetailsDataFromApi = async props => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jobCardDetailsUrl = `https://apis.ccbp.in/jobs/${id}`
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobCardDetailsUrl, option)
    if (response.ok === true) {
      const cardDetailsData = await response.json()

      const updatedCardDetailsData = [cardDetailsData.job_details].map(
        eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          companyWebsiteUrl: eachItem.company_website_url,
          employmentType: eachItem.employment_type,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          lifeAtCompany: {
            description: eachItem.life_at_company.description,
            imageUrl: eachItem.life_at_company.image_url,
          },
          location: eachItem.location,
          packagePerAnnum: eachItem.package_per_annum,
          rating: eachItem.rating,
          skills: eachItem.skills.map(eachSkill => ({
            imageUrl: eachSkill.image_url,
            name: eachSkill.name,
          })),
          title: eachItem.title,
        }),
      )

      const updatedCardSimillarJobs = cardDetailsData.similar_jobs.map(
        eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          employmentType: eachItem.employment_type,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          location: eachItem.location,
          rating: eachItem.rating,
          title: eachItem.title,
        }),
      )

      this.setState({
        jobCardJobDetails: updatedCardDetailsData,
        jobCardSimilarJobs: updatedCardSimillarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobCardDetails = () => {
    const {jobCardJobDetails} = this.state
    if (jobCardJobDetails.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        jobDescription,
        lifeAtCompany,
        location,
        packagePerAnnum,
        rating,
        skills,
        title,
      } = jobCardJobDetails[0]
      return (
        <div className="card-details">
          <div className="card-details-heading">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="card-details-img"
            />
            <div className="card-details-heading-name">
              <h3>{title}</h3>
              <p>
                <AiFillStar className="job-card-star-icon job-card-icon" />{' '}
                {rating}
              </p>
            </div>
          </div>
          <div className="location-container">
            <div className="location-heading">
              <p className="job-card-location">
                <MdLocationOn className="job-card-icon" /> {location}
              </p>
              <p className="job-card-description">
                <BsBriefcaseFill className="job-card-icon" /> {employmentType}
              </p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="card-details-description-container">
            <div className="card-details-description">
              <h3>Description</h3>
              <a href={companyWebsiteUrl} className="card-details-url">
                Vist <BiLinkExternal className="vist-icon" />
              </a>
            </div>
            <p className="card-details-description-paragraph">
              {jobDescription}
            </p>
          </div>
          <div className="skill-container">
            <h3>Skill</h3>
            <ul className="skill-inner">
              {skills.map(eachSkill => (
                <li className="skill-inner-item" key={eachSkill.name}>
                  <img src={eachSkill.imageUrl} alt={eachSkill.name} />
                  <h4>{eachSkill.name}</h4>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-of-company">
            <h3>Life at Company</h3>
            <div className="life-of-company-img">
              <p>{lifeAtCompany.description}</p>
              <img src={lifeAtCompany.imageUrl} alt="life at company" />
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  renderSimilarJobs = () => {
    const {jobCardSimilarJobs} = this.state
    return (
      <div className="similar-jobs-container">
        {jobCardSimilarJobs.map(eachSimilarJob => (
          <SimilarJobs key={eachSimilarJob.id} similarJobs={eachSimilarJob} />
        ))}
      </div>
    )
  }

  renderSimilarJobsOnSuccess = () => (
    <div className="card-details-container-inner">
      {this.renderJobCardDetails()}
      <h2>Similar Jobs</h2>
      {this.renderSimilarJobs()}
    </div>
  )

  reRenderApi = () => this.getCardDetailsDataFromApi()

  renderSimilarJobsOnFailure = () => (
    <div className="similar-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h3>Oops! something went wrong</h3>
      <p>We cannot seem to find the page your looking for.</p>
      <button type="button" className="retry-btn" onClick={this.reRenderApi}>
        Retry
      </button>
    </div>
  )

  renderSimilarJobsOnLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderElemntBasedOnStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSimilarJobsOnSuccess()
      case apiStatusConstants.failure:
        return this.renderSimilarJobsOnFailure()
      case apiStatusConstants.inProgress:
        return this.renderSimilarJobsOnLoading()

      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="card-details-container">
          {this.renderElemntBasedOnStatus()}
        </div>
      </div>
    )
  }
}

export default JobCardDetails
