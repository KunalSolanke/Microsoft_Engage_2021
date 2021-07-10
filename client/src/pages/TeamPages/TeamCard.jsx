import { ArrowRight16 } from '@carbon/icons-react'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'

/**
 * Teamcard
 * individual team card
 * @component
 */
function TeamCard({card}) {
    const history = useHistory()
    return (
        <div className="bx--card-group__cards__col">
            <div className="bx--card-group__card">
                <div className="bx--tile bx--card bx--card__CTA" data-autoid="dds--card" onClick={()=>history.push(`/dashboard/teams/${card?._id}`)}>
                    <div className="bx--card__wrapper">
                        <div className="bx--card__content">
                            <h3 className="bx--card__heading" style={{height: "27px"}}>{card?.channel_name}</h3>
                            <div className="bx--card__copy" style={{height: "47px"}}>
                                <p>{card?.description}</p> 
                            </div>
                            <Link to={`/dashboard/teams/${card?._id}`}className="bx--link bx--card__footer" aria-label={card?.channel_name} style={{height: "20px"}}>
                                <ArrowRight16/>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeamCard
