import React from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import {FaUser, FaStar, FaCodeBranch, FaExclamationTriangle} from 'react-icons/fa'
import Card from './card'
import Loading from './Loading'
import Tooltip from './Tooltip'

function LanguagesNav({selected,onUpdateLanguage}){
    const languages = ['All','JavaScript', 'Ruby', 'Java', 'CSS', 'Python']

    return (
        <ul className = 'flex-center'>
            {languages.map((language) => (
                <li key ={language}>
                    <button 
                        className='btn-clear nav-link'
                        style = {language === selected ? {color: "blue"} : null}
                        onClick ={() => onUpdateLanguage(language)}>
                        {language}
                    </button>
                </li>
            ))}
        </ul>
    )
}
LanguagesNav.propTypes = {
    selected: PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired,
}

function ReposGrid({repos}){
    return (
        <ul className='grid space-around'>
            {repos.map((repo,index) => {
                const {name,owner,html_url,stargazers_count, forks, open_issues } = repo
                const {login, avatar_url } = owner

                return (
                    <li key={html_url} >
                        <Card
                            header={`#${index + 1}`}
                            avatar={avatar_url}
                            href={html_url}
                            name={login}
                        
                        >
                            <ul className='card-list'>
                                <li>
                                    <Tooltip text = "Github username">
                                        <FaUser color='rgb(215,123,163)' size={22} />
                                        <a href={`https://github.com/${login}`}>
                                            {login}
                                        </a>
                                    </Tooltip>
                                </li>
                                <li>
                                    <FaStar color='rgb(255, 215, 0)' size = {22}/>
                                    {stargazers_count.toLocaleString()} stars
                                </li>
                                <li>
                                    <FaCodeBranch color='rgb(129, 195, 245)' size = {22}/>
                                    {forks.toLocaleString()} forks
                                </li>
                                <li>
                                    <FaExclamationTriangle color='rgb(241, 138, 147)' size = {22}/>
                                    {open_issues.toLocaleString()} open 
                            
                                </li>

                            </ul>
                        </Card>   
                    </li>
                )
            })}
        </ul>
    )
}

ReposGrid.propTypes = {
    repos: PropTypes.array.isRequired
}

export default class Popular extends React.Component {
    state = {
        selelectedLanguage: 'All',
        repos: {},
        error: null
    }

    componentWillMount = () => {
        this.updateLanguage(this.state.selelectedLanguage)
    }
        
    updateLanguage = (selelectedLanguage) => {
        this.setState({
            selelectedLanguage,
            error: null,

        })

        if (!this.state.repos[selelectedLanguage]) {
            fetchPopularRepos(selelectedLanguage)
            .then((data) => {
                this.setState(({repos}) => ({
                    repos: {
                        ...repos,
                        [selelectedLanguage]: data
                    }

                }))
            })
            .catch((error) => {
                console.warn('Error fetching repos: ', error)
    
                this.setState({
                    error: 'There was an error fetching the repositories.'
                })
            })

        }

    }
    isLoading = () => {
        const { selelectedLanguage, repos, error } = this.state

        return !repos[selelectedLanguage] && error === null

    }
    render(){
        const {selelectedLanguage, repos, error} = this.state
        return (
        <React.Fragment>
            <LanguagesNav
            selected = {selelectedLanguage}
            onUpdateLanguage = {this.updateLanguage} 
            />

            {this.isLoading() && <Loading text='Fetching repos'/>}

            {error && <p className='center-text error'>{error}</p>}

            {repos[selelectedLanguage] && <ReposGrid repos={repos[selelectedLanguage]} />}
        </React.Fragment>
        )}
}