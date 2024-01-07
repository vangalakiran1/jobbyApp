import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobCardItem from '../JobCardItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    profileApiStatus: apiStatusConstants.initial,
    jobDetailsApiStatus: apiStatusConstants.initial,
    jobsDetailsData: [],
    salaryRangeId: '',
    activeCheckBoxList: [],
    searchInputValue: '',
  }

  componentDidMount() {
    this.getProfileDetailsFromApi()
    this.getJobsDetailsFromApi()
  }

  getProfileDetailsFromApi = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, option)
    if (response.ok === true) {
      const responseProfileData = await response.json()
      const data = responseProfileData.profile_details
      const updatedProfileData = {
        name: data.name,
        profileImageUrl: data.profile_image_url,
        shortBio: data.short_bio,
      }
      this.setState({
        profileDetails: updatedProfileData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        profileApiStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobsDetailsFromApi = async () => {
    this.setState({jobDetailsApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {activeCheckBoxList, salaryRangeId, searchInputValue} = this.state
    const type = activeCheckBoxList.join(',')
    // const = activeCheckBoxList

    // const url = 'https://apis.ccbp.in/jobs'
    const url = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${salaryRangeId}&search=${searchInputValue}`
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, option)
    if (response.ok === true) {
      const jobsData = await response.json()
      const updatedJobsData = jobsData.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobsDetailsData: updatedJobsData,
        jobDetailsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        jobDetailsApiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderOnSuccessProfile = () => {
    const {profileDetails} = this.state
    return (
      <div className="profile-container">
        <img
          src={profileDetails.profileImageUrl}
          alt="profile"
          className="profile-img"
        />
        <h1 className="profile-heading">{profileDetails.name}</h1>
        <p className="profile-bio">{profileDetails.shortBio}</p>
      </div>
    )
  }

  reRenderProfileApi = () => {
    this.getProfileDetailsFromApi()
  }

  renderOnFailureProfile = () => (
    <div className="failure-container">
      <button
        type="button"
        className="retry-btn"
        onClick={this.reRenderProfileApi}
      >
        Retry
      </button>
    </div>
  )

  renderProfile = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderOnSuccessProfile()

      case apiStatusConstants.failure:
        return this.renderOnFailureProfile()

      case apiStatusConstants.inProgress:
        return this.renderLoading()

      default:
        return null
    }
  }

  onChangeInputValue = event => {
    this.setState({searchInputValue: event.target.value})
  }

  getSearchedFilteredApiData = () => {
    this.getJobsDetailsFromApi()
  }

  onKeyDownGetApi = event => {
    if (event.key === 'Enter') {
      this.getJobsDetailsFromApi()
    }
  }

  renderSearchInput = () => {
    const {searchInputValue} = this.state
    return (
      <>
        <input
          type="search"
          placeholder="Search"
          className="search-field"
          value={searchInputValue}
          onChange={this.onChangeInputValue}
          onKeyDown={this.onKeyDownGetApi}
        />
        <button
          type="button"
          className="search-btn"
          onClick={this.getSearchedFilteredApiData}
        >
          <AiOutlineSearch size={25} />
          <p className="extra">,</p>
        </button>
      </>
    )
  }

  onChangeType = event => {
    const {activeCheckBoxList} = this.state
    if (activeCheckBoxList.includes(event.target.id)) {
      const updatedType = activeCheckBoxList.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState(
        {activeCheckBoxList: updatedType},
        this.getJobsDetailsFromApi,
      )
    } else {
      this.setState(
        prevState => ({
          activeCheckBoxList: [
            ...prevState.activeCheckBoxList,
            event.target.id,
          ],
        }),
        this.getJobsDetailsFromApi,
      )
    }
  }

  renderCheckBox = () => (
    <ul className="check-box-container">
      {employmentTypesList.map(eachItem => (
        <li key={eachItem.employmentTypeId} className="check-box-field">
          <input
            type="checkbox"
            id={eachItem.employmentTypeId}
            className="check-box-field-input"
            onChange={this.onChangeType}
          />
          <label htmlFor={eachItem.employmentTypeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  onChangeSalaryRange = event => {
    this.setState({salaryRangeId: event.target.id}, this.getJobsDetailsFromApi)
  }

  renderRadioBox = () => (
    <ul className="check-box-container">
      {salaryRangesList.map(eachItem => (
        <li key={eachItem.salaryRangeId} className="check-box-field">
          <input
            type="radio"
            id={eachItem.salaryRangeId}
            name="option"
            className="check-box-field-input"
            onChange={this.onChangeSalaryRange}
          />
          <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  renderJobsDetails = () => {
    const {jobsDetailsData} = this.state
    const numberOfData = jobsDetailsData.length > 0
    return numberOfData ? (
      <div className="jobs-details-container">
        {jobsDetailsData.map(eachItem => (
          <JobCardItem key={eachItem.id} jobDetailsData={eachItem} />
        ))}
      </div>
    ) : (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h3>No Jobs Found</h3>
        <p>We could not found any jobs. Try other filters.</p>
      </div>
    )
  }

  reRenderJobsApi = () => {
    this.getJobsDetailsFromApi()
  }

  renderJobsDetailsFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h2>Oops! Something Went Wrong</h2>
      <p>We cannot seems to find the page yor looking for.</p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.reRenderJobsApi}
      >
        Retry
      </button>
    </div>
  )

  renderJobsDetailsContent = () => {
    const {jobDetailsApiStatus} = this.state
    switch (jobDetailsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsDetails()
      case apiStatusConstants.failure:
        return this.renderJobsDetailsFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoading()

      default:
        return null
    }
  }

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    return (
      <div>
        <Header />
        <div className="jobs-container">
          <div className="jobs-filter-container">
            <div className="search-box-container search-box-mobile">
              {this.renderSearchInput()}
            </div>
            {this.renderProfile()}
            <hr />
            <h3 className="employment-heading">Type of Employment</h3>
            {this.renderCheckBox()}
            <hr />
            <h3 className="employment-heading">Salary Range</h3>
            {this.renderRadioBox()}
          </div>
          <div className="all-jobs-container">
            <div className="search-box-container search-box-large">
              {this.renderSearchInput()}
            </div>
            {this.renderJobsDetailsContent()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
